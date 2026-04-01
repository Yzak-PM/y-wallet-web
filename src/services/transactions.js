import { api } from "@/lib/api";

export async function createTransaction(payload) {
    const { data } = await api.post("/transactions/new/", payload);
    return data;
}