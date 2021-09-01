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
  public totalFacturas: number = 0;
  public facturaSeleccionada: Factura;
  
  public facturasTemp: Factura[] = [];
  public desde: number = 0;
  

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
  //   this.facturaService.cargarFacturas().subscribe((facturas) => {
  //     this.cargando = false;
  //     this.facturas = facturas.filter((activos) => activos.estado === 'Aprobada');
  //     console.log(facturas, 'aca la ifno');
  //   });
  // }

  cargarFacturas() {
    this.cargando = true;
    this.facturaService.cargarFacturas( this.desde )
      .subscribe( ({ total, facturas }) => {
        this.totalFacturas = total;
        this.facturas = facturas.filter((activos) => activos.estado === 'Aprobada');
        this.facturasTemp = facturas;
        this.cargando = false;
    })
  }
  cambiarPagina( valor: number ) {
    this.desde += valor;
    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalFacturas ) {
      this.desde -= valor; 
    }

    this.cargarFacturas();
  }
  buscar( termino: string ) {
    if ( termino.length === 0 ) {
      return this.facturas = this.facturasTemp;
    }
    this.busquedasService.buscar( 'facturas', termino )
        .subscribe( (resp: Factura[]) => {
          this.facturas = resp;
        });
  }
}
