<script lang="ts">
  import Header from "../components/Header.svelte";
  import ButtonPanel from "../components/ButtonPanel.svelte";

    let nombre = "Ventas por hora"
</script>

<main>
    <div class="min-h-screen bg-gray-50 p-6 space-y-2">
        <Header {nombre}/>
        <div class="grid grid-cols-1 gap-4">

            <ButtonPanel/>

            <div class="p-4 space-x-6 bg-white rounded-lg shadow-sm border border-gray-200 m-5">

            </div>
        </div>
    </div>
</main>