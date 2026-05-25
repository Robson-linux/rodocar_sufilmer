import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AuthPanel from "./components/AuthPanel";
import Dashboard from "./components/Dashboard";
import type { User } from "./types";
import { Calendar, ShieldAlert, X, Sparkles, User as UserIcon } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "register">("login");
  const [activeView, setActiveView] = useState<"home" | "dashboard">("home");
  const [checkingSession, setCheckingSession] = useState<boolean>(true);

  // Auto-login ao carregar a página se houver token salvo
  useEffect(() => {
    const savedToken = localStorage.getItem("clearfilm_token");
    if (savedToken) {
      fetch("/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${savedToken}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Sessão expirada");
          }
          return res.json();
        })
        .then(data => {
          setToken(savedToken);
          setUser(data.user);
          // Opcionalmente direciona direto ao painel se já estava lá
          const lastView = localStorage.getItem("clearfilm_view");
          if (lastView === "dashboard") {
            setActiveView("dashboard");
          }
        })
        .catch(err => {
          console.log("Token inválido ou expirado. Limpando histórico...", err);
          localStorage.removeItem("clearfilm_token");
          localStorage.removeItem("clearfilm_view");
        })
        .finally(() => {
          setCheckingSession(false);
        });
    } else {
      setCheckingSession(false);
    }
  }, []);

  // Callback de sucesso ao autenticar
  const handleAuthSuccess = (newToken: string, authenticatedUser: User) => {
    setToken(newToken);
    setUser(authenticatedUser);
    localStorage.setItem("clearfilm_token", newToken);
    localStorage.setItem("clearfilm_view", "dashboard");
    setActiveView("dashboard");
    setShowAuthModal(false);
  };

  // Callback de Logout comercial
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setActiveView("home");
    localStorage.removeItem("clearfilm_token");
    localStorage.removeItem("clearfilm_view");
  };

  const handleOpenAuth = (mode: "login" | "register") => {
    setAuthInitialMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-50">
      
      {/* Barra superior de status para usuários logados */}
      {user && activeView === "home" && !checkingSession && (
        <div className="bg-slate-900 text-white text-xs py-3 px-4 flex justify-between items-center z-40 relative">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sessão ativa como <strong>{user.name}</strong> ({user.role === "admin" ? "Administrador" : "Cliente"})</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView("dashboard")}
              className="px-3 py-1 bg-white text-slate-900 rounded-md font-bold text-[10px] uppercase hover:bg-slate-100 transition whitespace-nowrap"
            >
              Ir para o Painel
            </button>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-white transition"
            >
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Renderização condicional das telas */}
      {checkingSession ? (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white text-slate-400">
          <span className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-slate-900 border-r-2 mb-2"></span>
          <p className="text-xs font-mono">Restabelecendo conexões seguras...</p>
        </div>
      ) : activeView === "home" ? (
        <LandingPage
          user={user}
          onOpenAuth={() => handleOpenAuth("login")}
          onGoToDashboard={() => setActiveView("dashboard")}
        />
      ) : (
        /* Seção do Dashboard Protegido */
        <>
          {/* Menu de atalho para voltar Home */}
          <div className="bg-white border-b border-slate-100 py-3.5 px-6 flex justify-between items-center">
            <span 
              onClick={() => setActiveView("home")} 
              className="font-bold text-slate-800 text-sm tracking-tight cursor-pointer hover:text-indigo-600 transition flex items-center gap-1.5"
            >
              ← Voltar ao Site Institucional
            </span>
            <div className="text-xs text-slate-400 hidden sm:block">
              Precisa de ajuda? Chamados: <strong>0800 123 4567</strong>
            </div>
          </div>
          
          {user ? (
            <Dashboard
              user={user}
              token={token!}
              onLogout={handleLogout}
            />
          ) : (
            <div className="py-24 text-center max-w-sm mx-auto space-y-4">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-lg font-bold">Acesso Restrito</h3>
              <p className="text-xs text-slate-500">Por favor, realize a autenticação com sua conta para acessar esses recursos.</p>
              <button 
                onClick={() => handleOpenAuth("login")} 
                className="py-2 px-5 bg-slate-950 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition"
              >
                Efetuar Login
              </button>
            </div>
          )}
        </>
      )}

      {/* MODAL OVERLAY DE AUTENTICAÇÃO */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in">
          <div className="relative w-full max-w-md animate-scale-up">
            
            {/* Fechar Modal */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 rounded-full transition"
              aria-label="Close modal"
              id="btn-close-modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Painel Reutilizável de Formulários */}
            <AuthPanel
              initialMode={authInitialMode}
              onSuccess={handleAuthSuccess}
            />
          </div>
        </div>
      )}

    </div>
  );
}
