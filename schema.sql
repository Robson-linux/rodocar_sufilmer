-- ==========================================
-- SCRIPT DE CRIAÇÃO E MODELAGEM DO BANCO DE DADOS
-- Projeto: Insulfilm Clear - Películas Automotivas de Alta Performance
-- Estilo: Clear, Minimalista e Profissional
-- Motor: PostgreSQL / MySQL compatível
-- ==========================================

-- Tabela de Usuários (Users)
-- Armazena clientes e administradores do sistema
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY, -- UUID gerado no backend
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hash criptografado (bcryptjs)
    role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Serviços e Agendamentos (Appointments / Services)
-- Registra as simulações e solicitações de aplicação de películas
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(36) PRIMARY KEY, -- UUID do agendamento
    user_id VARCHAR(36) NOT NULL, -- UUID do usuário (Foreign Key de users)
    car_model VARCHAR(100) NOT NULL, -- Modelo do carro (ex: "VW Golf TSI 2023")
    film_type VARCHAR(50) NOT NULL, -- Tipo da Película (Econômica, Premium, Térmica/Cerâmica, Antivandalismo)
    film_percentage VARCHAR(10) NOT NULL, -- Transparência desejada (G5, G20, G35, G50, etc)
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    appointment_date DATE NOT NULL, -- Data agendada
    appointment_time VARCHAR(10) NOT NULL, -- Horário agendado (ex: "14:30")
    observations TEXT, -- Observações ou requisitos adicionais de customização
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Criar índices adicionais para otimização de buscas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ==========================================
-- CARGA DE DADOS INICIAIS (SEED) PARA TESTES
-- ==========================================

-- Inserir conta administrativa inicial demonstrativa (senha de exemplo hasherizada)
-- Senha de teste padrão do seed: "admin123" (para o admin) e "cliente123" (para o cliente)
-- Nota: No sistema real, o backend cuidará do registro e validação segura.
INSERT INTO users (id, name, email, password, role) 
VALUES (
    'admin-uuid-0001', 
    'Administrador Clear', 
    'admin@clearfilm.com.br', 
    '$2a$10$wE99SjOnjTvefe5sC7aOnulmsB8qfT/Y7f.F3yJofUoPbyI3dCOj2', -- Hash bcrypt para "admin123"
    'admin'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, name, email, password, role) 
VALUES (
    'client-uuid-0002', 
    'Carlos Alberto Silva', 
    'carlos@gmail.com', 
    '$2a$10$a/R2aRHeXNizX2T8h.B/H.a3o0.9iQvQx6z6A9/hU0gIDfmsbV.1G', -- Hash bcrypt para "cliente123"
    'client'
) ON CONFLICT (email) DO NOTHING;

-- Inserir agendamentos demonstrativos
INSERT INTO appointments (id, user_id, car_model, film_type, film_percentage, status, appointment_date, appointment_time, observations)
VALUES (
    'apt-uuid-0001',
    'client-uuid-0002',
    'Audi A4 Sedan 2022',
    'Térmica/Cerâmica',
    'G20',
    'pending',
    '2026-06-01',
    '10:00',
    'Cliente solicita aplicação cuidadosa garantindo a privacidade total sem prejudicar visibilidade noturna.'
) ON CONFLICT (id) DO NOTHING;
