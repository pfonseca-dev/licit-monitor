import { api } from "./api";
import type { Processo } from "../types/processos.ts";

export async function listarProcessos(): Promise<Processo[]> {
    const { data } = await api.get<Processo[]>("/processos");
    return data;
}
