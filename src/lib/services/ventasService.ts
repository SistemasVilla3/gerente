import { fetchMetasVend, fetchProgre, type Meta, type Progreso } from '$lib/functions/Metas';
import { fetchVend, type Vendedor } from '$lib/functions/vendedores';
import { fetchComVend, type ComVend } from '$lib/functions/Comisiones';
import { fetchCar, type Cartera } from '$lib/functions/Cartera';
import type { VendedorData } from '$lib/functions/ventas';

export async function getVendedoresBase(): Promise<Vendedor[]> {
  return fetchVend();
}

export async function getDatosDeVendedor(v: Vendedor): Promise<VendedorData> {
  const [metaRes, progRes, comRes, carRes] = await Promise.allSettled([
    fetchMetasVend(v.IdVendedor),
    fetchProgre(v.IdVendedor),
    fetchComVend(v.IdVendedor),
    fetchCar(v.SapID)
  ]);

  const meta      = metaRes.status === 'fulfilled' ? metaRes.value : null;
  const progreso  = progRes.status === 'fulfilled' ? progRes.value : null;
  const comisiones= comRes.status === 'fulfilled' ? comRes.value : null;
  const cartera   = carRes.status === 'fulfilled' ? carRes.value : null;

  let comisionTotal: number | null = null;
  if (comisiones && cartera) {
    const contado = comisiones.ComisionContado ?? 0;
    const credito = comisiones.ComisionCredito ?? 0;
    const pctVen  = cartera.PorcentajeCarteraVencida ?? 0;
    comisionTotal = pctVen >= 20 ? contado : contado + credito;
  }

  return { vendedor: v, meta, progreso, comisiones, cartera, comisionTotal };
}

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
