import { fetchMetasVend, fetchProgre, type Meta, type Progreso } from '$lib/functions/Metas';
import { fetchVend, type Vendedor } from '$lib/functions/vendedores';
import { fetchComVend, type ComVend } from '$lib/functions/Comisiones';
import { fetchCar, type Cartera } from '$lib/functions/Cartera';
import { fetchCont, fetchCred, fetchEnt } from '$lib/functions/Facturas';
import { fetchDev } from '$lib/functions/Devoluciones';
import { fetchNot } from '$lib/functions/NotasCredito';
import type { VendedorData } from '$lib/functions/ventas';

// Carga el catalogo base de vendedores sin informacion complementaria.
export async function getVendedoresBase(): Promise<Vendedor[]> {
  return fetchVend();
}

// Reune toda la informacion relacionada con un vendedor para la vista de ventas.
export async function getDatosDeVendedor(v: Vendedor): Promise<VendedorData> {
  // Lanzamos todas las consultas en paralelo para reducir tiempos de espera.
  const [metaRes, progRes, comRes, carRes, contRes, credRes, entRes, devRes, notRes] = await Promise.allSettled([
    fetchMetasVend(v.IdVendedor),
    fetchProgre(v.IdVendedor),
    fetchComVend(v.IdVendedor),
    fetchCar(v.SapID),
    fetchCont(v.SapID),
    fetchCred(v.SapID),
    fetchEnt(v.SapID),
    fetchDev(v.IdVendedor),
    fetchNot(v.IdVendedor)
  ]);

  const meta         = metaRes.status === 'fulfilled' ? metaRes.value : null;
  const progreso     = progRes.status === 'fulfilled' ? progRes.value : null;
  const comisiones   = comRes.status === 'fulfilled' ? comRes.value : null;
  const cartera      = carRes.status === 'fulfilled' ? carRes.value : null;
  const contado      = contRes.status === 'fulfilled' ? contRes.value : null;
  const credito      = credRes.status === 'fulfilled' ? credRes.value : null;
  const entregas     = entRes.status === 'fulfilled' ? entRes.value : null;
  const devoluciones = devRes.status === 'fulfilled' ? devRes.value : null;
  const notas        = notRes.status === 'fulfilled' ? notRes.value : null;

  // Calculamos la comision final validando la politica de cartera vencida.
  let comisionTotal: number | null = null;
  if (comisiones && cartera) {
    const comisionContado = comisiones.ComisionContado ?? 0;
    const comisionCredito = comisiones.ComisionCredito ?? 0;
    const pctVen          = cartera.PorcentajeCarteraVencida ?? 0;
    comisionTotal = pctVen >= 20 ? comisionContado : comisionContado + comisionCredito;
  }

  return {
    vendedor: v,
    meta,
    contado,
    credito,
    entregas,
    devoluciones,
    progreso,
    comisiones,
    cartera,
    comisionTotal,
    notas
  };
}

// Obtiene toda la informacion de ventas procesando a cada vendedor.
export async function getTodoVentas(): Promise<VendedorData[]> {
  const vendedores = await getVendedoresBase();
  const filas: VendedorData[] = [];

  // Procesamos secuencialmente para no saturar el backend
  for (const v of vendedores) {
    const pack = await getDatosDeVendedor(v);
    filas.push(pack);
  }
  return filas;
}
