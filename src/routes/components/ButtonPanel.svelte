<script lang="ts"> 
  import { road } from "$lib/functions/rutas";
  import { fetchVend, type Vendedor } from "$lib/functions/vendedores";

  //Variables de estado
  let query = $state('');
  let open = $state(false);
  let highlightIdx = $state(-1);
  let vendedores = $state<Vendedor[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  //Props bindable para permitir el select
  let {
    selectedVendedor = $bindable<Vendedor | null>(null),
        onSelect = ((_: Vendedor) => {})
  } = $props<{
    selectedVendedor?: Vendedor | null;
    onSelect?: (v: Vendedor) => void;
  }>();

  //Cargar vendedores al montar
  $effect(() => {
    void (async () => {
      try {
          const data = await fetchVend();
          vendedores = Array.isArray(data) ? data : (data?.data ?? []);
      } catch (e) {
          error = e instanceof Error ? e.message : 'Error desconocido';
          console.error(e);
      } finally {
          loading = false;
      }
    })();
  });

  //Filtrado derivado
    let filtered = $state<Vendedor[]>([]);
    $effect(() => {
    const q = query.trim().toLowerCase();
    filtered = !q
        ? vendedores.slice(0, 50)
        : vendedores.filter(v => v.Nombre.toLowerCase().includes(q)).slice(0, 50);
    });

    //Sincroniza con texto mostrado
  function choose(v: Vendedor) {
    selectedVendedor = v;
    query = v.Nombre;
    open = false;
    highlightIdx = -1;
    onSelect?.(v);
  }

  //Si el usuario vuelve a escribir entonces fija uno
  function onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    query = val;
    selectedVendedor = null;
    open = true;
    highlightIdx = 0;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!open && (e.key == 'ArrowDown' || e.key === 'ArrowUp')) {
        open = true;
        highlightIdx = 0;
        return;
    }
    if (!filtered.length) return;

    if (e.key == 'ArrowDown') {
        e.preventDefault();
        highlightIdx = (highlightIdx + 1) % filtered.length;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightIdx = (highlightIdx - 1 + filtered.length) % filtered.length;
    } else if (e.key === 'Enter') {
        e.preventDefault();
        const v = filtered[highlightIdx] ?? filtered[0];
        if (v) choose(v);
    } else if (e.key === 'Escape') {
        open = false;
        highlightIdx = -1;
    }
  }

  let inputEl: HTMLInputElement | null = null;

  function onBlur(e: FocusEvent) {
    //Cierra el menu si el foco se va fuera del contenedor
    const related = e.relatedTarget as HTMLElement | null;
    const container = (e.currentTarget as HTMLElement).closest('[data-autocomplete');
    if (!container?.contains(related)) {
        open = false;
        highlightIdx = -1;
    }
  }
</script>

<div class=" p-4 space-x-6 bg-white rounded-lg shadow-sm border border-gray-200 m-5"
    data-autocomplete
>
    <label>
        <input
        class="py-1 font-exo text-gray-600 border border-gray-300 rounded-md text-center"
        placeholder="Nombre de vendedor"
        bind:this={inputEl}
        type="text"
        value={query}
        oninput={onInput}
        onkeydown={onKeyDown}
        onblur={onBlur}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="vend-listbox"
        aria-activedescendant={highlightIdx >= 0 ? `vend-opt-${highlightIdx}` : undefined}
        >
    </label>

    {#if loading}
        <p class="mt-1 text-xs text-gray-400">Cargando vendedores...</p>
    {:else if error}
        <p class="mt-1 text-xs text-red-500">Error: {error}</p>
    {/if}

    {#if open && filtered.length}
        <ul
        id="vend-listbox"
        role="listbox"
        class="absolute left-0 right-0 z-20 mt-1 max-h-64 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
        tabindex="-1"
        onblur={onBlur}
        >
        {#each filtered as v, i}
            <li
            id={"vend-opt-" + i}
            role="option"
            aria-selected={i === highlightIdx}
            class="cursor-pointer px-3 py-2 text-sm hover:bg-indigo-50"
            class:bg-indigo-100={i === highlightIdx}
            onmousedown={() => choose(v)}
            >
            <div class="flex items-center justify-between">
                <span class="text-gray-800">{v.Nombre}</span>
                {#if !v.Activo}
                <span class="ml-2 rounded bg-gray-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-500">Inactivo</span>
                {/if}
            </div>
            <div class="mt-0.5 text-[11px] text-gray-500">
                ID: {v.IdVendedor} · Sucursal: {v.SucursalID}
            </div>
            </li>
        {/each}
        </ul>
    {:else if open && !filtered.length && !loading}
        <div class="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow">
        Sin resultados
        </div>
    {/if}

    <button
    class="relative inline-flex font-semibold items-center px-4 py-2 border border-gray-300 rounded-md text-white-900 bg-red-800 hover:bg-red-700 uppercase disabled:opacity-50"
    onclick={() => road('/produccion/GerenteVentas')}
    >
        Ventas por mes
    </button>

    <!-- <button
    class="relative inline-flex font-semibold items-center px-4 py-2 border border-gray-300 rounded-md text-white-900 bg-red-800 hover:bg-red-700 uppercase disabled:opacity-50"
    onclick={() => road('/produccion/GerenteVentas/ForHour')}
    >
        Ventas por hora
    </button> -->

    <button
    class="relative inline-flex font-semibold items-center px-4 py-2 border border-gray-300 rounded-md text-white-900 bg-red-800 hover:bg-red-700 uppercase disabled:opacity-50"
    onclick={() => road('/produccion/GerenteVentas/Progress')}
    >
        Alcance de metas y comisiones
    </button>
</div>