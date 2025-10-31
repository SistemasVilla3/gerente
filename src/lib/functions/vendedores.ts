const GET_ALL_VEN = "http://192.168.10.134:8018/vendedores";

export type Vendedores = Vendedor[];

export type Vendedor = {
    IdVendedor: number;
    Nombre: string;
    Activo: boolean;
    RHID: string;
    SapID: number;
    SucursalID: number;
}

export async function fetchVend() {
    const res = await fetch(GET_ALL_VEN);
    if(!res.ok) {
        const body = await res.text();
        console.error(`Backend respondio ${res.statusText} ${body}`);
        throw new Error('Error al cargar las comisiones');
    }
    const data = await res.json();
    return data;
}