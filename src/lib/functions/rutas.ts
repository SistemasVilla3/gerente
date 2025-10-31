import { goto } from "$app/navigation";

type rutaValida = '/produccion/GerenteVentas' | '/produccion/GerenteVentas/ForHour' | '/produccion/GerenteVentas/Progress';

export function road(ruta: rutaValida) {
    goto(ruta);
}