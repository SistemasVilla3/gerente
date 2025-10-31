<script lang="ts">
  import { fetchVend, type Vendedor } from "$lib/functions/vendedores";

    let seller = $state<Vendedor[]>([]);
    let rows = $state<Vendedor[]>([]);
    let loading = $state(false);
    let error = $state<string | null>(null);

    let {
        selectedVendedor = $bindable<Vendedor | null>(null),
        query = $bindable<string>("")
    } = $props<{
        selectedVendedor?: Vendedor | null;
        query?: string;
    }>();

    //Cargar vendedores al montar
    $effect(() => {
        void (async () => {
        try {
            const data = await fetchVend();
            seller = Array.isArray(data) ? (data as Vendedor[]) : (data?.data ?? []);
        } catch (e) {
            error = e instanceof Error ? e.message : 'Error desconocido';
            console.error(e);
        } finally {
            loading = false;
        }
        })();
    });

     // Filtrado reactivo
    $effect(() => {
        let base = seller;

        if (selectedVendedor) {
        // filtra SOLO el vendedor elegido
            base = base.filter(v => v.IdVendedor === selectedVendedor!.IdVendedor);
            } else {
            const q = query.trim().toLowerCase();
            if (q) {
                base = base.filter(v => {
                    const full = (v.Nombre ?? "").toLowerCase().trim();
                    if (!full) return false;
                    const firstToken = full.split(/\s+/)[0] ?? "";
                    return firstToken.startsWith(q);
                });
            }
        }

        rows = base;
    });
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 m-5">
    <div class="px-4 pt-3 text-sm text-gray-600 flex items-center gap-2">
        {#if loading}
        <span>Cargando vendedores…</span>
        {:else if error}
        <span class="text-red-600">Error: {error}</span>
        {:else}
        <span class="ml-auto text-gray-500">Mostrando {rows.length} de {seller.length}</span>
        {/if}
    </div>

    <div class="max-h-[450px] table-scroll overflow-y-auto rounded-md">
        <table class="w-full mx-auto rounded-md">
            <thead>
                <tr class="sticky top-0 z-10 bg-red-800">
                    <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">Cod. Vendedor</th>
                    <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">Nombre</th>
                    <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">Sucursal</th>
                    <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">Num. facturas</th>
                    <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">Facturas</th>
                    <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">Desc. facturas</th>
                    <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">Devoluciones</th>
                    <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">Monto fact. ant.</th>
                    <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">Monto fact. pago0</th>
                    <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">Desc. por NC</th>
                    <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">Venta Neta</th>
                </tr>
            </thead>

            <tbody>
                {#each rows as sell}
                    <tr>
                        <td class="py-2 px-4 text-lg text-center font-exo font-semibold text-gray-900">{sell.SapID}</td>
                        <td class="py-2 px-4 text-lg text-center font-exo font-semibold text-gray-900">{sell.Nombre}</td>
                        <td class="py-2 px-4 text-center text-sm text-gray-700">—</td>
                        <td class="py-2 px-4 text-center text-sm text-gray-700">—</td>
                        <td class="py-2 px-4 text-center text-sm text-gray-700">—</td>
                        <td class="py-2 px-4 text-center text-sm text-gray-700">—</td>
                        <td class="py-2 px-4 text-center text-sm text-gray-700">—</td>
                        <td class="py-2 px-4 text-center text-sm text-gray-700">—</td>
                        <td class="py-2 px-4 text-center text-sm text-gray-700">—</td>
                        <td class="py-2 px-4 text-center text-sm text-gray-700">—</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>