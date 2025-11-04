import type { Meta, Progreso } from '$lib/functions/Metas';
import type { Vendedor } from '$lib/functions/vendedores';
import type { ComVend } from '$lib/functions/Comisiones';
import type { Cartera } from '$lib/functions/Cartera';
import type { Entregas} from './Facturas';
import type { Devoluciones } from './Devoluciones';
import type { NotasCredito } from './NotasCredito';

export type VendedorData = {
  vendedor: Vendedor;
  meta?: Meta | null;
  entregas?: Entregas | null;
  devoluciones?: Devoluciones | null;
  progreso?: Progreso | null;
  comisiones?: ComVend | null;
  cartera?: Cartera | null;
  comisionTotal?: number | null;
  notas?: NotasCredito | null;
};
