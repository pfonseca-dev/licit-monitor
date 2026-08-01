import type { LucideIcon } from "lucide-react";
import type { StatusProcesso } from "../types/processos.ts";

import "./StatusCard.css";

interface StatusCardProps {
    status: StatusProcesso;
    titulo: string;
    quantidade: number;
    icon: LucideIcon;
}

export function StatusCard({
                               status,
                               titulo,
                               quantidade,
                               icon: Icon,
                           }: StatusCardProps) {
    const statusClass = status.toLowerCase();

    return (
        <article className={`status-card status-card--${statusClass}`}>
      <span className="status-card__icon">
        <Icon strokeWidth={2} />
      </span>

            <div className="status-card__content">
                <p className="status-card__title">{titulo}</p>
                <strong className="status-card__value">{quantidade}</strong>
            </div>
        </article>
    );
}
