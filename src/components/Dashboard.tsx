import React, { useState, useEffect } from "react";
import type { User, Appointment } from "../types";
import { 
  Calendar, 
  Clock, 
  Car, 
  Layers, 
  Plus, 
  LogOut, 
  CheckCircle2, 
  X, 
  Info, 
  Trash2, 
  FileCheck, 
  ShieldAlert,
  ArrowRight,
  Filter,
  User as UserIcon
} from "lucide-react";

interface DashboardProps {
  user: User;
  token: string;
  onLogout: () => void;
}

export default function Dashboard({ user, token, onLogout }: DashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states para agendamento
  const [carModel, setCarModel] = useState<string>("");
  const [filmType, setFilmType] = useState<string>("Térmica/Cerâmica");
  const [filmPercentage, setFilmPercentage] = useState<string>("G20");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("09:00");
  const [observations, setObservations] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showScheduleForm, setShowScheduleForm] = useState<boolean>(false);

  // Filtros administrativos e de cliente
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/appointments", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Falha ao carregar agendamentos do servidor.");
      }
      setAppointments(data.appointments || []);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  // Função para cadastrar novo agendamento
  const handleScheduleService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carModel.trim() || !filmType || !filmPercentage || !date || !time) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios do agendamento.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          carModel,
          filmType,
          filmPercentage,
          appointment_date: date,
          appointment_time: time,
          observations
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao registrar novo agendamento.");
      }

      setSuccessMsg("Seu agendamento de película foi submetido com sucesso!");
      
      // Limpar form
      setCarModel("");
      setObservations("");
      setDate("");
      
      // Esconder formulário após o sucesso de forma amigável
      setTimeout(() => {
        setShowScheduleForm(false);
        setSuccessMsg(null);
      }, 2000);

      // Recarregar lista atualizada do backend
      fetchAppointments();

    } catch (err: any) {
      setErrorMsg(err.message || "Houve uma interrupção de conectividade.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função do Admin para atualizar o status do agendamento
  const handleUpdateStatus = async (apptId: string, newStatus: string) => {
    setErrorMsg(null);
    try {
      const response = await fetch(`/api/appointments/${apptId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao modificar o status.");
      }

      // Atualiza estado local de forma ultra suave
      setAppointments(prev => 
        prev.map(apt => apt.id === apptId ? { ...apt, status: newStatus as any } : apt)
      );

      setSuccessMsg(`Status do serviço atualizado para "${getStatusLabel(newStatus)}"`);
      setTimeout(() => setSuccessMsg(null), 3500);

    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Cancelar ou remover agendamento
  const handleCancelAppointment = async (apptId: string) => {
    if (!window.confirm("Deseja realmente cancelar/remover esta solicitação de instalação?")) return;

    setErrorMsg(null);
    try {
      const response = await fetch(`/api/appointments/${apptId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao deletar agendamento.");
      }

      setAppointments(prev => prev.filter(apt => apt.id !== apptId));
      setSuccessMsg("Agendamento cancelado com sucesso.");
      setTimeout(() => setSuccessMsg(null), 3000);
      
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Tradutor de Status em Badges
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Aguardando Análise";
      case "confirmed": return "Confirmado";
      case "in_progress": return "Instalando Película";
      case "completed": return "Concluído & Garantia Ativa";
      case "cancelled": return "Cancelado";
      default: return status;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200/50";
      case "confirmed":
        return "bg-cyan-50 text-cyan-700 border-cyan-200/50";
      case "in_progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/50";
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/50";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/50";
    }
  };

  // Filtragem dos agendamentos
  const filteredAppointments = appointments.filter(apt => {
    if (statusFilter === "all") return true;
    return apt.status === statusFilter;
  });

  return (
    <div className="bg-slate-50/50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* CABEÇALHO DO PAINEL */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-mono">
              Painel de Integração {user.role === "admin" ? "Admnistrativo" : "do Cliente"}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Olá, {user.name}
              </h2>
              {user.role === "admin" && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-950 text-white tracking-wider">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Email cadastrado: <span className="font-medium text-slate-700">{user.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            {user.role === "client" && (
              <button
                onClick={() => setShowScheduleForm(!showScheduleForm)}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-900 border border-transparent text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-2xs"
              >
                {showScheduleForm ? (
                  <>
                    <X className="w-4 h-4" /> Cancelar Preenchimento
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Solicitar Instalação
                  </>
                )}
              </button>
            )}

            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 hover:text-slate-800 transition"
              title="Sair do painel"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>

        {/* FEEDBACK STATUS */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold">Ocorreu um erro:</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold">Sucesso!</p>
              <p className="mt-0.5">{successMsg}</p>
            </div>
          </div>
        )}

        {/* FORMULÁRIO DE CADASTRO DE AGENDAMENTO (VISÍVEL SÓ PARA CLIENTE SE ELE SOLICITAR) */}
        {user.role === "client" && showScheduleForm && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm animate-fade-in">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-800">Agendar Aplicação de Insulfilm</h3>
              <p className="text-xs text-slate-500 mt-1">
                Forneça os detalhes do seu carro e escolha as especificações da película. Nossa mesa de serviços confirmará rápido.
              </p>
            </div>

            <form onSubmit={handleScheduleService} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Modelo do Veículo */}
              <div className="md:col-span-6">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Modelo e Ano do Carro *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Car className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="Ex: Polo Highline 2024 / Honda Civic 2021"
                    className="w-full text-slate-800 pl-9 pr-3 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-800 transition"
                  />
                </div>
              </div>

              {/* Tipo da película */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tipo de Película *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Layers className="w-4 h-4" />
                  </span>
                  <select
                    value={filmType}
                    onChange={(e) => setFilmType(e.target.value)}
                    className="w-full text-slate-800 pl-9 pr-3 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-800 transition appearance-none"
                  >
                    <option value="Econômica">Econômica (Estética)</option>
                    <option value="Premium">Premium (Reforço Térmico)</option>
                    <option value="Térmica/Cerâmica">Térmica/Cerâmica (Nano Tech)</option>
                    <option value="Antivandalismo">Antivandalismo (Segurança PS4)</option>
                  </select>
                </div>
              </div>

              {/* Transparência película */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Transparência Solicitada *
                </label>
                <select
                  value={filmPercentage}
                  onChange={(e) => setFilmPercentage(e.target.value)}
                  className="w-full text-slate-800 px-3 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-800 transition"
                >
                  <option value="G5">G5 (Visual Muito Escuro/Privacidade Absoluta)</option>
                  <option value="G20">G20 (Visual Escuro/Mais Equilibrado)</option>
                  <option value="G35">G35 (Visual Médio Clássico)</option>
                  <option value="G50">G50 (Visual Claro Discreto)</option>
                  <option value="G70">G70 (Para-brisa/Claro Térmico)</option>
                </select>
              </div>

              {/* Data da visita */}
              <div className="md:col-span-6">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Data de Preferência *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-slate-800 pl-9 pr-3 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-800 transition"
                  />
                </div>
              </div>

              {/* Hora da visita */}
              <div className="md:col-span-6">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Horário de Preferência *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Clock className="w-4 h-4" />
                  </span>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-slate-800 pl-9 pr-3 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-800 transition appearance-none"
                  >
                    <option value="08:00">08:00 (Manhã)</option>
                    <option value="09:30">09:30 M (Manhã)</option>
                    <option value="11:00">11:00 M (Manhã)</option>
                    <option value="13:30">13:30 T (Tarde)</option>
                    <option value="15:00">15:00 T (Tarde)</option>
                    <option value="16:30">16:30 T (Tarde)</option>
                  </select>
                </div>
              </div>

              {/* Observações */}
              <div className="md:col-span-12">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Observações / Detalhes de Customização
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ex: Gostaria de filmar apenas laterais e vidro traseiro, ou película antivandalismo focado na segurança de impactos..."
                  rows={3}
                  className="w-full text-slate-800 p-3 bg-slate-50/60 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-800 transition resize-none"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="md:col-span-12 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-55"
                >
                  {isSubmitting ? "Registrando no Banco..." : "Confirmar Agendamento"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LISTA / LINHA DO TEMPO DOS AGENDAMENTOS */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
          
          {/* BARRA DE FILTROS */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {user.role === "admin" ? "Listagem Geral de Ordens & Serviços" : "Seus Agendamentos de Película"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {user.role === "admin" 
                  ? "Monitore ordens, aprove serviços e altere a fase operacional do veículo."
                  : "Consulte o status do seu agendamento em tempo real com nossa oficina."}
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <span className="text-slate-400 text-xs shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filtrar Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs text-slate-700 bg-white border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-hidden"
              >
                <option value="all">Ver Todos</option>
                <option value="pending">Aguardando Análise</option>
                <option value="confirmed">Confirmados</option>
                <option value="in_progress">Em Execução</option>
                <option value="completed">Concluídos</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <span className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-slate-900 border-r-2 mb-2"></span>
              <p className="text-xs">Sincronizando registros do banco de dados simulado...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-12 text-center text-slate-400 max-w-sm mx-auto">
              {statusFilter === "all" ? (
                <>
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-700 text-sm">Nenhum Serviço Agendado</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {user.role === "admin"
                      ? "Incrível! Nenhum agendamento foi registrado ainda para simulação."
                      : "Você ainda não possui solicitações de agendamento de Insulfilm."}
                  </p>
                  {user.role === "client" && (
                    <button
                      onClick={() => setShowScheduleForm(true)}
                      className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Cadastrar Primeiro Agendamento
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Info className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-700 text-sm">Nenhum Registro Encontrado</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Não há agendamentos com este status específico no momento.
                  </p>
                </>
              )}
            </div>
          ) : (
            /* TABELA / CARDS DE AGENDAMENTOS */
            <div className="divide-y divide-slate-100">
              {filteredAppointments.map((apt) => (
                <div key={apt.id} className="p-5 md:p-6 hover:bg-slate-50/40 transition-all duration-150">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    
                    {/* INFO PRINCIPAL DO CARRO E SERVIÇO */}
                    <div className="lg:col-span-5 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold border font-mono tracking-wide shadow-3xs bg-white text-slate-800 border-slate-200">
                          {apt.filmType} - {apt.filmPercentage}
                        </span>
                        
                        {/* Indicador de Status */}
                        <span className={`inline-flex items-center border px-2.5 py-0.5 rounded-full text-[11px] font-medium leading-none ${getStatusBadgeClass(apt.status)}`}>
                          {getStatusLabel(apt.status)}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-800 flex items-center gap-2 mt-2">
                        <Car className="w-4 h-4 text-slate-400" /> {apt.carModel}
                      </h4>

                      {/* Autor (Exibe apenas para o admin saber de qual cliente pertence) */}
                      {user.role === "admin" && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-50 py-1 px-2.5 rounded-lg border border-slate-100 max-w-xs">
                          <UserIcon className="w-3 h-3" /> Proprietário: <span className="font-semibold text-slate-600">{apt.userName || "Cliente Desconhecido"}</span>
                        </div>
                      )}

                      {apt.observations && (
                        <p className="text-xs text-slate-500 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 border-dashed leading-relaxed italic">
                          "{apt.observations}"
                        </p>
                      )}
                    </div>

                    {/* DATAS E HORÁARIOS */}
                    <div className="lg:col-span-3 flex flex-row lg:flex-col gap-4 lg:gap-1.5 lg:justify-center">
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Data: <strong>{new Date(apt.appointment_date + "T00:00:00").toLocaleDateString('pt-BR')}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Horário: <strong>{apt.appointment_time} Hs</strong></span>
                      </div>
                    </div>

                    {/* INTERAÇÕES / OPERACIONAIS DO ADMIN OU CLIENTE */}
                    <div className="lg:col-span-4 flex justify-end items-center gap-2 self-center pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                      
                      {/* INTERAÇÕES DO ADMIN: CONTROLAR STATUS */}
                      {user.role === "admin" && (
                        <div className="flex items-center gap-1.5 w-full lg:w-auto">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase hidden xl:inline">
                            Ação Admin:
                          </span>
                          <select
                            value={apt.status}
                            onChange={(e) => handleUpdateStatus(apt.id, e.target.value)}
                            className="flex-1 lg:flex-none text-xs text-slate-800 bg-white border border-slate-200/85 rounded-xl py-2 px-2.5 focus:outline-hidden font-semibold hover:border-slate-400 transition"
                          >
                            <option value="pending">Pendente (Análise)</option>
                            <option value="confirmed">Confirmar Serviço</option>
                            <option value="in_progress">Em Execução</option>
                            <option value="completed">Concluir & Ativar Garantia</option>
                            <option value="cancelled">Cancelar Solicitação</option>
                          </select>
                        </div>
                      )}

                      {/* INTERAÇÕES DO CLIENTE: REMOVER SE FOR PENDENTE */}
                      {user.role === "client" && apt.status === "pending" && (
                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50/50 rounded-lg transition"
                          title="Cancelar e deletar solicitação"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Cancelar
                        </button>
                      )}

                      {/* CERTIFICADO DE GARANTIA DIGITAL (SE ESTIVER COMPLETED) */}
                      {apt.status === "completed" && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-150 shadow-3xs cursor-pointer hover:bg-emerald-100/60 transition">
                          <FileCheck className="w-4 h-4 text-emerald-600" /> Certificado de Garantia Emitido
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INFORMAÇÕES DE GARANTIA E INSTRUÇÕES PARA REPOSIÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-3xs">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-500" /> Cuidados pós-aplicação recomendados:
            </h4>
            <ul className="text-xs text-slate-500 mt-2 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Mantenha os vidros completamente fechados por no mínimo 48 horas.</li>
              <li>Não utilize desembaçador térmico traseiro nas primeiras 72 horas.</li>
              <li>Limpe as películas apenas com pano macio umedecido em água e sabão neutro.</li>
              <li>Evite produtos abrasivos, álcool comum, ou limpa-vidros tradicionais.</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-3xs flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Termo de Garantia Clear Film:
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Todas as nossas películas vêm acompanhadas de certificação digital pós-serviço. Revestimentos Térmicos de Nano Cerâmica protegem sua família com garantia vitalícia contra desbotamento, bolhas ou descolamento.
              </p>
            </div>
            <div className="text-[10px] text-slate-400 mt-3 font-mono">
              Código de integridade do selo: <span className="font-semibold text-slate-600">CLEAR-CERT-2026-OK</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
