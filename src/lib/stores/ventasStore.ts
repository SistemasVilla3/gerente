import type { VendedorData } from "$lib/functions/ventas";
import { getTodoVentas } from "$lib/services/ventasService";
import { derived, writable, type Readable } from "svelte/store";

type Estado = {
    loading: boolean;
    error: string | null;
    rows: VendedorData[];
};

const state = writable<Estado>({loading: false, error: null, rows: []});

let _interval: ReturnType<typeof setInterval> | null = null;

async function refresh() {
    state.update(s => ({ ...s, loading: true, error: null}));
    try {
        const rows = await getTodoVentas();
        state.set({loading: false, error: null, rows});
    } catch (e) {
        state.set({
            loading: false,
            error: (e as Error).message ?? 'Error al cargar datos',
            rows: []
        });
    }
}

function startAutoRefresh(ms = 150_000) {
    if (_interval) return;
    _interval = setInterval(refresh, ms);
}
function stopAutoRefresh() {
    if (_interval) clearInterval(_interval);
    _interval = null;
}

//Mapa por IdVendedor para acceso
const byId: Readable<Record<number, VendedorData>> = derived(state, ($s) => {
    const map: Record<number, VendedorData> = {};
    for (const r of $s.rows) map[r.vendedor.IdVendedor] = r;
    return map;
});

const totalComisiones: Readable<number> = derived(state, ($s) =>
  $s.rows.reduce((acc, r) => acc + (r.comisionTotal ?? 0), 0)
);

function filterByNombre(query: string): Readable<VendedorData[]> {
    const q = (query ?? '').toLowerCase().trim();
    return derived(state, ($s) => 
    q ? $s.rows.filter(r => r.vendedor.Nombre.toLowerCase().includes(q)): $s.rows);
}

export const ventasState = {
    subscribe: state.subscribe,
    refresh,
    startAutoRefresh,
    stopAutoRefresh,
    byId,
    totalComisiones,
    filterByNombre
};