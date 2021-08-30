import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

import { Factura } from '../models/facturas.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  cargarFacturas() {
    const url = `${base_url}/facturas`;
    return this.http
      .get(url, this.headers)
      .pipe(map((resp: { ok: boolean; facturas: Factura[] }) => resp.facturas));
  }

  obtenerFacturaPorId(id: string) {
    const url = `${base_url}/facturas/${id}`;
    return this.http
      .get(url, this.headers)
      .pipe(map((resp: { ok: boolean; factura: Factura }) => resp.factura));
  }

  crearFactura(factura: {
    codigo: string;
    nombre: string;
    email: string;
    valor: string;
    estado: string;
  }) {
    console.log(JSON.stringify(this.headers))
    const url = `${base_url}/facturas`;
    return this.http.post(url, factura, this.headers);
  }

  actualizarFactura(factura: Factura) {
    const url = `${base_url}/facturas/${factura._id}`;
    return this.http.put(url, factura, this.headers);
  }

  borrarFactura(_id: string) {
    console.log(_id, "aca el; id")
    const url = `${base_url}/facturas/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
