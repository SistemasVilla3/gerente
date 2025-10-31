const GET_CAR_VEN = "http://192.168.10.134:8019/carteraVencida";

export type Cartera = {
    DocumentosNoPagados: number;
    MontoNoPagado: number;
    DocumentosPagados: number;
    MontoPagado: number;
    PorcentajeCarteraVencida: number;
}

export async function fetchCar(slp: number): Promise<Cartera | null> {
    try {
        const res = await fetch(`${GET_CAR_VEN}/${slp}`);
        if (!res.ok) {
            if (res.status === 404) {
                console.warn(`No se encontro cartera para el vendedor con ID: ${slp}`);
                return null;
            }
            throw new Error(`Error al cargar la cartera del vendedor: ${slp}: ${res.status}`);
        }
        return await res.json();
    } catch (e) {
        console.error(`Error al obtener las facturas del vendedor: ${slp}`, e);
        throw new Error(`Errpr al cargar las facturas del vendedor ${slp}`);
    }
}