<script lang="ts">
  import { formatNumber } from "$lib/functions/Multitask";
  import { type Vendedor } from "$lib/functions/vendedores";
  import { type VendedorData } from "$lib/functions/ventas";
  import { ventasState } from "$lib/stores/ventasStore";

    let seller = $state<Vendedor[]>([]);
    let rows = $state<VendedorData[]>([]);
    let all = $state<VendedorData[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    let {
        selectedVendedor = $bindable<Vendedor | null>(null),
            query = $bindable<string>("")
    } = $props<{
        selectedVendedor?: Vendedor | null;
        query?: string;
    }>();

    //Suscripcion al store
    $effect(() => {
        const unsub = ventasState.subscribe(s => {
            loading = s.loading;
            error = s.error;
            all = s.rows;
            seller = s.rows.map(r => r.vendedor);
        });
        return () => unsub();
    });

    //Cargar inicial
    $effect.root(() => {
        ventasState.refresh();
        ventasState.startAutoRefresh(150_000);
        return () => ventasState.stopAutoRefresh();
    });

    //Coincidencia con el primer token delnombre
    function matchByName(nombre: string, q: string) {
        const full = (nombre ?? "").toLowerCase().trim();
        if (!full) return false;
        const firstToken = full.split(/\s+/)[0] ?? "";
        return firstToken.startsWith(q);
    }

    // Filtrado reactivo
    $effect(() => {
        let base = all;

        if (selectedVendedor) {
            base = base.filter(r => r.vendedor.IdVendedor === selectedVendedor!.IdVendedor);
        } else {
            const q = query.trim().toLowerCase();
            if (q) base = base.filter(r => matchByName(r.vendedor.Nombre, q));
        }

        rows = base;
    });
</script>

<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="px-4 pt-3 text-sm text-gray-600 flex items-center gap-2">
        {#if loading}
            <span>Cargando vendedores…</span>
        {:else if error}
            <span class="text-red-600">Error: {error}</span>
        {:else}
            <span class="ml-auto text-gray-500">Mostrando {rows.length} de {seller.length}</span>
        {/if}
    </div>

    <div class="table-scroll max-h-[650px] overflow-y-auto rounded-md">
        <table class="w-full rounded-md">
            <thead>
                <tr class="sticky top-0 z-10 rounded-md bg-red-800">
                    <th class="px-3 py-3 text-center text-sm font-exo font-bold tracking-wider text-white-900 uppercase">Vendedor</th>
                    <th class="px-4 py-3 text-center text-sm font-exo font-bold tracking-wider text-white-900 uppercase">Meta actual</th>
                    <th class="px-4 py-3 text-center text-sm font-exo font-bold tracking-wider text-white-900 uppercase">Alcanzado</th>
                    <th class="px-4 py-3 text-center text-sm font-exo font-bold tracking-wider text-white-900 uppercase">% Alcanzado</th>
                    <th class="px-4 py-3 text-center text-sm font-exo font-bold tracking-wider text-white-900 uppercase">Comisión contado</th>
                    <th class="px-4 py-3 text-center text-sm font-exo font-bold tracking-wider text-white-900 uppercase">Comisión credito</th>
                    <th class="px-4 py-3 text-center text-sm font-exo font-bold tracking-wider text-white-900 uppercase">Cartera vencida</th>
                    <th class="px-4 py-3 text-center text-sm font-exo font-bold tracking-wider text-white-900 uppercase">Comisión total</th>
                </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 bg-white">
                {#each rows as r}
                    <tr class="px-3 py-4 text-center font-exo font-semibold whitespace-nowrap text-gray-900">
                        <td class="px-2 py-4 text-center font-exo font-semibold whitespace-nowrap text-gray-900">
                            {r.vendedor.Nombre}
                        </td>

                        <td class="px-3 py-4 text-center font-exo font-semibold whitespace-nowrap text-gray-900">
                            {#if r.meta}
                                ${formatNumber(r.meta?.MontoDeMeta ?? 0)}
                            {:else}
                                <em>0.00</em>
                            {/if}
                        </td>

                        <td class="px-3 py-4 text-center font-exo font-semibold whitespace-nowrap text-gray-900">
                            {#if r.meta}
                                {#if (r.progreso?.MontoProgreso ?? 0) === 0}
                                    <em>0.00</em>
                                {:else}
                                    ${formatNumber(r.progreso?.MontoProgreso ?? 0)}
                                {/if}
                            {:else}
                                <em>0.00</em>
                            {/if}
                        </td>

                        <td class="px-3 py-4 text-center font-exo font-semibold whitespace-nowrap text-gray-900">
                            {#if r.meta}
                                {#if (r.progreso?.ProgresoPorcentual ?? 0) === 0}
                                    <em>0%</em>
                                {:else}
                                    {formatNumber(r.progreso?.ProgresoPorcentual ?? 0)}%
                                {/if}
                            {:else}
                                <em>0%</em>
                            {/if}
                        </td>

                        <td class="px-3 py-4 text-center font-exo font-semibold whitespace-nowrap text-gray-900">
                            ${formatNumber(r.comisiones?.ComisionContado ?? 0)}
                        </td>

                        <td class="px-3 py-4 text-center font-exo font-semibold whitespace-nowrap text-gray-900">
                            ${formatNumber(r.comisiones?.ComisionCredito ?? 0)}
                        </td>

                        <td class="px-3 py-4 text-center font-exo font-semibold whitespace-nowrap text-gray-900">
                            {formatNumber(r.cartera?.PorcentajeCarteraVencida?? 0)}%
                        </td>

                        <td class="px-4 py-4 text-center font-exo font-semibold whitespace-nowrap text-gray-900">
                            ${formatNumber(r.comisionTotal ?? 0)}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>