import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { FiltrarPolizas } from '../../modelos/FiltrosPoliza';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Observable } from 'rxjs';
import { ServicioAdministrarPolizas } from '../../servicios/administrar-polizas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { valorCeroValidar } from '../polizas/validadores/cero-validacion';
import { negativoValidar } from '../polizas/validadores/negativo-verificar';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';

@Component({
  selector: 'app-gestionar-polizas',
  templateUrl: './gestionar-polizas.component.html',
  styleUrls: ['./gestionar-polizas.component.css']
})
export class GestionarPolizasComponent implements OnInit {
  @ViewChild('pasajeros') myInputRef!: ElementRef;

  polizas: Array<{ poliza: string, tipoPoliza: string | number, estadoPoliza: string, fechaInicio: string, fechaFin: string, fechaCargue: string, aseguradora: string, cantidadVehiculos: string }> = []
  novedadesPoliza: Array<{ poliza: string, tipoPoliza: string | number, placa: string, fechaActualizacion: string, estado: string, observacion: string }> = []
  novedadesPolizaPaginacion: Array<{ poliza: string, tipoPoliza: string | number, placa: string, fechaActualizacion: string, estado: string, observacion: string }> = []
  placasInteroperabilidad: Array<string> = []
  placasInteroperabilidadPaginacion: Array<string> = []

  tipoPoliza: number = 0;
  numeroPoliza: any;
  verPoliza: boolean = false;
  poliza: any;
  placas: [] = [];
  habilitarVinculacion: Boolean = false;

  formPasajeros: FormGroup;

  paginador: Paginador<FiltrarPolizas>

  paginadorNovedades = {
    totalRegistros: 0,
    pagina: 1,
    limite: 5,
  };

  paginadorInteroperabilidad = {
    totalRegistros: 0,
    pagina: 1,
    limite: 5,
  };

  constructor(private servicioAut: AutenticacionService,
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
    private activatedRoute: ActivatedRoute,
    private router: Router,) {
    this.paginador = new Paginador<FiltrarPolizas>(this.obtenerPolizas)
    this.formPasajeros = new FormGroup({
      pasajeros: new FormControl(undefined, [Validators.required, valorCeroValidar(), negativoValidar()]),
    })
  }

  ngOnInit(): void {
    this.inicializarPaginador();
    this.formPasajeros.controls['pasajeros'].disable();
  }

  obtenerPolizas = (pagina: number, limite: number, filtros?: FiltrarPolizas) => {
    return new Observable<Paginacion>((suscriptor: any) => {
      this.servicioAdministrarPoliza.listarPolizas(pagina, limite, filtros).subscribe({
        next: (polizas: any) => {
          this.polizas = polizas.polizas
          suscriptor.next(polizas.paginacion)
        }
      })
    })
  }

  inicializarPaginador() {
    this.activatedRoute.queryParams.subscribe({
      next: (query) => {
        this.paginador.inicializar(undefined, undefined, {
          poliza: '',
          tipoPoliza: '',
          fechaInicio: '',
          fechaFin: ''
        })
      }
    })
  }

  visualizarPoliza(numero: any, tipoPoliza: any) {
    let idTipo;
    this.numeroPoliza = numero;
    this.verPoliza = false;
    if (tipoPoliza === 'RESPONSABILIDAD CIVIL CONTRACTUAL') idTipo = 1, this.tipoPoliza = 1
    if (tipoPoliza === 'RESPONSABILIDAD CIVIL EXTRACONTRACTUAL') idTipo = 2, this.tipoPoliza = 2
    this.servicioAdministrarPoliza.visualizarPoliza(numero, idTipo).subscribe({
      next: (poliza: any) => {
        this.poliza = poliza
        this.verPoliza = true;
        this.visualizarNovedadesPolizas(numero, tipoPoliza);
        this.obtenerInteroperabilidad(numero, tipoPoliza);
      }
    })
  }

  visualizarNovedadesPolizas(numero: any, tipoPoliza: any) {
    let idTipo;
    if (tipoPoliza === 'RESPONSABILIDAD CIVIL CONTRACTUAL') idTipo = 1, this.tipoPoliza = 1
    if (tipoPoliza === 'RESPONSABILIDAD CIVIL EXTRACONTRACTUAL') idTipo = 2, this.tipoPoliza = 2
    this.servicioAdministrarPoliza.consultarNovedadesPoliza(idTipo, numero).subscribe({
      next: (novedades: any) => {
        this.novedadesPoliza = novedades;
        this.paginadorNovedades.totalRegistros = this.novedadesPoliza.length;
        this.actualizarNovedadesPaginadas()
      }
    })
  }

  obtenerInteroperabilidad(numero: any, tipoPoliza: any) {
    let idTipo;
    if (tipoPoliza === 'RESPONSABILIDAD CIVIL CONTRACTUAL') idTipo = 1, this.tipoPoliza = 1
    if (tipoPoliza === 'RESPONSABILIDAD CIVIL EXTRACONTRACTUAL') idTipo = 2, this.tipoPoliza = 2
    this.servicioAdministrarPoliza.consultarInteroperabilidad(idTipo, numero).subscribe({
      next: (placas: any) => {
        this.placasInteroperabilidad = placas.placasDisponibles;
        this.paginadorInteroperabilidad.totalRegistros = this.placasInteroperabilidad.length;
        console.log(this.paginadorInteroperabilidad);
        this.actualizarInteroperabilidadPaginadas()
        //this.myInputRef.nativeElement.disabled = true;
      }
    })
  }

  habilitarVinculacionVehiculo(event: Event, placa: string, index: number) {
    const checkbox = event.currentTarget as HTMLInputElement
    if (checkbox.checked == true) {
      console.log(placa)
      document.getElementById(placa + 'input')!.removeAttribute('disabled');
    } else {
      console.log(placa)
      document.getElementById(placa + 'input')!.setAttribute('disabled', 'true');

    }
  }

  agregarVehiculosPoliza() {
    if (this.formPasajeros.invalid) {
      marcarFormularioComoSucio(this.formPasajeros);
      return;
    }
    const vincularVehiculoPoliza = {

    }
  }

  actualizarInteroperabilidadPaginadas() {
    const startIndex = (this.paginadorInteroperabilidad.pagina - 1) * this.paginadorInteroperabilidad.limite;
    const endIndex = startIndex + this.paginadorInteroperabilidad.limite;
    this.placasInteroperabilidadPaginacion = this.placasInteroperabilidad.slice(startIndex, endIndex);
  }

  cambiarPaginaInteroperabilidad(pagina: number) {
    this.paginadorInteroperabilidad.pagina = pagina;
    this.actualizarInteroperabilidadPaginadas();
  }

  actualizarNovedadesPaginadas() {
    const startIndex = (this.paginadorNovedades.pagina - 1) * this.paginadorNovedades.limite;
    const endIndex = startIndex + this.paginadorNovedades.limite;
    this.novedadesPolizaPaginacion = this.novedadesPoliza.slice(startIndex, endIndex); // Obtener solo las novedades para la página actual
  }
  // Cambia de página cuando se detecta un cambio
  cambiarPaginaNovedades(pagina: number) {
    this.paginadorNovedades.pagina = pagina;
    this.actualizarNovedadesPaginadas()  // Carga los datos para la nueva página
  }

}
