import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Factura } from '../../../models/facturas.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { FacturasService } from '../../../services/facturas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-aprobadas',
  templateUrl: './aprobadas.component.html',
  styleUrls: ['./aprobadas.component.css'],
})
export class AprobadasComponent implements OnInit {
  public cargando: boolean = true;
  public facturas: Factura[] = [];
  private imgSubs: Subscription;

  constructor(
    private facturaService: FacturasService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarFacturas();

    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarFacturas());
  }

  // cargarFacturas() {
  //   this.cargando = true;
  //   this.facturaService.cargarFacturas().subscribe((facturas) => {
  //     this.cargando = false;
  //     this.facturas = facturas;
  //   });
  // }
  cargarFacturas() {
    this.facturaService.cargarFacturas().subscribe((facturas) => {
      this.cargando = false;
      this.facturas = facturas.filter((activos) => activos.estado === 'Aprobada');
      console.log(facturas, 'aca la ifno');
    });
  }
}
