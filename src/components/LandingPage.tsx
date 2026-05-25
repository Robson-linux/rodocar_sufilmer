import React, { useState } from "react";
import TintSimulator from "./TintSimulator";
import type { User } from "../types";
import { 
  Shield, 
  Sun, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Car, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  Clock, 
  Menu, 
  X,
  FileText,
  User as UserIcon,
  HelpCircle
} from "lucide-react";

interface LandingPageProps {
  user: User | null;
  onOpenAuth: () => void;
  onGoToDashboard: () => void;
}

export default function LandingPage({ user, onOpenAuth, onGoToDashboard }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const services = [
    {
      id: "economica",
      title: "Consumo Econômica",
      desc: "Excelente custo-benefício focado na alteração estética do veículo. Garante privacidade padrão e controle básico de luminosidade.",
      uvRejection: "95%",
      heatBlock: "20%",
      warranty: "1 Ano",
      price: "A partir de R$ 180"
    },
    {
      id: "premium",
      title: "Carbon Protection Premium",
      desc: "Película reforçada pigmentada em carbono com excelente estabilidade de cor (não desbota nem fica roxo) e ótimo filtro de luz.",
      uvRejection: "99%",
      heatBlock: "50%",
      warranty: "5 Anos",
      price: "A partir de R$ 380"
    },
    {
      id: "termica",
      title: "Nano Cerâmica Térmica",
      desc: "O pináculo da tecnologia de isolamento térmico. Rejeita o calor infravermelho de forma excepcional, mantendo o interior fresco sem escurecer excessivamente.",
      uvRejection: "99.9%",
      heatBlock: "88%",
      warranty: "Vitalícia",
      price: "A partir de R$ 750"
    },
    {
      id: "antivandalismo",
      title: "Blindex Antivandalismo PS4/PS8",
      desc: "Camadas espessas de poliéster de altíssima resistência que retardam o arrombamento de vidros contra impactos de pedras, ferramentas ou furtos rápidos.",
      uvRejection: "99%",
      heatBlock: "45%",
      warranty: "7 Anos",
      price: "A partir de R$ 900"
    }
  ];

  const differentials = [
    {
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      title: "Rejeição Térmica Extrema",
      desc: "Nossos materiais absorvem e dissipam os raios infravermelhos (calor) reduzindo a temperatura em até 9°C e amenizando o esforço do ar condicionado."
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      title: "Proteção UV Completa (FPS 50+)",
      desc: "Bloqueio de 99.9% dos nocivos raios Ultravioleta (UVA e UVB), protegendo sua pele e evitando o desbotamento acelerado do painel e bancos de couro."
    },
    {
      icon: <Eye className="w-5 h-5 text-indigo-500" />,
      title: "Privacidade & Conforto Visual",
      desc: "Durabilidade com estabilidade óptica imbatível: privacidade total para quem vê de fora, aliado a uma clareza cristalina de dentro para fora."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-sky-500" />,
      title: "Aplicação Premium Certificada",
      desc: "Processos padronizados em cabine semi-estéril, garantindo uma instalação rápida e impecável, livre de bolhas, poeiras ou vincos nos vidros."
    }
  ];

  const portfolio = [
    {
      car: "Porsche Taycan 4S",
      film: "Nano Cerâmica G20",
      year: "2023",
      image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=700"
    },
    {
      car: "BMW M3 Competition",
      film: "Antivandalismo PS4 + Térmica G35",
      year: "2024",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=700"
    },
    {
      car: "Volvo XC90 Recharge",
      film: "Nano Cerâmica G5 (Traseira) e G35 (Frente)",
      year: "2023",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=700"
    }
  ];

  const faqs = [
    {
      q: "Qual a diferença entre a película comum e a película de Nano Cerâmica?",
      a: "As películas comuns (econômicas) apenas escurecem o vidro, reduzindo a luz visível. Já as películas de Nano Cerâmica contêm nanopartículas cerâmicas que bloqueiam seletivamente o calor infravermelho (até 90% de rejeição) sem precisar escurecer muito o vidro, mantendo ótima luminosidade e visão noturna segura."
    },
    {
      q: "O que é e como funciona a película antivandalismo?",
      a: "A película antivandalismo (segurança PS4 a PS8) possui poliéster reforçado com adesivos de alta tração. Ela não impede que o vidro quebre sob um forte impacto, mas mantém todos os estilhaços de vidro presos na película de forma rígida, impossibilitando a invasão rápida ou o acesso ao interior do veículo durante tentativas de furto no trânsito."
    },
    {
      q: "Quanto tempo demora a instalação completa no veículo?",
      a: "Para veículos populares (Hatch/Sedan), a aplicação padrão leva entre 1:30h e 2:30h. Serviços complexos incluindo remoção de películas antigas ou aplicação de películas antivandalismo podem levar de 3h a 4h."
    },
    {
      q: "Qual a recomendação de garantia após a aplicação?",
      a: "Nossas películas contam com garantias oficiais que variam de 1 ano (Econômica) a Vitalícia (Nano Cerâmica). Durante o período de garantia, oferecemos cobertura integral contra descasquetamento, desbotamento de cor natural ou surgimento de bolhas."
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-white font-mono font-bold text-sm tracking-tighter">
              CF
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base font-sans block leading-none">
                CLEAR FILM
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Premium Aesthetics
              </span>
            </div>
          </div>

          {/* Links para Desktop */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#servicos" className="hover:text-slate-900 transition">Serviços</a>
            <a href="#diferenciais" className="hover:text-slate-900 transition">Diferenciais</a>
            <a href="#simulador" className="hover:text-slate-900 transition">Simulador</a>
            <a href="#portfolio" className="hover:text-slate-900 transition">Portfólio</a>
            <a href="#contato" className="hover:text-slate-900 transition">Contato</a>
          </div>

          {/* Área do Cliente ou Login */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button
                onClick={onGoToDashboard}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow-3xs"
              >
                <UserIcon className="w-3.5 h-3.5" /> Meu Painel
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                <UserIcon className="w-3.5 h-3.5" /> Área do Cliente
              </button>
            )}
          </div>

          {/* Botão Hambúrguer Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-slate-600 hover:text-slate-900 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 py-6 space-y-4 animate-fade-in">
            <div className="flex flex-col gap-4 text-sm font-semibold text-slate-600 pl-2">
              <a href="#servicos" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900">Serviços</a>
              <a href="#diferenciais" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900">Diferenciais</a>
              <a href="#simulador" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900">Simulador</a>
              <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900">Portfólio</a>
              <a href="#contato" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900">Contato</a>
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGoToDashboard();
                  }}
                  className="w-full py-2.5 px-4 bg-slate-950 text-white font-semibold rounded-xl text-xs text-center"
                >
                  Ir para o Painel
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs text-center"
                >
                  Entrar / Cadastrar
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white pt-10 pb-16 md:py-24">
        {/* Glow de fundo pastel super delicado */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-100/30 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Lado Esquerdo: Conteúdo Editorial */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
              <Sparkles className="w-3.5 h-3.5" /> Películas Premium de Alta Performance
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                Estética Impecável, <br className="hidden md:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-slate-800">
                  Proteção Térmica Total.
                </span>
              </h1>
              
              <p className="text-slate-500 text-sm md:text-base lg:text-lg leading-relaxed max-w-xl">
                Transforme a experiência interna do seu veículo. Nossas películas de controle solar e antivandalismo reduzem o calor e protegem sua privacidade com precisão cirúrgica de aplicação.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="#simulador"
                className="py-3 px-6 bg-slate-900 border border-transparent text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-2xs text-center flex items-center justify-center gap-2 group"
              >
                Simular Película Online
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </a>
              <button
                onClick={user ? onGoToDashboard : onOpenAuth}
                className="py-3 px-6 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition text-center flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                Agendar Aplicação
              </button>
            </div>

            {/* Micro-Badges de Confiança */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-4">
              <div>
                <span className="block text-xl font-bold text-slate-800 leading-none">99.9%</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1 block">Bloqueio UV</span>
              </div>
              <div className="border-l border-slate-100 pl-4">
                <span className="block text-xl font-bold text-slate-800 leading-none">Até 88%</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1 block">Redução de Calor</span>
              </div>
              <div className="border-l border-slate-100 pl-4">
                <span className="block text-xl font-bold text-slate-800 leading-none">Zero</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1 block">Bolhas ou Vincos</span>
              </div>
            </div>

          </div>

          {/* Lado Direito: Carro Ilustrativo Minimalista */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-b from-slate-100 to-slate-200/50 p-3 rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
                alt="Sleek Luxury Car Window Tinting"
                referrerPolicy="no-referrer"
                className="w-full h-72 md:h-80 object-cover rounded-2xl transition duration-500 group-hover:scale-102"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-6 text-white">
                <span className="text-[10px] font-mono tracking-widest text-indigo-300 uppercase">Aparência de Luxo</span>
                <h4 className="text-base font-bold mt-1">Aplicação Unilateral sem Imperfeições</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">Estética executiva de alta costura homologada pelas montadoras premium.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECÃO: DIFERENCIAIS */}
      <section id="diferenciais" className="py-16 md:py-24 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-mono">
              Por que escolher nossos serviços?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mt-1.5">
              Nossos Compromissos de Alta Engenharia
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Damos a você total controle solar, privacidade refinada e resistência física, utilizando películas de alta performance aplicadas por técnicos altamente experientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {differentials.map((diff, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-xs transition duration-300 hover:translate-y-[-2px] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center">
                    {diff.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm tracking-tight">{diff.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{diff.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SEÇÃO: INTERACTIVE SIMULATOR (Ponto Principal de UX) */}
      <section id="simulador" className="py-16 md:py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <TintSimulator />
        </div>
      </section>

      {/* SEÇÃO: SERVIÇOS & TIPOS DE PELÍCULAS */}
      <section id="servicos" className="py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-mono">
              Tabela de Revestimentos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mt-1.5">
              Escolha a Película Perfeita para seu Carro
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Do estilo clássico ao máximo em segurança. Nossas linhas garantem especificações impecáveis de rebatimento solar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col justify-between hover:shadow-sm hover:border-slate-300 transition duration-300"
              >
                <div className="p-6 space-y-4">
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${
                    service.id === 'termica' 
                      ? 'bg-amber-50 text-amber-700' 
                      : service.id === 'antivandalismo' 
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-slate-50 text-slate-600'
                  }`}>
                    {service.id === 'termica' ? 'Destaque Cerâmica' : service.id === 'antivandalismo' ? 'Alta Segurança' : 'Padrão'}
                  </span>
                  
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                    {service.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[72px]">
                    {service.desc}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100 flex flex-col">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Proteção UV:</span>
                      <span className="font-bold text-slate-700 font-mono">{service.uvRejection}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Rejeição Infravermelho:</span>
                      <span className="font-bold text-slate-700 font-mono">{service.heatBlock}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Garantia:</span>
                      <span className="font-bold text-slate-700">{service.warranty}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100/80 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Estimativa base</span>
                    <span className="text-sm font-bold text-slate-800 font-sans">{service.price}</span>
                  </div>
                  <button 
                    onClick={user ? onGoToDashboard : onOpenAuth}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white transition"
                    title="Agendar este serviço"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SEÇÃO: PORTFÓLIO / GALERIA */}
      <section id="portfolio" className="py-16 md:py-24 bg-white border-y border-slate-105">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-mono">
                Galeria de Projetos Realizados
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mt-1.5">
                Acabamentos Impecáveis
              </h2>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed max-w-xl">
                Confira o visual marcante obtido em carros importados e nacionais atendidos pelo nosso selo de qualidade sob medida.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {portfolio.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-slate-150 overflow-hidden group hover:shadow-xs transition duration-300"
              >
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.car}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-200/40 text-[10px] font-semibold text-slate-800">
                    Ano {item.year}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-slate-800 text-base">{item.car}</h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-slate-300" /> Película: <strong className="text-slate-600 font-medium">{item.film}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SEÇÃO: FAQ */}
      <section className="py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-mono flex items-center justify-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Dúvidas Frequentes (FAQ)
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-1.5">
              Tem alguma dúvida sobre películas?
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl border border-slate-100 p-5 shadow-2xs transition"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  className="w-full flex items-center justify-between text-left focus:outline-hidden"
                >
                  <span className="font-bold text-slate-800 text-sm md:text-base pr-4">
                    {faq.q}
                  </span>
                  <span className="text-slate-400 text-lg font-mono">
                    {faqOpen === index ? "−" : "+"}
                  </span>
                </button>
                
                {faqOpen === index && (
                  <p className="text-xs md:text-sm text-slate-500 mt-3 pt-3 border-t border-slate-100 leading-relaxed font-sans">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SEÇÃO: CONTATO & LOCALIZAÇÃO */}
      <section id="contato" className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Informações de contato */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-mono">
                Agende sua visita
              </span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-1.5">
                Pronto para Elevar o Nível do seu Carro?
              </h2>
              <p className="text-slate-500 text-xs md:text-sm mt-3 leading-relaxed">
                Nossa filial está aberta de segunda a sábado. Agende usando o Painel Digital do Cliente para obter prioridade máxima no atendimento sem filas.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-150">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Endereço da Oficina</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Av. Brigadeiro Luis Antônio, 1420 - Bela Vista, São Paulo - SP</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-150">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Telefone / WhatsApp</h4>
                  <p className="text-xs text-slate-500 mt-0.5">(11) 98765-4321 / (11) 3214-5500</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-150">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Horário de Funcionamento</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Segunda a Sexta: 08:00 às 18:30 | Sábado: 08:00 às 14:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Agendamento Rápido ou Mapa */}
          <div className="lg:col-span-7 bg-slate-50/50 rounded-3xl border border-slate-100 p-6 md:p-8 space-y-6">
            <h4 className="font-bold text-slate-800 text-base flex items-center gap-1.5 border-b border-slate-150 pb-3">
              <Calendar className="w-5 h-5 text-indigo-600" /> Faça o Agendamento Seguramente
            </h4>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Diferente de oficinas tradicionais de acessórios, nós trabalhamos com um <strong>Sistema de Agendamento Digital Consolidado</strong>. Ao se registrar na área do cliente na nossa plataforma, você terá controle imediato e transparência de custos do seu serviço de Insulfilm.
            </p>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="font-mono text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Cotação & Agendamento Ativo</p>
                  <p className="text-[10px] text-slate-400">Verifique os horários disponíveis e reserve</p>
                </div>
              </div>
              <button 
                onClick={user ? onGoToDashboard : onOpenAuth}
                className="py-1.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
              >
                {user ? "Acessar" : "Registar / Entrar"}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* RODAPÉ (FOOTER) */}
      <footer className="bg-slate-950 text-slate-400 py-12 md:py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-slate-800">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-950 font-mono font-bold text-xs tracking-tighter">
                CF
              </div>
              <span className="font-bold text-white tracking-tight text-base font-sans leading-none">
                CLEAR FILM
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empresa líder especializada em revestimento e aplicação de películas solares de alta performance, automotivas, comerciais e residenciais.
            </p>
            <p className="text-[10px] text-slate-600 font-mono">
              © 2026 Clear Film Películas. Todos os direitos reservados. CNPJ: 12.345.678/0001-90.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-slate-200 text-xs uppercase font-bold tracking-wider">Links Úteis</h4>
            <ul className="text-xs space-y-2">
              <li><a href="#servicos" className="hover:text-white transition">Nossas Películas</a></li>
              <li><a href="#diferenciais" className="hover:text-white transition">Nossos Diferenciais</a></li>
              <li><a href="#simulador" className="hover:text-white transition">Simulador de Transparência</a></li>
              <li><a href="#portfolio" className="hover:text-white transition">Projetos Executados</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-slate-200 text-xs uppercase font-bold tracking-wider">Compromisso Legal</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trabalhamos em estrita conformidade com e as resoluções do CONTRAN relativas às porcentagens de transparência permitidas nos vidros automotivos, assegurando que seu veículo permaneça dentro dos parâmetros legais durante a aplicação.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <div>
            Desenvolvido sob preceitos de UI/UX Clear Minimalist
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Termos de Uso</span>
            <span className="hover:text-slate-300 cursor-pointer">Políticas de Privacidade</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
