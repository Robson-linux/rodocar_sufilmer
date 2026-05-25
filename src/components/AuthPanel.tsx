import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface AuthPanelProps {
  onSuccess: (token: string, user: { id: string; name: string; email: string; role: "client" | "admin" }) => void;
  initialMode?: "login" | "register";
}

export default function AuthPanel({ onSuccess, initialMode = "login" }: AuthPanelProps) {
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === "login");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Validação de campos front-end
  const validateForm = () => {
    setErrorMsg(null);

    if (!isLogin && !name.trim()) {
      setErrorMsg("O nome completo é obrigatório para cadastro.");
      return false;
    }

    if (!email.trim()) {
      setErrorMsg("O endereço de email é obrigatório.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Por favor, digite um endereço de email válido.");
      return false;
    }

    if (!password) {
      setErrorMsg("A senha é obrigatória.");
      return false;
    }

    if (password.length < 6) {
      setErrorMsg("A senha segurança deve ter no mínimo 6 caracteres.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin
      ? { email: email.toLowerCase().trim(), password }
      : { name: name.trim(), email: email.toLowerCase().trim(), password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Algo deu errado durante a autenticação.");
      }

      setSuccessMsg(data.message || "Sucesso!");
      
      // Delay suave para usufruir da animação de sucesso
      setTimeout(() => {
        onSuccess(data.token, data.user);
      }, 1000);

    } catch (err: any) {
      setErrorMsg(err.message || "Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
          {isLogin ? "Acesse sua Conta" : "Crie sua Conta Grátis"}
        </h3>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
          {isLogin
            ? "Gerencie seus agendamentos e consulte garantias ativas."
            : "Cadastre-se para agendar uma aplicação de película em menos de 1 minuto."}
        </p>
      </div>

      {/* Exibição de Erros */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-start gap-2 animate-pulse">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Exibição de Sucesso */}
      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nome - Visível apenas no Cadastro */}
        {!isLogin && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Nome Completo
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Alberto Silva"
                className="w-full text-slate-800 pl-9 pr-3 py-2.5 bg-slate-50/60 border border-slate-200/80 rounded-xl text-sm focus:outline-hidden focus:border-slate-800 transition"
              />
            </div>
          </div>
        )}

        {/* Campo Email */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Endereço de E-mail
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: carlos@gmail.com"
              className="w-full text-slate-800 pl-9 pr-3 py-2.5 bg-slate-50/60 border border-slate-200/80 rounded-xl text-sm focus:outline-hidden focus:border-slate-800 transition"
            />
          </div>
        </div>

        {/* Campo Senha */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Senha de Acesso
            </label>
            {isLogin && (
              <span className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer">
                Esqueceu a senha?
              </span>
            )}
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-slate-800 pl-9 pr-3 py-2.5 bg-slate-50/60 border border-slate-200/80 rounded-xl text-sm focus:outline-hidden focus:border-slate-800 transition"
            />
          </div>
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={loading || !!successMsg}
          className="w-full flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-900 border border-transparent text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition active:scale-98 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : (
            <>
              {isLogin ? "Entrar na Conta" : "Criar Minha Conta"}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Rodapé Alternável */}
      <div className="mt-5 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          {isLogin ? "Ainda não possui conta?" : "Já possui cadastro ativo?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg(null);
            }}
            className="text-slate-800 hover:underline font-semibold"
          >
            {isLogin ? "Cadastre-se grátis" : "Faça login agora"}
          </button>
        </p>
      </div>

      {/* Dica amigável com credenciais do banco para simulação facilitada */}
      <div className="mt-4 p-2.5 rounded-lg bg-indigo-50/30 border border-indigo-100/30 text-left">
        <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
          <strong className="text-slate-600 block mb-0.5">💡 Credenciais do Seed para teste:</strong>
          • Admin: <span className="text-slate-600 select-all">admin@clearfilm.com.br</span> / <span className="text-slate-600 select-all">admin123</span><br />
          • Cliente: <span className="text-slate-600 select-all">carlos@gmail.com</span> / <span className="text-slate-600 select-all font-medium">cliente123</span>
        </p>
      </div>
    </div>
  );
}
