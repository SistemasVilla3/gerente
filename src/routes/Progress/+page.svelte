<script lang="ts">
  import Header from "../components/Header.svelte";
  import ButtonPanel from "../components/ButtonPanel.svelte";
  import TableProgress from "../components/TableProgress.svelte";
  import type { Vendedor } from "$lib/functions/vendedores";

  let selectedVendedor: Vendedor | null = null;
    let query = "";

    function handleSelect(v: Vendedor) {
        selectedVendedor = v;
    }

    let nombre = "Alcance de metas y comisiones"
</script>

<main>
    <div class="min-h-screen bg-gray-50 p-6 space-y-2">
        <Header {nombre}/>
        <div class="grid grid-cols-1 gap-4">

            <ButtonPanel
                bind:selectedVendedor
                onSelect={handleSelect}
            />

            <div class="space-x-6 bg-white rounded-lg shadow-sm border border-gray-200 mx-5">
                <TableProgress
                    bind:selectedVendedor
                    bind:query
                    />
            </div>
        </div>
    </div>
</main>