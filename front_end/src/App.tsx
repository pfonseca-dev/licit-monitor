import { useEffect, useMemo, useState } from "react";
import {
    BadgeCheck,
    CalendarCheck2,
    Flag,
    Stamp,
} from "lucide-react";

import { AlertsPanel } from "./components/AlertsPanel";
import { Header } from "./components/Header";
import { AuthModal } from "./components/AuthModal";
import { ProcessFilters } from "./components/ProcessFilters";
import type { FiltrosProcesso } from "./components/ProcessFilters";
import { ProcessTable } from "./components/ProcessTable";
import { ProcessDetailPanel } from "./components/ProcessDetailPanel";
import { ProcessTypes } from "./components/ProcessTypes";
import { ActiveAgencies } from "./components/ActiveAgencies";
import { Sidebar } from "./components/Sidebar";
import type { PaginaAtiva } from "./components/Sidebar";
import { StatusCard } from "./components/StatusCard";
import { listarAlertas } from "./services/alertas";
import { atualizarObservacao, listarProcessos } from "./services/processos";
import { buscarUsuarioAtual, type Usuario } from "./services/auth";
import { AlertasPage } from "./pages/AlertasPage";
import { ProcessosPage } from "./pages/ProcessosPage";
import type { Alerta, Processo, StatusProcesso, TipoProcesso } from "./types/processo";

import "./styles/App.css";

const filtrosIniciais: FiltrosProcesso = { tipo: "", status: "", orgao: "" };

const titulosPorPagina: Record<PaginaAtiva, { contexto: string; titulo: string }> = {
    painel: { contexto: "Visão geral", titulo: "Painel de monitoramento" },
    processos: { contexto: "Monitoramento", titulo: "Todos os processos" },
    licitacoes: { contexto: "Monitoramento", titulo: "Licitações" },
    leiloes: { contexto: "Monitoramento", titulo: "Leilões" },
    registros: { contexto: "Monitoramento", titulo: "Registros de preço" },
    adesoes: { contexto: "Monitoramento", titulo: "Adesões a registro de preço" },
    "compras-diretas": { contexto: "Monitoramento", titulo: "Compras diretas" },
    "dispensas-eletronicas": { contexto: "Monitoramento", titulo: "Dispensas eletrônicas" },
    alertas: { contexto: "Monitoramento", titulo: "Alertas" },
};

