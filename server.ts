import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createServer as createViteServer } from "vite";

// Interfaces para tipagem dos dados no nosso banco simulado
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "client" | "admin";
  created_at: string;
}

interface Appointment {
  id: string;
  userId: string;
  userName?: string; // Para auxiliar a visualização no admin
  carModel: string;
  filmType: string;
  filmPercentage: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  appointment_date: string;
  appointment_time: string;
  observations?: string;
  created_at: string;
}

interface DBStructure {
  users: User[];
  appointments: Appointment[];
}

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "clear_insulfilm_super_premium_secret_key_2026";
const DATA_FILE = path.join(process.cwd(), "db-simulated.json");

// Função para iniciar e garantir dados padrão
function initializeDatabase(): DBStructure {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    } catch (e) {
      console.error("Erro ao ler banco de dados persistido. Reiniciando...", e);
    }
  }

  // Se não existir, gera dados padrão criptografados
  const salt = bcrypt.genSaltSync(10);
  const defaultDB: DBStructure = {
    users: [
      {
        id: "admin-uuid-0001",
        name: "Administrador Clear",
        email: "admin@clearfilm.com.br",
        passwordHash: bcrypt.hashSync("admin123", salt),
        role: "admin",
        created_at: new Date().toISOString(),
      },
      {
        id: "client-uuid-0002",
        name: "Carlos Alberto Silva",
        email: "carlos@gmail.com",
        passwordHash: bcrypt.hashSync("cliente123", salt),
        role: "client",
        created_at: new Date().toISOString(),
      },
    ],
    appointments: [
      {
        id: "apt-uuid-0001",
        userId: "client-uuid-0002",
        userName: "Carlos Alberto Silva",
        carModel: "Audi A4 Sedan 2022",
        filmType: "Térmica/Cerâmica",
        filmPercentage: "G20",
        status: "pending",
        appointment_date: "2026-06-01",
        appointment_time: "10:00",
        observations: "Cliente solicita aplicação especial, garantindo total privacidade e ótima visibilidade noturna.",
        created_at: new Date().toISOString(),
      }
    ],
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultDB, null, 2));
  return defaultDB;
}

// Persistir novos dados
function saveDatabase(db: DBStructure) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

// Carrega os dados na inicialização
let dbState = initializeDatabase();

// Middleware para estender a Request com informações do usuário autenticado
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "client" | "admin";
    name: string;
  };
}

// Middleware de Autenticação JWT
function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Formato "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: "Token não providenciado" });
    }

    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
      if (err) {
        return res.status(403).json({ error: "Token inválido ou expirado" });
      }
      req.user = userPayload as { id: string; email: string; role: "client" | "admin"; name: string };
      next();
    });
  } else {
    res.status(401).json({ error: "Cabeçalho de autorização ausente" });
  }
}

