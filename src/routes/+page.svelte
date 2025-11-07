<script lang="ts">
    import Header from "./components/Header.svelte";
    import TableSellers from "./components/TableSellers.svelte";
    import ButtonPanel from "./components/ButtonPanel.svelte";
    import FilterPanel from "./components/FilterPanel.svelte";
    import type { Vendedor } from "$lib/functions/vendedores";
    import { onMount } from "svelte";
    import { roleName } from "$lib/functions/AuthStore";

    let selectedVendedor: Vendedor | null = null;
    let query = "";

    function handleSelect(v: Vendedor) {
        selectedVendedor = v;
    }

    onMount(() => {
        let redirected = false;
        const unsubscribe = roleName.subscribe((value) => {
            if (redirected || !value) return;
            const allowedRoles = ["ADMINISTRADOR", "GERENTE DE VENTAS"];
            if (!allowedRoles.includes(value) && typeof window !== "undefined") {
                redirected = true;
                if (window.history.length > 1) {
                    window.history.back();
                } else if (document.referrer) {
                    window.location.assign(document.referrer);
                } else {
                    window.location.assign("/");
                }
            }
        });

        return () => unsubscribe();
    });

    let nombre = "Ventas por mes";
</script>

<main>
    <div class="min-h-screen bg-gray-50 p-6 space-y-2">
        <Header {nombre}/>
        <div class="grid grid-cols-1 gap-4">

            <ButtonPanel
            bind:selectedVendedor
            onSelect={handleSelect}
            />

            <FilterPanel/>

            <!--TABLA DE VENDEDORES - VISTA POR DEFECTO-->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 mx-5">
                <header class="p-2 lg_p-3 border-b border-gray-200 items-center space-x-2">
                    <h1 class="text-2xl font-exo font-bold text-center text-gray-900">Vendedores</h1>
                </header>
                <div>
                    <TableSellers
                    bind:selectedVendedor
                    bind:query
                    />
                </div>
            </div>
        </div>
    </div>
</main>
