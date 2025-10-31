const GET_VEND_DEV = 'http://192.168.10.134:8019/devoluciones';

export type Devoluciones = {
    totalDocumentos: number;
    totalMonto: number;
}

export async function fetchDev(slp: number): Promise<Devoluciones | null> {
    try {
        const res = await fetch(`${GET_VEND_DEV}/${slp}`)
        if (!res.ok) {
            console.warn(`No se encontraron devoluciones para el vendedor con ID: ${slp}`);
            return null;
        }
        return await res.json();
    } catch (e) {
        console.error(`Error al obtener las devoluciones del vendedor: ${slp}`, e);
        throw new Error(`Error al cargar las devoluciones del vendedor ${slp}`);
    }
}