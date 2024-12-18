import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { FiltrarPolizas } from '../../modelos/FiltrosPoliza';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Observable } from 'rxjs';
import { ServicioAdministrarPolizas } from '../../servicios/administrar-polizas.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { valorCeroValidar } from '../polizas/validadores/cero-validacion';
import { negativoValidar } from '../polizas/validadores/negativo-verificar';
import Swal from 'sweetalert2';
import { maxLengthNumberValidator } from '../polizas/validadores/maximo-validador';
import { ModalidadesPModel } from 'src/app/administrar-polizas/modelos/modalidades';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';
import { ActualizarPolizaComponent } from '../actualizar-poliza/actualizar-poliza.component';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { Poliza } from '../../modelos/Poliza';

@Component({
  selector: 'app-gestionar-polizas',
  templateUrl: './gestionar-polizas.component.html',
  styleUrls: ['./gestionar-polizas.component.css']
})
export class GestionarPolizasComponent implements OnInit {
  @ViewChild('pasajeros') myInputRef!: ElementRef;
  @ViewChild('actualizarPoliza') actualizarPoliza!: ActualizarPolizaComponent
  @ViewChild('popup') popup!: PopupComponent

  polizas: Array<Poliza> = []
  novedadesPoliza: Array<{ poliza: string, tipoPoliza: string | number, placa: string, fechaActualizacion: string, estado: string, observacion: string }> = []
  novedadesPolizaPaginacion: Array<{ poliza: string, tipoPoliza: string | number, placa: string, fechaActualizacion: string, estado: string, observacion: string, tipopolizanombre?: string }> = []
  placasInteroperabilidad: Array<string> = []
  placasInteroperabilidadPaginacion: Array<string> = []

  totalVehiculos: number = 0;
  totalVehiculosContractuales: number = 0;
  totalVehiculosExtracontractuales: number = 0;

  textoAlert: string = ''; alert: string = ''
  checkHabilitado: boolean = false;
  esValido: boolean = false;

  tipoPoliza: number = 0;
  numeroPoliza: any;
  verPoliza: boolean = false;
  poliza: any;
  vehiculos: { placa?: string, pasajeros?: number, index?: number }[] = [];
  placa?: String;
  estadoPoliza?: boolean

  vehiculos2: { placa: string; pasajeros?: number; placaValida: boolean }[] = [];

  paginador: Paginador<FiltrarPolizas>
  errores: { [key: string]: string | undefined } = {};

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

