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

  public cargando: boolean = true;
  public facturas: Factura[] = [];
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
    this.facturaService.cargarFacturas()
      .subscribe( facturas => {
        this.cargando = false;
        this.facturas = facturas;
      });
  }

  // buscar( termino: string ) {

  //   if ( termino.length === 0 ) {
  //     return this.cargarFacturas();
  //   }

  //   this.busquedasService.buscar( 'facturas', termino )
  //       .subscribe( resp => {
  //         this.facturas = resp;
  //       });
  // }

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
