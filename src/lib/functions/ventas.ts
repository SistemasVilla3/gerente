import type { Meta, Progreso } from '$lib/functions/Metas';
import type { Vendedor } from '$lib/functions/vendedores';
import type { ComVend } from '$lib/functions/Comisiones';
import type { Cartera } from '$lib/functions/Cartera';
import type { Entregas, FacturasContado, FacturasCredito} from './Facturas';
import type { Devoluciones } from './Devoluciones';
import type { NotasCredito } from './NotasCredito';

// Estructura agregada con todos los datos que se muestran para cada vendedor.
export type VendedorData = {
  vendedor: Vendedor;
  meta?: Meta | null;
  contado?: FacturasContado | null;
  credito?: FacturasCredito | null;
  entregas?: Entregas | null;
  devoluciones?: Devoluciones | null;
  progreso?: Progreso | null;
  comisiones?: ComVend | null;
  cartera?: Cartera | null;
  comisionTotal?: number | null; // Monto final de comision segun cartera vencida.
  notas?: NotasCredito | null;
};

