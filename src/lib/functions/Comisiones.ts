const API_GET_COM = "http://192.168.10.134:8018/AllComisiones";
const API_GET_PRO = "http://192.168.10.134:8018/ComisionDeUnVendedor";
const API_GET_MAR = "http://192.168.10.134:8018/MarcasDelDepartamento";

export type DeptComision = {
    IdDepartamento: number;
    Nombre: string;
    PorcentajeComision: number;
}

export type Marca = {
    ID_DepartamentoMarca: number;
    MarcaID: number;
    DepartamentoID: number;
    Activo: boolean;
    UsuarioModificacion: string | null;
    FechaModificacion: string | null;
    PorcentajeComision: number | null;
    MarcasVentas: MarcasVentas;
}

export type MarcasVentas = {
    ID_Marcas: number;
    Nombre: string;
    Activo: boolean;
    Codigo: number;
}

export type ActCom = {
    ValorNotaCredito: number;
    ValorDevoluciones: number;
    ComisionContado: number;
    ComisionCredito: number;
}

export type ComVend = {
    IdComision: number;
    MetaID: number;
    MetaSemanal: number;
    MetaDiaria: number;
    VendedorID: number;
    ValorNotaCredito: number;
    ValorDevoluciones: number;
    ComisionContado: number;
    ComisionCredito: number;
    DocsID: number;
    Activo: boolean;
}

export type Comisiones = DeptComision[];

export async function fetchComisiones() {
    const res = await fetch(API_GET_COM);
    if(!res.ok) {
        const body = await res.text();
        console.error(`Backend respondio ${res.statusText}`, body);
        throw new Error('Error al cargar las comisiones');
    }
    const data = await res.json();
    return data;
}

export async function fetchComVend(id: number) {
    const res = await fetch(`${API_GET_PRO}/${id}`);
    if(!res.ok) {
        const body = await res.text();
        console.error(`Backend respondio ${res.statusText}`, body);
        throw new Error('Error al cargar las comisiones');
    }
    const data = await res.json();
    return data;
}

export async function fetchMarcDept(id:number) {
    const res = await fetch(`${API_GET_MAR}/${id}`);
    if(!res.ok) {
        const body = await res.text();
        console.error(`Backend respondio ${res.statusText}`, body);
        throw new Error("Error al cargar las comisiones de marca");
    }
    const data = await res.json();
    return data;
}