import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Factura } from '../../../models/facturas.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { FacturasService } from '../../../services/facturas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styles: [
  ]
})
export class FacturasComponent implements OnInit, OnDestroy {
  public totalFacturas: number = 0;
  public cargando: boolean = true;
  public facturas: Factura[] = [];
  public facturaTemporal: Factura[] = [];
  public desde: number = 0;
  private imgSubs: Subscription;

  constructor( private facturaService: FacturasService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService ) { }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.cargarFacturas();

    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe( img => this.cargarFacturas() );
  }

  cargarFacturas() {
    this.cargando = true;
    this.facturaService.cargarFacturas(this.desde)
    .subscribe( ({ total, facturas }) => {
      this.totalFacturas = total;
      this.facturas = facturas;
      this.facturaTemporal = facturas;
      this.cargando = false;
      });
  }

  buscar( termino: string ) {
    if ( termino.length === 0 ) {
      return this.facturas = this.facturaTemporal;
    }
    this.busquedasService.buscar( 'facturas', termino )
        .subscribe( (resp: Factura[]) => {
          this.facturas = resp;
        });
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

  abrirModal(factura: Factura) {
    this.modalImagenService.abrirModal( 'facturas', factura._id, factura.img );
  }

  borrarFactura( factura: Factura ) {
    Swal.fire({
      title: '¿Borrar factura?',
      text: `Esta a punto de borrar a ${ factura.codigo }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarla'
    }).then((result) => {
      if (result.value) {
        
        this.facturaService.borrarFactura( factura._id )
          .subscribe( resp => {
            
            this.cargarFacturas();
            Swal.fire(
              'Factura borrada',
              `${ factura.codigo } fue eliminada correctamente`,
              'success'
            );
            
          });

      }
    })

  }

}