async function startServer() {
  const app = express();
  
  // Middlewares essenciais para rotas de API
  app.use(express.json());

  // --- ROTAS DA API REST ---

  // 1. Cadastrar Usuário (POST `/api/auth/register`)
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      // Validação simples
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Todos os campos (nome, email, senha) são obrigatórios." });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "A senha deve ter no mínimo 6 caracteres." });
      }

      // Evitar duplicidades
      const emailLower = email.toLowerCase().trim();
      const userExists = dbState.users.find((u) => u.email.toLowerCase() === emailLower);
      if (userExists) {
        return res.status(400).json({ error: "Este endereço de email já está cadastrado." });
      }

      // Criptografar senha
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Criar usuário
      const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email: emailLower,
        passwordHash,
        role: "client", // Padrão é sempre cliente
        created_at: new Date().toISOString(),
      };

      dbState.users.push(newUser);
      saveDatabase(dbState);

      // Gerar Token JWT imediatamente para autenticar
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        message: "Usuário registrado com sucesso!",
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (e) {
      console.error("Erro no cadastro:", e);
      res.status(500).json({ error: "Erro interno no servidor ao cadastrar." });
    }
  });

  // 2. Login (POST `/api/auth/login`)
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
      }

      const emailLower = email.toLowerCase().trim();
      const user = dbState.users.find((u) => u.email.toLowerCase() === emailLower);

      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas. Verifique seu email e senha." });
      }

      // Validar senha
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: "Credenciais inválidas. Verifique seu email e senha." });
      }

      // Criar Token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login realizado com sucesso!",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (e) {
      console.error("Erro no login:", e);
      res.status(500).json({ error: "Erro interno no servidor ao fazer login." });
    }
  });

  // 3. Obter dados do usuário conectado (GET `/api/auth/me`)
  app.get("/api/auth/me", authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: req.user });
  });

  // 4. Obter compromissos/agendamentos (GET `/api/appointments`)
  app.get("/api/appointments", authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Nenhum usuário autenticado encontrado." });

    if (req.user.role === "admin") {
      // Admin vê todos os agendamentos cadastrados no sistema
      res.json({ appointments: dbState.appointments });
    } else {
      // Cliente comum vê apenas os seus próprios agendamentos
      const userApts = dbState.appointments.filter((a) => a.userId === req.user?.id);
      res.json({ appointments: userApts });
    }
  });

  // 5. Agendar novo serviço (POST `/api/appointments`)
  app.post("/api/appointments", authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Não autorizado" });

      const { carModel, filmType, filmPercentage, appointment_date, appointment_time, observations } = req.body;

      if (!carModel || !filmType || !filmPercentage || !appointment_date || !appointment_time) {
        return res.status(400).json({ error: "Para realizar o agendamento, preencha todos os campos obrigatórios." });
      }

      const newAppt: Appointment = {
        id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: req.user.id,
        userName: req.user.name,
        carModel: carModel.trim(),
        filmType,
        filmPercentage,
        status: "pending",
        appointment_date,
        appointment_time,
        observations: observations ? observations.trim() : "",
        created_at: new Date().toISOString(),
      };

      dbState.appointments.push(newAppt);
      saveDatabase(dbState);

      res.status(201).json({
        message: "Serviço agendado com sucesso! Aguarde a confirmação de nossa equipe.",
        appointment: newAppt,
      });
    } catch (e) {
      console.error("Erro ao criar agendamento:", e);
      res.status(500).json({ error: "Falha ao registrar agendamento no servidor." });
    }
  });

  // 6. Atualizar status do agendamento (PUT `/api/appointments/:id/status`) - Uso exclusivo do Admin
  app.put("/api/appointments/:id/status", authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Não autorizado" });
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Permissão negada. Apenas administradores podem atualizar status de serviços." });
      }

      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Status inválido fornecido." });
      }

      const aptIndex = dbState.appointments.findIndex((a) => a.id === id);
      if (aptIndex === -1) {
        return res.status(404).json({ error: "Agendamento não encontrado." });
      }

      dbState.appointments[aptIndex].status = status as any;
      saveDatabase(dbState);

      res.json({
        message: "Status atualizado com sucesso!",
        appointment: dbState.appointments[aptIndex],
      });
    } catch (e) {
      console.error("Erro ao atualizar agendamento:", e);
      res.status(500).json({ error: "Falha ao atualizar agendamento no servidor." });
    }
  });

  // 7. Cancelar agendamento (DELETE `/api/appointments/:id` ou PUT para 'cancelled')
  app.delete("/api/appointments/:id", authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Não autorizado" });

      const { id } = req.params;
      const aptIndex = dbState.appointments.findIndex((a) => a.id === id);

      if (aptIndex === -1) {
        return res.status(404).json({ error: "Agendamento não encontrado." });
      }

      const appointment = dbState.appointments[aptIndex];

      // Usuário comum só pode remover/cancelar as próprias ordens
      // E apenas se ainda não foram consumadas (status pending)
      if (req.user.role !== "admin" && appointment.userId !== req.user.id) {
        return res.status(403).json({ error: "Você não tem autorização para remover este agendamento." });
      }

      // Em vez de deletar fisicamente, vamos marcar como cancelado ou remover se for pendente
      if (appointment.status === "pending" || req.user.role === "admin") {
        dbState.appointments.splice(aptIndex, 1);
        saveDatabase(dbState);
        res.json({ message: "Agendamento removido com sucesso." });
      } else {
        // Se já está confirmado ou em progresso, o usuário não pode simplesmente deletar, marcamos como cancelado
        appointment.status = "cancelled";
        saveDatabase(dbState);
        res.json({ message: "Solicitação de cancelamento gravada com sucesso." });
      }
    } catch (e) {
      console.error("Erro ao remover agendamento:", e);
      res.status(500).json({ error: "Falha ao cancelar agendamento no servidor." });
    }
  });

  // --- CONFIGURAÇÃO DO VITE / SERVIR FRONT-END ---

  // Vite middleware setup para desenvolvimento, senão servir pasta de arquivos estáticos
  if (process.env.NODE_ENV !== "production") {
    console.log("Configurando servidor em modo de DESENVOLVIMENTO (Vite Middleware)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Configurando servidor em modo de PRODUÇÃO (Serving dist/)...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Insulfilm Clear Server] Rodando com sucesso na porta ${PORT}`);
    console.log(`URL de teste: http://localhost:${PORT}`);
  });
}

startServer().catch((e) => {
  console.error("Falha ao iniciar o servidor express:", e);
});
