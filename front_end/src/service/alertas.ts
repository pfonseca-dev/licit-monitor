import { api } from "./api";
import type { Alerta } from "../types/processos.ts";

export async function listarAlertas(): Promise<Alerta[]> {
    const { data } = await api.get<Alerta[]>("/alertas");
    return data;
}
