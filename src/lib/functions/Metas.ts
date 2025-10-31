const GET_MET_ALL = 'http://192.168.10.134:8018/AllMetas';
const GET_MET_VED = "http://192.168.10.134:8018/MetaPorVendedor";
const GET_PRO_MET = "http://192.168.10.134:8018/ProgresoMeta";


export type Meta = {
    Id: number;
    MontoDeMeta: number;
    MontoActual: number;
    Mes: number;
    Anio: number;
    Progreso: number;
    FechaCreacion: string;
    UsuarioCreacion: string;
    Activo: boolean;
    Vendedores: {
        IdVendedor: number;
        Nombre: string;
        RHID: string;
        SapID: string;
    }
}

export type Progreso = {
    IdProgesoMeta: number;
    VendedorID: number;
    MontoProgreso: number;
    ProgresoPorcentual: number;
    FechaCreacion: string;
    FechaActualizacion: string;
    Activo: boolean;
}

export type Metas = Meta[];

export async function fetchMetas() {
    const res = await fetch(GET_MET_ALL);
    if(!res.ok) {
        const body = await res.text();
        console.error(`Backend respondio ${res.statusText}`, body);
        throw new Error('Error al cargar las metas');
    }
    const data = await res.json();
    return data;
}

export async function fetchMetasVend(id: number): Promise<Meta | null> {
    try {
        const res = await fetch(`${GET_MET_VED}/${id}`);
        if (!res.ok) {
            if (res.status === 404) {
                //console.warn(`No se encontraron metas para el vendedor con ID: ${id}`);
                return null; // Retorna null si no hay metas para el vendedor
            }
            throw new Error(`Error al cargar las metas del vendedor ${id}: ${res.statusText}`);
        }
        console.log(`Meta para vendedor ${id} encontrada`);
        return await res.json();
    } catch (error) {
       // console.error(`Error al obtener las metas del vendedor: ${id}`, error);
        throw new Error(`Error al cargar las metas del vendedor ${id}`);
    }
}

export async function fetchProgre(id: number): Promise<Progreso | null> {
    const res = await fetch(`${GET_PRO_MET}/${id}`);
    if(!res.ok) {
        const body = await res.text();
        //console.error("Backend respondio", res.statusText);
        throw new Error("Error al cargar las metas");
    }
    console.log(`Progreso para vendedor ${id} encontrado`);
    const data = await res.json();
    return data;
}