import { Factura } from '../models/facturas.model';

export interface CargarFactura{
    total: number;
    facturas: Factura[];
}