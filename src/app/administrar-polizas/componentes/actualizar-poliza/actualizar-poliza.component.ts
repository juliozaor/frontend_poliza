import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { Poliza } from '../../modelos/Poliza';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import Swal from 'sweetalert2';
import { ServicioAdministrarPolizas } from '../../servicios/administrar-polizas.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-actualizar-poliza',
  templateUrl: './actualizar-poliza.component.html',
  styleUrls: ['./actualizar-poliza.component.css']
})
export class ActualizarPolizaComponent implements OnInit {
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!: PopupComponent
  @Output() renovada = new EventEmitter<any>();

  usuario: Usuario | null

  fechaActual: string = ''; // Fecha máxima permitida (hoy)
  fechaMinima: string = ''; // Fecha mínima permitida (hoy + 1 día)

  poliza?: Poliza
  fechaInicio: string | null = null
  errorFechaInicio: boolean = false
  fechaFin: string | null = null
  errorFechaFin: boolean = false
  caratula?: ArchivoGuardado
  errorArchivo: boolean = false;
  exedeTamano: boolean = false
  tipoIncorrecto: boolean = false
  mostrar: boolean = false

  constructor(
    private servicioModal: NgbModal,
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
    private servicioArchivos: ServicioArchivos,
    private servicioLocalStorage: ServicioLocalStorage,
    private datePipe: DatePipe
  ) {
    this.usuario = this.servicioLocalStorage.obtenerUsuario()
  }

  ngOnInit(): void {
    this.setFechaActual(); // Inicializa la fecha máxima
  }

  setFechaActual(): void {
    const hoy = new Date(); // Obtiene la fecha actual
    const mañana = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Asegura formato de dos dígitos
    const dia = String(hoy.getDate()).padStart(2, '0');
    this.fechaActual = `${anio}-${mes}-${dia}`; // Formato para el atributo "max"

    mañana.setDate(mañana.getDate() + 1); // Incrementa en 1 día para que sea posterior a hoy
    const anio2 = mañana.getFullYear();
    const mes2 = String(mañana.getMonth() + 1).padStart(2, '0'); // Asegura formato de dos dígitos
    const dia2 = String(mañana.getDate()).padStart(2, '0');
    this.fechaMinima = `${anio2}-${mes2}-${dia2}`; // Formato para el atributo "min"
  }

  public abrir(poliza: Poliza): void {
    this.poliza = poliza
    this.servicioModal.open(this.modal, {
      windowClass: 'custom-modal-class',
      centered: false // Deshabilita el centrado si quieres una ubicación personalizada
    })
    //this.obtenerModalidades()
  }

  cerrar() {
    this.errorArchivo = false
    this.errorFechaFin = false
    this.errorFechaInicio = false
    this.caratula = undefined
    this.fechaInicio = null
    this.fechaFin = null
    this.servicioModal.dismissAll();

  }

  validarFecha(fecha: string | null, tipo: string): void {
    if(this.fechaInicio && this.fechaFin){
      console.log(this.fechaInicio, this.fechaFin)
      if(this.fechaInicio >= this.fechaFin){
        if (tipo === 'inicio') {this.errorFechaInicio = true; this.fechaInicio = null}
        if (tipo === 'fin') {this.errorFechaFin = true; this.fechaFin = null}
      } else {
        if (tipo === 'inicio') {this.errorFechaInicio = false;}
        if (tipo === 'fin') {this.errorFechaFin = false;}
      }
    }
    /* if (fecha) {
      const fechaSeleccionada = new Date(fecha); // Convierte la fecha ingresada a un objeto Date
      const fechaActual = new Date(); // Obtiene la fecha actual
      fechaActual.setHours(0, 0, 0, 0); // Resetea la hora para comparar solo la fecha

      if (tipo === 'inicio') {
        // Verifica si la fecha seleccionada es mayor a la actual
        if (fechaSeleccionada > fechaActual) {
          this.fechaInicio = null
          this.errorFechaInicio = true
        } else {
          this.errorFechaInicio = false
        }
      }
      if (tipo === 'fin') {
        // Verifica si la fecha seleccionada es menor o igual a la actual
        if (fechaSeleccionada <= fechaActual) {
          this.fechaFin = null
          this.errorFechaFin = true
        } else {
          this.errorFechaFin = false
        }
      }
    } */
  }

  cargarArchivoPDf(event: any) {
    const archivoSeleccionado = event.target.files[0];
    if (archivoSeleccionado) {
      if(this.exedeTamano) { return; }
      if (this.tipoIncorrecto) { return; }
      this.exedeTamano = false; this.tipoIncorrecto = false;
      Swal.fire({
        icon: 'info',
        allowOutsideClick: false,
        text: 'Espere por favor...',
      });
      Swal.showLoading(null); //this.servicioAdministrarPoliza.cargarArchivoPDF(archivoSeleccionado)
      this.servicioArchivos.guardarArchivo(archivoSeleccionado,'polizas',this.usuario?.id!).subscribe({
        next: (respuesta) => {
          Swal.fire({
            titleText: "¡Archivo cargado correctamente!",
            icon: "success"
          })
          this.caratula = respuesta
        },
        error: (error: HttpErrorResponse) => {
          //console.log('Error: ',error.error)
          Swal.fire({
            text: "¡Lo sentimos! No hemos podido cargar el archivo",
            icon: "warning",
          })
          archivoSeleccionado.value = null
        }
      })
    }
  }

  renovar () {
    if(this.fechaInicio && this.fechaFin && this.caratula) {
      const [diaI, mesI, anioI] = this.fechaInicio.split('/').map(Number); // Divide y convierte a números
      const [diaF, mesF, anioF] = this.fechaFin.split('/').map(Number); // Divide y convierte a números
      const fechaIni = new Date(anioI, mesI - 1, diaI); // Mes se resta porque empieza desde 0
      const fechaFin = new Date(anioI, mesI - 1, diaI); // Mes se resta porque empieza desde 0
      let JSONRenovar = {
        numeroPoliza: Number(this.poliza?.poliza),
        idTipoPoliza: this.poliza?.tipoPoliza === 'RESPONSABILIDAD CIVIL CONTRACTUAL' ? 1 : 2,
        fechaInicio: this.datePipe.transform(this.fechaInicio, 'yyyy/MM/dd'),
        /* fechaInicio: fechaIni, */
        fechaFin: this.datePipe.transform(this.fechaFin, 'yyyy/MM/dd'),
        vigiladoId: this.usuario?.usuario,
        caratula: this.caratula?.nombreAlmacenado,
        nombreOriginal: this.caratula?.nombreOriginalArchivo,
        ruta: this.caratula?.ruta
      }
      this.servicioAdministrarPoliza.renovar(JSONRenovar).subscribe({
        next: (respuesta) => {
          this.renovada.emit(true)
          this.cerrar()
          Swal.fire({
            title: "¡Renovación exitosa!",
            text: "Póliza renovada correctamente",
            icon: "success",
          })
        }
      })
    } else {
      Swal.fire({
        title: "¡Renovación fallida!",
        text: "Por favor, diligencia todos los campos",
        icon: "error",
      })
    }

  }

  manejarExcedeTamano(){
    this.exedeTamano = true
    this.tipoIncorrecto = false
  }
  manejarTipoIncorrecto(){
    this.tipoIncorrecto = true
    this.exedeTamano = false
  }
  manejarArchivoCorrecto(){
    this.tipoIncorrecto = false; this.exedeTamano = false
  }
}
