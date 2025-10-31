const GET_NOT_CRED = 'http://192.168.10.134:8019/notaCredito';

export type NotasCredito = {
    totalDocumentos: number;
    totalMonto: number;
}

export async function fetchNot(slp: number): Promise<NotasCredito | null> {
    try {
        const res = await fetch(`${GET_NOT_CRED}/${slp}`);
        if (!res.ok) {
            console.warn(`No se encontraron notas de credito para el vendedor con ID: ${slp}`);
            return null;
        }
        return await res.json();
    } catch (e) {
        console.error(`Error al obtener las notas de credito del vendedor: ${slp}`, e);
        throw new Error(`Error al cargar las notas de credito del vendedor: ${slp}`);;
    }
}