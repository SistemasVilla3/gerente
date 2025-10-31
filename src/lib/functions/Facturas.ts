const GET_FAC_CONT = 'http://192.168.10.134:8019/facturasPorContado';
const GET_FAC_CRED = 'http://192.168.10.134:8019/facturasPorCredito';

export type FacturasContado = {
    totalFacturas: number;
    totalContadoPorDepartamento: Record<string,number>;
    totalGeneral: number;
    resumenContado: {
        cantidad: number;
        monto: number;
    }
}

export type FacturasCredito = {
    totalFacturas: number;
    totalGeneral: number;
    totalCreditoPorDepartamento: Record<string,number>;
    resumenCredito: {
        cantidad: number;
        excluidasPorPagoPrevio: number;
        consideradas: number;
        pagado: number;
    },
    facturas: factura[];
}

type factura = {
    DocEntry: number;
    DocNum: number;
    DocTotal: string;
    DocDate: string;
    PaidToDate: string;
    VatSum: string;
}

export async function fetchCont(slp: number): Promise<FacturasContado | null> {
    try {
        const res = await fetch(`${GET_FAC_CONT}/${slp}`);
        if (!res.ok) {
            console.warn(`No se encontraron facturas de contado para el vendedor con ID: ${slp}`);
            return null;
        }
        return await res.json();
    } catch (e) {
        console.error(`Error al obtener las facturas de contado del vendedor: ${slp}`, e);
        throw new Error(`Error al cargar las facturas de contado del vendedor ${slp}`);
    }
}

export async function fetchCred(slp: number): Promise<FacturasCredito | null> {
    try {
        const res = await fetch(`${GET_FAC_CRED}/${slp}`);
        if (!res.ok) {
            console.warn(`No se encontraron facturas de creadito para el vendedor con ID: ${slp}`);
            return null;
        }
        return await res.json();
    } catch (e) {
        console.error(`Error al obtener las facturas de credito del vendedor: ${slp}`, e)
        throw new Error(`Error al cargar las facturas de credito del vendedor: ${slp}`);
        
    }
}