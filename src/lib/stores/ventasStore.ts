import type { VendedorData } from "$lib/functions/ventas";
import { getTodoVentas } from "$lib/services/ventasService";
import { derived, writable, type Readable } from "svelte/store";

// Representa el estado general del tablero de ventas.
type Estado = {
    loading: boolean;
    error: string | null;
    rows: VendedorData[];
};

// Store con el estado primario que compartimos con la UI.
const state = writable<Estado>({ loading: false, error: null, rows: [] });

// Referencia al temporizador que controla el auto refresco.
let _interval: ReturnType<typeof setInterval> | null = null;

// Descarga los datos desde el servicio y actualiza el store principal.
async function refresh() {
    // Indicamos a la interfaz que estamos recargando y limpiamos errores previos.
    state.update((s) => ({ ...s, loading: true, error: null }));
    try {
        const rows = await getTodoVentas();
        state.set({ loading: false, error: null, rows });
    } catch (e) {
        // Guardamos el mensaje de error y vaciamos los datos visibles.
        state.set({
            loading: false,
            error: (e as Error).message ?? "Error al cargar datos",
            rows: []
        });
    }
}

// Inicia un intervalo para refrescar datos automaticamente.
function startAutoRefresh(ms = 150_000) {
    if (_interval) return;
    _interval = setInterval(refresh, ms);
}

// Detiene el intervalo activo de refresco automatico.
function stopAutoRefresh() {
    if (_interval) clearInterval(_interval);
    _interval = null;
}

// Mapa por SapID para acceso directo a los datos del vendedor.
const byId: Readable<Record<number, VendedorData>> = derived(state, ($s) => {
    const map: Record<number, VendedorData> = {};
    for (const r of $s.rows) map[r.vendedor.SapID] = r;
    return map;
});

// Suma la comision total visible en la tabla.
const totalComisiones: Readable<number> = derived(state, ($s) =>
    $s.rows.reduce((acc, r) => acc + (r.comisionTotal ?? 0), 0)
);

// Devuelve un store derivado filtrando vendedores por nombre.
function filterByNombre(query: string): Readable<VendedorData[]> {
    const q = (query ?? "").toLowerCase().trim();
    return derived(state, ($s) =>
        q ? $s.rows.filter((r) => r.vendedor.Nombre.toLowerCase().includes(q)) : $s.rows
    );
}

// Interface publica que expone el store y los utilitarios asociados.
export const ventasState = {
    subscribe: state.subscribe,
    refresh,
    startAutoRefresh,
    stopAutoRefresh,
    byId,
    totalComisiones,
    filterByNombre
};
