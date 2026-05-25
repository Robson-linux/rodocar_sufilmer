import React, { useState } from "react";
import { Shield, Eye, Sun, Sliders } from "lucide-react";

interface TintOption {
  grade: string;
  label: string;
  name: string;
  description: string;
  lightTrans: string;
  privacy: string;
  heatRed: string;
  glassOpacity: number; // For rendering overlay
}

const TINT_GRADES: TintOption[] = [
  {
    grade: "G100",
    label: "100%",
    name: "Sem Película",
    description: "Vidro original de fábrica. Sem barreira de calor ou UV, visibilidade total para interior e exterior.",
    lightTrans: "100%",
    privacy: "Nenhuma",
    heatRed: "0%",
    glassOpacity: 0.1,
  },
  {
    grade: "G70",
    label: "70%",
    name: "Térmica Clara (Nano Cerâmica)",
    description: "Tons claríssimos permitidos por lei para para-brisa. Ideal para quem quer rejeição de calor máxima sem escurecer os vidros.",
    lightTrans: "70%",
    privacy: "Mínima",
    heatRed: "85%",
    glassOpacity: 0.35,
  },
  {
    grade: "G50",
    label: "50%",
    name: "Película Leve",
    description: "Escurecimento estético muito suave. Ideal para visual clean e redução moderada de luminosidade solar intensa.",
    lightTrans: "50%",
    privacy: "Sutil",
    heatRed: "54%",
    glassOpacity: 0.5,
  },
  {
    grade: "G35",
    label: "35%",
    name: "Média (Padrão Permitido)",
    description: "Equilíbrio perfeito de estética e privacidade média. Visual elegante que ainda permite visibilidade noturna confortável.",
    lightTrans: "35%",
    privacy: "Moderada",
    heatRed: "68%",
    glassOpacity: 0.7,
  },
  {
    grade: "G20",
    label: "20%",
    name: "Escura (Mais Vendida)",
    description: "Garante excelente privacidade e controle solar. Da rua é muito difícil ver as pessoas se movimentando dentro.",
    lightTrans: "20%",
    privacy: "Alta",
    heatRed: "75%",
    glassOpacity: 0.85,
  },
  {
    grade: "G5",
    label: "5%",
    name: "Super Escura (Privacidade Total)",
    description: "Privacidade absoluta e estilo executivo imponente. Bloqueia quase todo o tráfego visual exterior para dentro.",
    lightTrans: "5%",
    privacy: "Máxima",
    heatRed: "80%",
    glassOpacity: 0.95,
  },
];

