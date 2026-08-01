import { useEffect, useMemo, useState } from "react";
import {
    BadgeCheck,
    CalendarCheck2,
    Flag,
    Stamp,
} from "lucide-react";

import { AlertsPanel } from "./components/AlertsPanel";
import { Header } from "./components/Header";
import { ProcessFilters } from "./components/ProcessFilters";
import type { FiltrosProcesso } from "./components/ProcessFilters";
import { ProcessTable } from "./components/ProcessTable";
import { ProcessDetailPanel } from "./components/ProcessDetailPanel";
import { ProcessTypes } from "./components/ProcessTypes";
import { Sidebar } from "./components/Sidebar";
import type { PaginaAtiva } from "./components/Sidebar";
import { StatusCard } from "./components/StatusCard";
import { listarAlertas } from "./service/alertas";
import { listarProcessos } from "./service/processos";
import { AlertasPage } from "./pages/AlertasPage";
import { ProcessosPage } from "./pages/ProcessosPage";
import type { Alerta, Processo, StatusProcesso, TipoProcesso } from "./types/processos.ts";

import "./styles/App.css";

const filtrosIniciais: FiltrosProcesso = { tipo: "", status: "", orgao: "" };

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

    useEffect(() => {
        document.documentElement.classList.toggle("dark", temaEscuro);
    }, [temaEscuro]);

    useEffect(() => {
        let ativo = true;

        Promise.all([listarProcessos(), listarAlertas()])
            .then(([processosRecebidos, alertasRecebidos]) => {
                if (!ativo) return;
                setProcessos(processosRecebidos);
                setAlertas(alertasRecebidos);
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
                />

                {filtrosAbertos && (
                    <ProcessFilters
                        filtros={filtros}
                        orgaos={orgaos}
                        aoAlterar={setFiltros}
                        aoFechar={() => setFiltrosAbertos(false)}
                    />
                )}

                <main className="dashboard">
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
                Atualizado às 15:37
              </span>
                                </div>
                            </section>

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
                                    processos={processosFiltrados}
                                    aoSelecionar={setProcessoSelecionado}
                                    aoVerTodos={() => setPaginaAtiva("processos")}
                                />
                                <AlertsPanel
                                    alertas={alertas}
                                    aoVerTodos={() => setPaginaAtiva("alertas")}
                                />
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
                </main>
            </div>

            <ProcessDetailPanel
                processo={processoSelecionado}
                aoFechar={() => setProcessoSelecionado(null)}
            />
        </div>
    );
}

function abrirPaginaPorTipo(tipo: TipoProcesso) {
    const paginasPorTipo = {
        LICITACAO: "licitacoes",
        REGISTRO_PRECO: "registros",
        DISPENSA_LICITACAO: "dispensas",
        INEXIGIBILIDADE: "inexigibilidades",
    } satisfies Record<TipoProcesso, PaginaAtiva>;

    return paginasPorTipo[tipo];
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