  nPoliza: string = '';
  tPoliza: string | number = ''
  ePoliza: string | number | null = null

  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
    private activatedRoute: ActivatedRoute,
    private ServiceMenuP: MenuHeaderPService,
    private fb: FormBuilder) {
    this.paginador = new Paginador<FiltrarPolizas>(this.obtenerPolizas)
  }

  ngOnInit(): void {
    this.inicializarPaginador();
    this.ServiceMenuP.RutaModelo = '/gestionar-polizas' //paolo
  }

  agregarVehiculoForm(): void {
    this.vehiculos2.push({ placa: '', pasajeros: undefined, placaValida: false });
  }

  eliminarVehiculo(index: number): void {
    this.vehiculos2.splice(index, 1);
  }

  validarPlaca(placa: string, index: number): void {
    if (this.vehiculos2.some((vehiculo, i) => i !== index && vehiculo.placa === placa)) {
      Swal.fire({
        titleText: "¡Placa ya registrada!",
        confirmButtonText: "Aceptar",
        icon: "warning",
      });
      this.vehiculos2[index].placa = '';  // Vaciar el campo si la placa ya existe
      return;
    } else {
      this.vehiculos2[index].placaValida = !!placa;  // Habilitar el input de pasajeros si la placa es válida
    }
  }

  limitarDigitos(event: any, maxDigits: number) {
    const input = event.target;
    if (input.value.length > maxDigits) {
      input.value = input.value.slice(0, maxDigits);
    }
  }

  obtenerPolizas = (pagina: number, limite: number, filtros?: FiltrarPolizas) => {
    return new Observable<Paginacion>((suscriptor: any) => {
      this.servicioAdministrarPoliza.listarPolizas(pagina, limite, filtros).subscribe({
        next: (polizas: any) => {
          this.polizas = polizas.polizas
          this.totalVehiculos = polizas.totalVehiculos;
          this.totalVehiculosContractuales = polizas.totalVehiculosContractual;
          this.totalVehiculosExtracontractuales = polizas.totalVehiculosExtraContractual;
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

  visualizarPoliza(numero: any, tipoPoliza: any, estadoPoliza?: any) {
    let idTipo;
    this.numeroPoliza = numero;
    this.verPoliza = false;
    if ('ACTIVA' === estadoPoliza) { this.estadoPoliza = true }
    else if ('INACTIVA' === estadoPoliza) { this.estadoPoliza = false }
    if (tipoPoliza === 'RESPONSABILIDAD CIVIL CONTRACTUAL') idTipo = 1, this.tipoPoliza = 1
    if (tipoPoliza === 'RESPONSABILIDAD CIVIL EXTRACONTRACTUAL') idTipo = 2, this.tipoPoliza = 2
    this.servicioAdministrarPoliza.visualizarPoliza(numero, idTipo).subscribe({
      next: (poliza: any) => {
        this.poliza = poliza
        this.verPoliza = true;
        this.actualizarEstadoBoton();
        this.visualizarNovedadesPolizas(numero, tipoPoliza);
        this.obtenerInteroperabilidad(numero, tipoPoliza);
        this.modalidadesP = poliza.modalidades
        //console.log(poliza.modalidades)
      }
    })
    this.actualizarEstadoBoton();
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
        this.actualizarInteroperabilidadPaginadas()
      }
    })
  }
  /*******PAOLO********************************************************** */
  public modalidadesP: any;
  /******************FIN DOCIGO DE PAOLO**********************************/
  habilitarVinculacionVehiculo(event: Event, placa: string) {
    const checkbox = event.currentTarget as HTMLInputElement
    if (checkbox.checked == true) {
      this.vehiculos.push({
        placa: placa
      })
      document.getElementById(placa + 'input')!.removeAttribute('disabled');
      this.checkHabilitado = true
    } else {
      this.vehiculos = this.vehiculos.filter(vehiculo => vehiculo.placa !== placa);
      document.getElementById(placa + 'input')!.setAttribute('disabled', 'true');
      const input = document.getElementById(placa + 'input')! as HTMLInputElement;
      input.value = '';
      this.checkHabilitado = false
      this.errores[input.id] = undefined;
      this.actualizarEstadoBoton();
    }
  }

  // Método para validar el estado del botón
  actualizarEstadoBoton(): void {
    this.esValido = Object.values(this.errores).every(error => error === undefined);
  }

  // agregarPasajeros(pasajeros: Event, placa: string) {
  //   const pasajero = pasajeros.target as HTMLInputElement
  //   if (!pasajero) {
  //     console.log("no se ingreso pasajero");
  //     return;
  //   }
  //   const valor = pasajero.value;
  //   const cantidadPasajeros = parseInt(valor);

  //   if (valor === '') {
  //     this.errores[pasajero.id] = 'requerido';
  //   } else if (isNaN(cantidadPasajeros) || cantidadPasajeros <= 0) {
  //     this.errores[pasajero.id] = cantidadPasajeros === 0 ? 'cero' : 'negativo';
  //   } else {
  //     this.errores[pasajero.id] = undefined;
  //   }
  //   this.actualizarEstadoBoton();
  //   const index = this.vehiculos.findIndex(item => item.placa === placa)
  //   if (index > -1) {
  //     this.vehiculos[index].pasajeros = parseInt(pasajero.value)
  //   }
  // }

  agregarVehiculosPoliza(): void {

    if (this.vehiculos2.length === 0) {
      Swal.fire({
        titleText: "¡Debe agregar al menos un vehículo!",
        confirmButtonText: "Aceptar",
        icon: "error",
      });
      return;
    }

    for (const vehiculo of this.vehiculos2) {
      if (!vehiculo.pasajeros || !vehiculo.placa || vehiculo.pasajeros <= 0) {
        Swal.fire({
          titleText: "Cada vehículo debe tener una placa válida y cantidad de pasajeros",
          confirmButtonText: "Aceptar",
          icon: "error",
        });
        return;
      }
    }

    let vehiculosIndex: { placa?: string, pasajeros?: number }[] = [];
    for (let i = 0; i < this.vehiculos2.length; i++) {
      vehiculosIndex.push({
        placa: this.vehiculos2[i].placa,
        pasajeros: this.vehiculos2[i].pasajeros
      })
    }

    console.log(vehiculosIndex);

    const vehiculos = {
      poliza: this.numeroPoliza,
      tipoPoliza: this.tipoPoliza,
      vehiculos: vehiculosIndex
    }
    let tipoPoliza = ''
    if (vehiculos.tipoPoliza === 1) {
      tipoPoliza = 'RESPONSABILIDAD CIVIL CONTRACTUAL'
    }
    if (vehiculos.tipoPoliza === 2) {
      tipoPoliza = 'RESPONSABILIDAD CIVIL EXTRACONTRACTUAL'
    }

    Swal.fire({
      titleText: "¿Está seguro de vincular los vehículos ingresados?",
      confirmButtonText: "Aceptar",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioAdministrarPoliza.agregarVehiculosPoliza(vehiculos).subscribe({
          next: (respuesta: any) => {
            this.visualizarPoliza(parseInt(vehiculos.poliza), tipoPoliza)
            if (respuesta.estado === 200) {
              this.openAlert(respuesta.mensaje, "exito")
            } else if (respuesta.estado === 201) {
              this.openAlert(respuesta.mensaje, "error")
            }
            this.limpiarFormulario()
            this.inicializarPaginador();
          }
        })
      } else if (result.isDismissed) {
        Swal.close()
      }
    })
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

  openAlert(texto: string, alerta: string) {
    this.alert = alerta
    this.textoAlert = texto
    document.getElementById('closealertcontainer')!.style.display = 'flex';
    document.getElementById('closealert')!.style.cssText = 'position: fixed; bottom: 23px; width: 100%; z-index: 2; display: flex;';
  }

  limpiarFormulario() {
    this.vehiculos2 = [];
  }

  convertirTipoOracion(texto: string): string {
    if (!texto) return ''; // Manejar casos donde el texto esté vacío o sea null
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  /* ACTUALIZAR POLIZAS */
  abrirModalActualizar(poliza: Poliza) {
    const estadoModal = this.actualizarPoliza.abrir(poliza)
  }

  setnPoliza(nPoliza:string){
    this.nPoliza = nPoliza
  }

  actualizarFiltros() {
    this.paginador.filtrar({
      poliza: this.nPoliza ?? undefined,
      tipoPoliza: this.tPoliza ?? undefined,
      estado: this.ePoliza ?? undefined,
    });
  }

  limpiarFiltros() {
    this.nPoliza = '';
    this.tPoliza = '';
    this.ePoliza = null;
    this.paginador.filtrar({});
  }

  formatearFecha(fechaString: string): string {
    return new Date(fechaString).toISOString().split('T')[0];
  }

}