export default function TintSimulator() {
  const [selectedGrade, setSelectedGrade] = useState<TintOption>(TINT_GRADES[4]); // default G20
  const [isInsideView, setIsInsideView] = useState<boolean>(false); // view inside or outside

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-10 shadow-sm transition-all duration-300">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-3">
          <Sliders className="w-3.5 h-3.5" /> Simulador Interativo
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Visualize a Película no Carro
        </h3>
        <p className="text-slate-500 mt-2 text-sm md:text-base leading-relaxed">
          Selecione differentes porcentagens de transparência (G) para ver como fica a estética do carro, a privacidade interna e as propriedades de proteção.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LADO ESQUERDO: CONTROLES E DETALHES */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100/80">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Selecione o Grau de Escurecimento (Transparência):
            </label>
            <div className="grid grid-cols-6 gap-2">
              {TINT_GRADES.map((option) => (
                <button
                  key={option.grade}
                  onClick={() => setSelectedGrade(option)}
                  className={`py-3 px-1 rounded-xl text-center flex flex-col justify-between items-center border transition-all duration-200 ${
                    selectedGrade.grade === option.grade
                      ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-400 text-slate-700"
                  }`}
                >
                  <span className="text-xs font-bold font-mono">{option.grade}</span>
                  <span className="text-[10px] mt-1 opacity-70">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-600 font-mono">
                Especificação da Película
              </span>
              <h4 className="text-xl font-bold text-slate-800 mt-0.5">
                {selectedGrade.name} ({selectedGrade.grade})
              </h4>
              <p className="text-slate-500 text-xs md:text-sm mt-1 leading-relaxed">
                {selectedGrade.description}
              </p>
            </div>

            {/* Métricas de performance */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100/50 flex flex-col text-center">
                <Sun className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Rejeição Calor</span>
                <span className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                  {selectedGrade.heatRed}
                </span>
              </div>
              <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100/50 flex flex-col text-center">
                <Eye className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Privacidade</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5">
                  {selectedGrade.privacy}
                </span>
              </div>
              <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100/50 flex flex-col text-center">
                <Shield className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Luz Visível</span>
                <span className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                  {selectedGrade.lightTrans}
                </span>
              </div>
            </div>

            {/* Alternar visão interna / externa */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setIsInsideView(false)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg text-center transition-all ${
                  !isInsideView
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Visão de Fora (Exterior)
              </button>
              <button
                onClick={() => setIsInsideView(true)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg text-center transition-all ${
                  isInsideView
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Visão de Dentro (Interior)
              </button>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: RENDERIZADOR VISUAL DO AUTOMÓVEL COM TINT COMPLEMENTAR */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center bg-slate-50 rounded-2xl border border-slate-100 p-4 md:p-8 min-h-[280px] md:min-h-[380px] relative overflow-hidden">
          
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200/50 text-[10px] text-slate-500 font-mono font-medium shadow-2xs">
            Exibição: {!isInsideView ? "Vista Externa - Carro" : "Visibilidade Traseira / Lateral"}
          </div>

          <div className="w-full max-w-md md:max-w-xl transition-all duration-300">
            {!isInsideView ? (
              /* CARRO VISTA DE FORA - SVG VETORIAL AUTOMOTIVO PREMIUM */
              <div className="relative">
                <svg
                  viewBox="0 0 600 240"
                  className="w-full h-auto text-slate-800 fill-none stroke-slate-200 stroke-1"
                >
                  {/* Fundo de estrada ou reflexo minimalista */}
                  <line x1="20" y1="200" x2="580" y2="200" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Linha sombra do chassi */}
                  <ellipse cx="300" cy="202" rx="260" ry="8" fill="#e2e8f0" opacity="0.6" stroke="none" />

                  {/* Rodas Traseiras e Dianteiras */}
                  <circle cx="160" cy="188" r="30" fill="#1e293b" />
                  <circle cx="160" cy="188" r="18" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="3" />
                  <circle cx="160" cy="188" r="6" fill="#1e293b" />

                  <circle cx="440" cy="188" r="30" fill="#1e293b" />
                  <circle cx="440" cy="188" r="18" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="3" />
                  <circle cx="440" cy="188" r="6" fill="#1e293b" />

                  {/* Corpo Superior / Capô / Teto / Porta-malas do Carro Limpo */}
                  <path
                    d="M 500,195 L 530,195 C 540,195 550,185 550,175 L 545,150 C 540,135 520,130 500,130 L 460,130 C 420,130 380,85 340,82 L 230,82 C 180,82 150,110 135,130 L 70,130 C 50,130 40,145 42,158 L 48,175 C 50,185 60,195 72,195 L 95,195"
                    stroke="#475569"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="#f8fafc"
                  />
                  
                  {/* Arcos de Roda */}
                  <path d="M 115,195 A 45,45 0 0,1 205,195" stroke="#475569" strokeWidth="3" fill="none" />
                  <path d="M 395,195 A 45,45 0 0,1 485,195" stroke="#475569" strokeWidth="3" fill="none" />
                  <path d="M 205,195 L 395,195" stroke="#475569" strokeWidth="3.5" />

                  {/* Faróis e Detalhes */}
                  <path d="M 45,145 C 45,145 35,150 35,155 C 35,160 48,160 48,160 Z" fill="#fde047" stroke="#475569" strokeWidth="1.5" />
                  <path d="M 545,145 C 545,145 555,147 555,152 C 555,157 544,157 544,157 Z" fill="#ef4444" stroke="#475569" strokeWidth="1.5" />

                  {/* Estrutura das Portas / Maçanetas */}
                  <path d="M 300,85 L 300,195" stroke="#475569" strokeWidth="1.5" />
                  <path d="M 152,130 L 438,130" stroke="#475569" strokeWidth="1.5" />
                  
                  {/* Maçanetas elegantes */}
                  <rect x="270" y="136" width="16" height="5" rx="2" fill="#475569" />
                  <rect x="330" y="136" width="16" height="5" rx="2" fill="#475569" />

                  {/* =======================================================
                      VIDROS DO CARRO (AQUI APLICAMOS O INSULFILM DINÂMICO!)
                      Para simular o vidro de fora com a respectiva opacidade.
                      ======================================================= */}
                  {/* Silhueta interna para dar profundidade (cabeça do motorista/volante) */}
                  <g opacity="0.45" stroke="none">
                    <circle cx="280" cy="115" r="10" fill="#94a3b8" />
                    <path d="M 270,130 C 270,120 290,120 290,130 Z" fill="#94a3b8" />
                    <circle cx="210" cy="118" r="9" fill="#94a3b8" />
                    <path d="M 202,130 C 202,122 218,122 218,130 Z" fill="#94a3b8" />
                    {/* volante */}
                    <path d="M 315,115 L 320,128 M 310,122 L 322,122" stroke="#64748b" strokeWidth="2" />
                  </g>

                  {/* Vidro Traseiro e Vidro Dianteiro - Forma Poligonal Integrada */}
                  <g id="car-windows">
                    {/* Vidro Frontal e Janela Dianteira */}
                    <path
                      d="M 295,91 L 348,91 C 362,91 385,110 392,124 L 300,124 Z"
                      fill="#0f172a"
                      style={{ opacity: selectedGrade.glassOpacity }}
                      stroke="#475569"
                      strokeWidth="1.5"
                      className="transition-opacity duration-300"
                    />

                    {/* Janela Traseira */}
                    <path
                      d="M 195,95 L 290,95 L 290,124 L 180,124 C 180,124 185,103 195,95 Z"
                      fill="#0f172a"
                      style={{ opacity: selectedGrade.glassOpacity * 1.05 }} // Ligeiramente mais escuro atrás devido aos ângulos de luz
                      stroke="#475569"
                      strokeWidth="1.5"
                      className="transition-opacity duration-300"
                    />
                  </g>

                  {/* Detalhe moldura preta ao redor dos vidros do teto */}
                  <path d="M 175,124 L 192,93 C 192,93 210,85 230,85 L 334,85 C 342,85 365,102 395,124 Z" stroke="#334155" strokeWidth="2.5" />
                </svg>

                {/* Sombra de indicação de nível */}
                <div className="mt-4 flex justify-center items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700"></span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Simulação: Vidro com película de tom <span className="font-bold text-slate-700">{selectedGrade.grade}</span> aplicado por fora
                  </p>
                </div>
              </div>
            ) : (
              /* CARRO VISTA DE DENTRO (COMO O MOTORISTA VÊ PARA FORA!) */
              <div className="w-full text-center space-y-4">
                {/* Visualizador do para-brisa vista de dentro */}
                <div 
                  className="w-full h-44 rounded-xl border-4 border-slate-700 shadow-md relative overflow-hidden flex items-center justify-center transition-all duration-300"
                  style={{
                    // Simular visão de dentro. Quanto menor a transmissão, ligeiramente mais escuro, embora películas de cerâmica de alta performance fiquem extremamente claras por dentro.
                    // Visibilidade noturna por dentro: G5 escurece um pouco (digamos 35%), G35 escurece muito pouco, G70 é quase invisível.
                    backgroundColor: `rgba(15, 23, 42, ${selectedGrade.glassOpacity * 0.45})`
                  }}
                >
                  {/* Paisagem de fundo (Montanha e Sol simulado por CSS) */}
                  <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-sky-200 via-sky-100 to-amber-50 -z-10 flex items-end justify-center">
                    <div className="w-full h-1/2 bg-gradient-to-t from-slate-300 to-transparent"></div>
                  </div>
                  {/* Sol brilhando à distância */}
                  <div className="absolute top-6 left-12 w-14 h-14 rounded-full bg-amber-400 blur-xs -z-10 opacity-80 animate-pulse"></div>
                  {/* Linhas de estrada à distância */}
                  <div className="absolute bottom-0 w-16 h-12 bg-slate-400 -z-10 rotate-45 transform origin-bottom-right opacity-30"></div>
                  
                  {/* Desenho do painel do carro por cima */}
                  <div className="absolute bottom-0 inset-x-0 h-10 bg-slate-800 border-t border-slate-700 flex items-center justify-center">
                    <div className="w-1/3 h-1.5 rounded-full bg-slate-600"></div>
                  </div>
                  
                  {/* Volante de dentro */}
                  <div className="absolute bottom-3 left-1/4 w-16 h-16 rounded-full border-[6px] border-slate-900 flex items-center justify-center">
                    <div className="w-2 h-8 bg-slate-900 rotate-90"></div>
                    <div className="w-2 h-8 bg-slate-900"></div>
                  </div>

                  {/* Espelho retrovisor por dentro */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-lg border-x border-b border-slate-600 flex items-center justify-center shadow-xs">
                    <div className="w-24 h-3 bg-slate-100/30 rounded-xs"></div>
                  </div>

                  {/* Texto de visualização de dentro */}
                  <div className="absolute top-1/2 py-1 px-4 bg-white/95 backdrop-blur-xs rounded-full shadow-xs border border-slate-200 text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-500" /> Visibilidade Interna: {selectedGrade.grade === "G5" ? "Moderada Noturna / Perfeita Diurna" : "Excelente"}
                  </div>
                </div>

                <div className="flex justify-center items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500/20 border border-indigo-500"></span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    As películas Clear bloqueiam calor e raios UV por dentro mantendo a <span className="font-bold text-indigo-700">luminosidade interna ideal</span> para sua segurança.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
