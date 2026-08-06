import { Activity } from "lucide-react";
import type { Processo } from "../types/processo";
import "./WeeklyMovement.css";

interface WeeklyMovementProps {
    processos: Processo[];
}

const umDia = 86_400_000;

export function WeeklyMovement({ processos }: WeeklyMovementProps) {
    const hoje = inicioDoDia(new Date());
    const dias = Array.from({ length: 7 }, (_, indice) => {
        const data = new Date(hoje.getTime() - (6 - indice) * umDia);
        return { data, total: 0 };
    });

    for (const processo of processos) {
        const data = converterData(processo.dataReferencia);
        if (!data) continue;

        const indice = Math.round((inicioDoDia(data).getTime() - dias[0].data.getTime()) / umDia);
        if (indice >= 0 && indice < dias.length) dias[indice].total += 1;
    }

    const maiorTotal = Math.max(1, ...dias.map((dia) => dia.total));
    const totalPeriodo = dias.reduce((total, dia) => total + dia.total, 0);

    return (
        <section className="weekly-movement">
            <div className="section-heading">
                <div>
                    <h2>Movimentação nos últimos 7 dias</h2>
                    <p>Processos por data de abertura ou publicação</p>
                </div>
                <div className="weekly-movement__summary">
                    <Activity aria-hidden="true" />
                    <strong>{totalPeriodo}</strong>
                    <span>no período</span>
                </div>
            </div>

            <div className="weekly-movement__chart">
                {dias.map((dia) => {
                    const altura = dia.total === 0 ? 3 : Math.max(12, (dia.total / maiorTotal) * 100);

                    return (
                        <div className="weekly-movement__day" key={dia.data.toISOString()}>
                            <div className="weekly-movement__value">{dia.total}</div>
                            <div className="weekly-movement__bar-area">
                                <span style={{ height: `${altura}%` }} />
                            </div>
                            <strong>{formatarDiaSemana(dia.data)}</strong>
                            <small>{formatarDataCurta(dia.data)}</small>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function converterData(valor: string) {
    const brasileira = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    const data = brasileira
        ? new Date(Number(brasileira[3]), Number(brasileira[2]) - 1, Number(brasileira[1]))
        : new Date(valor);

    return Number.isNaN(data.getTime()) ? null : data;
}

function inicioDoDia(data: Date) {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function formatarDiaSemana(data: Date) {
    return new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
        .format(data)
        .replace(".", "");
}

function formatarDataCurta(data: Date) {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(data);
}
