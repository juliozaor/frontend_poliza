import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { FiltrarPolizas } from '../../modelos/FiltrosPoliza';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Observable } from 'rxjs';
import { ServicioAdministrarPolizas } from '../../servicios/administrar-polizas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { valorCeroValidar } from '../polizas/validadores/cero-validacion';
import { negativoValidar } from '../polizas/validadores/negativo-verificar';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import Swal from 'sweetalert2';
import { maxLengthNumberValidator } from '../polizas/validadores/maximo-validador';

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

  totalVehiculos: number = 0;
  textoAlert: string = ''; alert: string = ''
  checkHabilitado: boolean = false;
  esValido: boolean = false;

  tipoPoliza: number = 0;
  numeroPoliza: any;
  verPoliza: boolean = false;
  poliza: any;
  vehiculos: { placa?: string, pasajeros?: number }[] = [];
  placa?: String;

  formPasajeros: FormGroup;
  vehiculosForm: FormGroup;

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

  constructor(private servicioAut: AutenticacionService,
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
    private activatedRoute: ActivatedRoute,
    private router: Router, private fb: FormBuilder) {
    this.paginador = new Paginador<FiltrarPolizas>(this.obtenerPolizas)
    this.formPasajeros = new FormGroup({
      pasajeros: new FormControl(undefined, [Validators.required, valorCeroValidar(), negativoValidar()]),
    })
    this.vehiculosForm = this.fb.group({
      formularioVehiculos: this.fb.array([])
    });
    this.agregarVehiculo();
  }

  ngOnInit(): void {
    this.inicializarPaginador();
    this.formPasajeros.controls['pasajeros'].disable();
  }

  get formularioVehiculos(): FormArray {
    return this.vehiculosForm.controls["formularioVehiculos"] as FormArray;
  }

  crearFormularioVehiculos(): FormGroup {
    return this.fb.group({
      placa: ["", [Validators.required, maxLengthNumberValidator(6)]],
      pasajeros: [undefined, [Validators.required, maxLengthNumberValidator(7), valorCeroValidar(), negativoValidar()]]
    })
  }

  agregarVehiculo() {
    this.formularioVehiculos.push(this.crearFormularioVehiculos());
  }

  eliminarInputsVehiculos(vehiculoIndex: number) {
    this.formularioVehiculos.removeAt(vehiculoIndex);
    if (vehiculoIndex > -1) {
      this.vehiculos.splice(vehiculoIndex, 1)
    }
  }

  obtenerPolizas = (pagina: number, limite: number, filtros?: FiltrarPolizas) => {
    return new Observable<Paginacion>((suscriptor: any) => {
      this.servicioAdministrarPoliza.listarPolizas(pagina, limite, filtros).subscribe({
        next: (polizas: any) => {
          this.polizas = polizas.polizas
          this.totalVehiculos = polizas.totalVehiculos;
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
        this.actualizarEstadoBoton();
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
        this.actualizarInteroperabilidadPaginadas()
      }
    })
  }

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

  actualizarEstadoBoton() {
    this.esValido = Object.values(this.errores).every(error => error === undefined);
  }


  agregarPasajeros(tipo: number, index: number) {

    if (tipo === 1) {
      const placa = document.getElementById('placa' + index) as HTMLInputElement
      const valorPlaca = placa.value
      if (!valorPlaca || valorPlaca == '') {
        this.vehiculos.splice(index, 1)

        const inputPasajeros = document.getElementById('pasajeros' + index) as HTMLInputElement;

        if (inputPasajeros) {
          inputPasajeros.value = '';
          inputPasajeros.setAttribute('disabled', 'true');
        }
        return console.log("debe ingresar la placa");

      }

      const placaExistente = this.vehiculos.find(vehiculo => vehiculo.placa === valorPlaca);

      if (placaExistente) {
        return Swal.fire({
          titleText: "Señor usuario, ya usted registro esta placa",
          confirmButtonText: "Aceptar",
          icon: "error",
          showCancelButton: false,
        }).then((result) => {
          if (result.isConfirmed) {
            const inputPasajeros = document.getElementById('placa' + index) as HTMLInputElement;
            inputPasajeros.value = '';
          } else if (result.isDismissed) {
            Swal.close()
          }
        });
      }

      const inputPasajeros = document.getElementById('pasajeros' + index) as HTMLInputElement;
      if (inputPasajeros) {
        inputPasajeros.removeAttribute('disabled');
      }

      this.placa = valorPlaca;
      this.vehiculos.push({
        placa: valorPlaca
      });
    }

    if (tipo === 2) {
      const pasajero = document.getElementById('pasajeros' + index) as HTMLInputElement
      const indexPasajero = this.vehiculos.findIndex(item => item.placa === this.placa)
      if (indexPasajero > -1) {
        this.vehiculos[indexPasajero].pasajeros = parseInt(pasajero.value)
      }
    }
    this.actualizarEstadoBoton();
    console.log(this.vehiculos);
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

  agregarVehiculosPoliza() {
    console.log(this.vehiculos);

    if (!this.vehiculos || this.vehiculos.length == 0) {
      Swal.fire({
        titleText: "La placas son requeridas",
        confirmButtonText: "Aceptar",
        icon: "error",
        showCancelButton: false,
      })
      return;
    }

    for (const vehiculo of this.vehiculos) {
      if (vehiculo.pasajeros === undefined || vehiculo.pasajeros === null || vehiculo.pasajeros <= 0) {
        Swal.fire({
          titleText: "Cada vehículo debe tener una cantidad válida de pasajeros",
          confirmButtonText: "Aceptar",
          icon: "error",
          showCancelButton: false,
        });
        return;
      } else if (vehiculo.placa === undefined || vehiculo.placa === null || vehiculo.placa === '') {
        Swal.fire({
          titleText: "Cada vehículo debe tener una placa válida",
          confirmButtonText: "Aceptar",
          icon: "error",
          showCancelButton: false,
        });
      }
    }

    const vehiculos = {
      poliza: this.numeroPoliza,
      tipoPoliza: this.tipoPoliza,
      vehiculos: this.vehiculos
    }
    let tipoPoliza = ''
    if (vehiculos.tipoPoliza === 1) {
      tipoPoliza = 'RESPONSABILIDAD CIVIL CONTRACTUAL'
    }
    if (vehiculos.tipoPoliza === 2) {
      tipoPoliza = 'RESPONSABILIDAD CIVIL EXTRACONTRACTUAL'
    }

    Swal.fire({
      titleText: "¿Señor usuario, está seguro de agregar las placas seleccionadas?",
      confirmButtonText: "Aceptar",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioAdministrarPoliza.agregarVehiculosPoliza(vehiculos).subscribe({
          next: (respuesta: any) => {
            this.visualizarPoliza(parseInt(vehiculos.poliza), tipoPoliza)
            this.openAlert(respuesta.mensaje, "exito")
            this.vehiculos = [];
            this.formularioVehiculos.clear();
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

}