function App() {
    const [processos, setProcessos] = useState<Processo[]>([]);
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [menuAberto, setMenuAberto] = useState(false);
    const [paginaAtiva, setPaginaAtiva] = useState<PaginaAtiva>("painel");
    const [processoSelecionado, setProcessoSelecionado] = useState<Processo | null>(null);
    const [temaEscuro, setTemaEscuro] = useState(false);
    const [busca, setBusca] = useState("");
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);
    const [filtros, setFiltros] = useState<FiltrosProcesso>(filtrosIniciais);
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>();
    const [loginAberto, setLoginAberto] = useState(false);
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", temaEscuro);
    }, [temaEscuro]);

    useEffect(() => {
        if (!localStorage.getItem("access_token")) return;

        buscarUsuarioAtual()
            .then(setUsuario)
            .catch(() => localStorage.removeItem("access_token"));
    }, []);

    useEffect(() => {
        let ativo = true;

        Promise.all([listarProcessos(), listarAlertas()])
            .then(([processosRecebidos, alertasRecebidos]) => {
                if (!ativo) return;
                setProcessos(processosRecebidos);
                setAlertas(alertasRecebidos);
                setUltimaAtualizacao(
                    new Intl.DateTimeFormat("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }).format(new Date()),
                );
            })
            .catch((erro) => {
                console.error("Não foi possível carregar os dados do backend.", erro);
            });

        return () => {
            ativo = false;
        };
    }, []);

    const orgaos = useMemo(
        () => Array.from(new Set(processos.flatMap((processo) => processo.orgaos))).sort(),
        [processos],
    );

    const processosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        return processos.filter((processo) => {
            const correspondeABusca = !termo || [
                processo.numero,
                processo.modalidade,
                processo.objeto,
                ...processo.orgaos,
            ].some((campo) => campo.toLowerCase().includes(termo));

            return correspondeABusca
                && (!filtros.tipo || processo.tipo === filtros.tipo)
                && (!filtros.status || processo.status === filtros.status)
                && (!filtros.orgao || processo.orgaos.includes(filtros.orgao));
        });
    }, [busca, filtros, processos]);

    const totais = useMemo(() => {
        const base: Record<StatusProcesso, number> = {
            ABERTO: 0,
            HOMOLOGADO: 0,
            REVOGADO: 0,
            FINALIZADO: 0,
        };

        for (const processo of processos) {
            base[processo.status] += 1;
        }

        return base;
    }, [processos]);

    const processosPrioritarios = useMemo(
        () => selecionarProcessosPrioritarios(processosFiltrados, 7),
        [processosFiltrados],
    );

    return (
        <div className="app">
            <Sidebar
                aberta={menuAberto}
                aoFechar={() => setMenuAberto(false)}
                paginaAtiva={paginaAtiva}
                aoNavegar={setPaginaAtiva}
            />

            <div className="app__content">
                <Header
                    temaEscuro={temaEscuro}
                    aoAlternarTema={() => setTemaEscuro((atual) => !atual)}
                    aoAbrirMenu={() => setMenuAberto(true)}
                    menuAberto={menuAberto}
                    filtrosAbertos={filtrosAbertos}
                    aoAlternarFiltros={() => setFiltrosAbertos((aberto) => !aberto)}
                    busca={busca}
                    aoBuscar={setBusca}
                    tituloCentral={titulosPorPagina[paginaAtiva]}
                    ultimaAtualizacao={ultimaAtualizacao}
                    aoAbrirLogin={() => setLoginAberto(true)}
                    usuario={usuario}
                />

                {loginAberto && (
                    <AuthModal
                        aoFechar={() => setLoginAberto(false)}
                        aoAutenticar={setUsuario}
                    />
                )}

                {filtrosAbertos && (
                    <ProcessFilters
                        filtros={filtros}
                        orgaos={orgaos}
                        aoAlterar={setFiltros}
                        aoFechar={() => setFiltrosAbertos(false)}
                    />
                )}

                <main className="dashboard">
                    <div key={paginaAtiva} className="dashboard__page-transition">
                        {paginaAtiva !== "painel" ? (
                            <PaginaAtual
                                pagina={paginaAtiva}
                                processos={processosFiltrados}
                                alertas={alertas}
                                aoSelecionarProcesso={setProcessoSelecionado}
                            />
                        ) : (
                            <>
                                <section className="dashboard__intro">
                                    <p className="dashboard__eyebrow">Visão geral</p>

                                    <div className="dashboard__title-row">
                                        <div>
                                            <h1>Painel de monitoramento</h1>
                                        </div>

                                        <span className="dashboard__mobile-update">
                {ultimaAtualizacao
                    ? `Atualizado às ${ultimaAtualizacao}`
                    : "Aguardando dados"}
              </span>
                                    </div>
                                </section>

                                <div className="dashboard__overview-grid">
                                    <section
                                        aria-label="Resumo por status"
                                        className="dashboard__status-grid"
                                    >
                                        <StatusCard
                                            status="ABERTO"
                                            titulo="ABERTO"
                                            quantidade={totais.ABERTO}
                                            icon={CalendarCheck2}
                                        />

                                        <StatusCard
                                            status="HOMOLOGADO"
                                            titulo="HOMOLOGADO"
                                            quantidade={totais.HOMOLOGADO}
                                            icon={BadgeCheck}
                                        />

                                        <StatusCard
                                            status="REVOGADO"
                                            titulo="REVOGADO"
                                            quantidade={totais.REVOGADO}
                                            icon={Stamp}
                                        />

                                        <StatusCard
                                            status="FINALIZADO"
                                            titulo="FINALIZADO"
                                            quantidade={totais.FINALIZADO}
                                            icon={Flag}
                                        />
                                    </section>

                                    <div className="dashboard__main-grid">
                                        <ProcessTable
                                            processos={processosPrioritarios}
                                            aoSelecionar={setProcessoSelecionado}
                                            aoVerTodos={() => setPaginaAtiva("processos")}
                                            titulo="Processos prioritários"
                                            descricao="Eventos recentes e situações que exigem atenção"
                                        />
                                        <div className="dashboard__side-column">
                                            <AlertsPanel
                                                alertas={alertas}
                                                limite={3}
                                                aoVerTodos={() => setPaginaAtiva("alertas")}
                                            />
                                            <ActiveAgencies
                                                processos={processosFiltrados}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <ProcessTypes
                                    processos={processos}
                                    aoSelecionar={(tipo) => setPaginaAtiva(abrirPaginaPorTipo(tipo))}
                                />

                                <footer className="dashboard__footer">
                                    LicitMonitor © 2026 — Todos os direitos reservados.
                                </footer>
                            </>
                        )}
                    </div>
                </main>
            </div>

            <ProcessDetailPanel
                processo={processoSelecionado}
                podeEditar={usuario?.perfil === "editor"}
                aoSalvarObservacao={async (processo, observacao) => {
                    await atualizarObservacao(processo, observacao);
                    const atualizar = (item: Processo) =>
                        item.fonte === processo.fonte && item.id === processo.id
                            ? { ...item, observacao }
                            : item;
                    setProcessos((atuais) => atuais.map(atualizar));
                    setProcessoSelecionado((atual) => atual ? atualizar(atual) : null);
                }}
                aoFechar={() => setProcessoSelecionado(null)}
            />
        </div>
    );
}

