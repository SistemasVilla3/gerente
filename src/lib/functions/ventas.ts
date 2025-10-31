import type { Meta, Progreso } from '$lib/functions/Metas';
import type { Vendedor } from '$lib/functions/vendedores';
import type { ComVend } from '$lib/functions/Comisiones';
import type { Cartera } from '$lib/functions/Cartera';

export type VendedorData = {
  vendedor: Vendedor;
  meta?: Meta | null;
  progreso?: Progreso | null;
  comisiones?: ComVend | null;
  cartera?: Cartera | null;
  comisionTotal?: number | null;
};
