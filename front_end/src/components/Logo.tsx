import { Landmark } from "lucide-react";
import "./Logo.css";

export function Logo() {
    return (
        <div className="logo">
      <span className="logo__icon">
        <Landmark size={22} strokeWidth={2.2} />
      </span>

            <div className="logo__text">
                <strong>LicitMonitor</strong>
                <span>Monitoramento de processos</span>
            </div>
        </div>
    );
}