function abrirPaginaPorTipo(tipo: TipoProcesso) {
    const paginasPorTipo = {
        LICITACAO: "licitacoes",
        LEILAO: "leiloes",
        REGISTRO_PRECO: "registros",
        ADESAO_REGISTRO_PRECO: "adesoes",
        COMPRA_DIRETA: "compras-diretas",
        DISPENSA_ELETRONICA: "dispensas-eletronicas",
    } satisfies Record<TipoProcesso, PaginaAtiva>;

    return paginasPorTipo[tipo];
}

const prioridadePorStatus: Record<StatusProcesso, number> = {
    REVOGADO: 90,
    HOMOLOGADO: 60,
    FINALIZADO: 30,
    ABERTO: 0,
};

function selecionarProcessosPrioritarios(processos: Processo[], limite: number) {
    return [...processos]
        .sort((processoA, processoB) => {
            const pontuacaoA = calcularPontuacao(processoA);
            const pontuacaoB = calcularPontuacao(processoB);

            return pontuacaoB - pontuacaoA || processoB.id - processoA.id;
        })
        .slice(0, limite);
}

function calcularPontuacao(processo: Processo) {
    const data = obterDataMaisRecente(processo);
    const diasDesdeReferencia = data
        ? Math.max(0, (Date.now() - data.getTime()) / 86_400_000)
        : 3650;
    const relevanciaRecente = Math.max(0, 120 - diasDesdeReferencia);

    return relevanciaRecente + prioridadePorStatus[processo.status];
}

function obterDataMaisRecente(processo: Processo) {
    const datas = [
        processo.atualizadoEm,
        processo.dataHomologacao,
        processo.dataReferencia,
    ]
        .map(converterData)
        .filter((data): data is Date => data !== null);

    return datas.sort((dataA, dataB) => dataB.getTime() - dataA.getTime())[0] ?? null;
}

function converterData(valor: string | null | undefined) {
    if (!valor) return null;

    const dataBrasileira = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    const data = dataBrasileira
        ? new Date(Number(dataBrasileira[3]), Number(dataBrasileira[2]) - 1, Number(dataBrasileira[1]))
        : new Date(valor);

    return Number.isNaN(data.getTime()) ? null : data;
}

function PaginaAtual({
                         pagina,
                         processos,
                         alertas,
                         aoSelecionarProcesso,
                     }: {
    pagina: Exclude<PaginaAtiva, "painel">;
    processos: Processo[];
    alertas: Alerta[];
    aoSelecionarProcesso: (processo: Processo) => void;
}) {
    if (pagina === "alertas") return <AlertasPage alertas={alertas} />;
    return (
        <ProcessosPage
            pagina={pagina}
            processos={processos}
            aoSelecionarProcesso={aoSelecionarProcesso}
        />
    );
}

export default App;
