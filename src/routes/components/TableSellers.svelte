<script lang="ts">
  import { formatNumber } from "$lib/functions/Multitask";
  import type { Vendedor } from "$lib/functions/vendedores";
  import type { VendedorData } from "$lib/functions/ventas";
  import { ventasState } from "$lib/stores/ventasStore";

  let seller = $state<Vendedor[]>([]);
  let all = $state<VendedorData[]>([]);
  let rows = $state<VendedorData[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  let {
    selectedVendedor = $bindable<Vendedor | null>(null),
    query = $bindable<string>("")
  } = $props<{
    selectedVendedor?: Vendedor | null;
    query?: string;
  }>();

  // Suscripcion al store centralizado de ventas
  $effect(() => {
    const unsub = ventasState.subscribe((s) => {
      loading = s.loading;
      error = s.error;
      all = s.rows;
      seller = s.rows.map((r) => r.vendedor);
    });
    return () => unsub();
  });

  // Carga inicial y refresco periodico
  $effect.root(() => {
    ventasState.refresh();
    ventasState.startAutoRefresh(150_000);
    return () => ventasState.stopAutoRefresh();
  });

  function matchByName(nombre: string, q: string) {
    const full = (nombre ?? "").toLowerCase().trim();
    if (!full) return false;
    const firstToken = full.split(/\s+/)[0] ?? "";
    return firstToken.startsWith(q);
  }

  // Filtrado reactivo sobre los datos enriquecidos del vendedor
  $effect(() => {
    let base = all;

    if (selectedVendedor) {
      base = base.filter(
        (r) => r.vendedor.IdVendedor === selectedVendedor!.IdVendedor
      );
    } else {
      const q = query.trim().toLowerCase();
      if (q) base = base.filter((r) => matchByName(r.vendedor.Nombre, q));
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
        {/if}
    </div>

  <div class="max-h-[450px] table-scroll overflow-y-auto rounded-md">
    <table class="w-full mx-auto rounded-md">
      <thead>
        <tr class="sticky top-0 z-10 bg-red-800">
          <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">
            Cod. Vendedor
          </th>
          <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">
            Nombre
          </th>
          <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">
            Sucursal
          </th>
          <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">
            Num. facturas contado
          </th>
          <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">
            Monto de facturas
          </th>
          <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">
            Devoluciones
          </th>
          <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">
            Num. facturas credito
          </th>
          <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">
            Facturas de credito pagadas
          </th>
          <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">
            Desc. por NC
          </th>
          <th class="px-6 py-3 font-exo font-black text-center text-sm text-white-900 tracking-wider">
            Venta Neta
          </th>
        </tr>
      </thead>

      <tbody>
        {#each rows as sell}
          <tr>
            <td class="py-2 px-4 text-lg text-center font-exo font-semibold text-gray-900">
              {sell.vendedor.SapID ?? "-"}
            </td>
            <td class="py-2 px-4 text-lg text-center font-exo font-semibold text-gray-900">
              {sell.vendedor.Nombre}
            </td>
            <td class="py-2 px-4 text-lg text-center font-exo font-semibold text-gray-900">
              {sell.vendedor.SucursalID ?? "-"}
            </td>
            <td class="py-2 px-4 text-lg text-center font-exo font-semibold text-gray-900">
              {(sell.contado?.totalFacturas ?? 0)}
            </td>
            <td class="py-2 px-4 text-lg text-center font-exo font-semibold text-gray-900">
              ${formatNumber((sell.contado?.totalGeneral ?? 0))}
            </td>
            <td class="py-2 px-4 text-lg text-center font-exo font-semibold text-gray-900">
              {sell.devoluciones?.totalDocumentos ?? 0}
            </td>
            <td class="py-2 px-4 text-lg text-center font-exo font-semibold text-gray-900">
              {(sell.credito?.totalFacturas ?? 0)}
            </td>
            <td class="py-2 px-4 text-lg text-center font-exo font-semibold text-gray-900">
              ${formatNumber((sell.credito?.totalGeneral ?? 0))}
            </td>
            <td class="py-2 px-4 text-lg text-center font-exo font-semibold text-gray-900">
              -{formatNumber(sell.notas?.totalMonto ?? 0)}
            </td>
            <td class="py-2 px-4 text-lg text-center font-exo font-semibold text-gray-900">
              ${formatNumber(sell.progreso?.MontoProgreso ?? 0)}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
