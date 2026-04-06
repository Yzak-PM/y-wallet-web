import { api } from "@/lib/api";

export async function createTransaction(payload) {
    const { data } = await api.post("/transactions/", payload);
    return data;
}