import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Factura } from '../../../models/facturas.model';

import { FacturasService } from '../../../services/facturas.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styles: [],
})
export class FacturaComponent implements OnInit {
  public totalFacturas: number = 0;
  public facturaForm: FormGroup;
  public facturaSeleccionada: Factura;
  public facturas: Factura[] = [];
  public facturasTemp: Factura[] = [];
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturasService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.cargarFactura(id));

    this.facturaForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      valor: ['', Validators.required],
      estado: ['activa'],
      img: ['no-img.jpg'],
    });

    this.cargarFacturas();
    this.facturaForm.get('factura').valueChanges.subscribe((facturaId) => {
      this.facturaSeleccionada = this.facturas.find((h) => h._id === facturaId);
    });
  }

  cargarFactura(id: string) {
    if (id === 'nueva') {
      return;
    }
    this.facturaService
      .obtenerFacturaPorId(id)
      .pipe(delay(100))
      .subscribe((factura) => {
        if (!factura) {
          return this.router.navigateByUrl(`/dashboard/facturas`);
        }
        const {
          codigo,
          nombre,
          email,
          valor,
          estado = 'activa',
          img = 'no-img.jpg',
        } = factura;
        this.facturaSeleccionada = factura;
        this.facturaForm.setValue({
          codigo,
          nombre,
          email,
          valor,
          estado,
          img,
        });
      });
  }

  // cargarFacturas() {
  //   this.facturaService.cargarFacturas().subscribe((facturas: Factura[]) => {
  //     this.facturas = facturas;
  //   });
  // }
  cargarFacturas() {
    this.cargando = true;
    this.facturaService
      .cargarFacturas(this.desde)
      .subscribe(({ total, facturas }) => {
        this.totalFacturas = total;
        this.facturas = facturas;
        this.facturasTemp = facturas;
        this.cargando = false;
      });
  }

  guardarFactura() {
    const { codigo, nombre, email, valor, estado, img } =
      this.facturaForm.value;
    console.log(this.facturaForm);
    if (this.facturaSeleccionada) {
      // actualizar
      const data = {
        ...this.facturaForm.value,
        _id: this.facturaSeleccionada._id,
      };
      this.facturaService.actualizarFactura(data).subscribe((resp) => {
        Swal.fire(
          'Actualizada',
          `${codigo} actualizado correctamente`,
          'success'
        );
      });
    } else {
      // crear

      this.facturaService
        .crearFactura(this.facturaForm.value)
        .subscribe((resp: any) => {
          Swal.fire('Creada', `${codigo} creada correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/facturas`);
        });
    }
  }
}
