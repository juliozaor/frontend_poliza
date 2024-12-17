import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { CapacidadesModel, ModalidadModel, ModalidadesModel } from 'src/app/administrar-polizas/modelos/modalidades';
import { ServicioAdministrarPolizas } from 'src/app/administrar-polizas/servicios/administrar-polizas.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import Swal from 'sweetalert2';
import { maxLengthNumberValidator } from '../../validadores/maximo-validador';
import { valorCeroValidar } from '../../validadores/cero-validacion';
import { negativoValidar } from '../../validadores/negativo-verificar';
import { tamanioValido } from '../../validadores/tamanio-archivo-validar';
import { fechaValida } from '../../validadores/fecha-validador';
import { validarArchivo } from 'src/app/compartido/ValidarFormatoArchivo';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';

@Component({
  selector: 'app-modal-capacidad',
  templateUrl: './modal-capacidad.component.html',
  styleUrls: ['./modal-capacidad.component.css']
})
export class ModalCapacidadComponent implements OnInit {
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!: PopupComponent
  formMX: FormGroup
  formES: FormGroup
  formPC: FormGroup

  desplegarMX: boolean = true
  desplegarES: boolean = false
  desplegarPC: boolean = false

  modalidades: ModalidadesModel[] = []
  capacidadJson!: CapacidadesModel;

  archivoPDFMX?: ArchivoGuardado
  archivoPDFES?: ArchivoGuardado
  archivoPDFPC?: ArchivoGuardado

  excedeTamano1: boolean = false
  excedeTamano2: boolean = false
  excedeTamano3: boolean = false

  tipoIncorrecto1: boolean = false
  tipoIncorrecto2: boolean = false
  tipoIncorrecto3: boolean = false

  usuario: Usuario | null

  constructor(
    private servicioModal: NgbModal,
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
    private servicioLocalStorage: ServicioLocalStorage
  ) {
    this.usuario = servicioLocalStorage.obtenerUsuario()
    this.formMX = new FormGroup({
      // Modalidad MX
      numeroRMX: new FormControl(undefined, [maxLengthNumberValidator(18), negativoValidar()]),
      fechaRMX: new FormControl(undefined),
      PDFRMX: new FormControl(undefined),
    });

    this.formES = new FormGroup({
      //Modalidad ES
      numeroRES: new FormControl(undefined, [maxLengthNumberValidator(18), negativoValidar()]),
      fechaRES: new FormControl(undefined),
      PDFRES: new FormControl(undefined),
    });

    this.formPC = new FormGroup({
      //Modalidad PC
      numeroRPC: new FormControl(undefined, [maxLengthNumberValidator(18), negativoValidar()]),
      fechaRPC: new FormControl(undefined),
      PDFRPC: new FormControl(undefined),
    });

    // Escuchar cambios en los campos de número de cada modalidad
    this.formMX.get('numeroRMX')?.valueChanges.subscribe((value) => {
      this.actualizarValidaciones(this.formMX, value, 'fechaRMX', 'PDFRMX');
    });

    this.formES.get('numeroRES')?.valueChanges.subscribe((value) => {
      this.actualizarValidaciones(this.formES, value, 'fechaRES', 'PDFRES');
    });

    this.formPC.get('numeroRPC')?.valueChanges.subscribe((value) => {
      this.actualizarValidaciones(this.formPC, value, 'fechaRPC', 'PDFRPC');
    });
  }

  actualizarValidaciones(formulario: FormGroup, valorNumero: any, fecha: string, pdf: string) {
    // Obtener referencia a los campos de fecha y PDF del formulario
    const fechaControl = formulario.get(fecha);
    const pdfControl = formulario.get(pdf);

    // Si se ingresa un valor en el campo de número, hacer que fecha y PDF sean obligatorios
    if (valorNumero) {
      fechaControl?.setValidators([Validators.required]);
      pdfControl?.setValidators([Validators.required]);
    } else {
      // Si no se ingresa un valor en el campo de número, quitar la validación de fecha y PDF
      fechaControl?.clearValidators();
      pdfControl?.clearValidators();
    }

    // Actualizar el estado de validación de los campos
    fechaControl?.updateValueAndValidity();
    pdfControl?.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.obtenerModalidades()
  }

  public abrir(): void {
    this.servicioModal.open(this.modal, {

      windowClass: 'custom-modal-size'
    })
    //this.obtenerModalidades()
  }

  obtenerModalidades() {
    this.servicioAdministrarPoliza.obtenerModalidades().subscribe({
      next: (modalidad: any) => {
        this.modalidades = modalidad['modalidades']
      }
    })
  }

  fechaValida(event: any, tipoModalidad: number) {
    if (fechaValida(event)) {
      Swal.fire({
        titleText: "La fecha ingresada no puede ser superior o igual a la fecha actual",
        icon: "error"
      })
      console.log(event.target.name);
      if (tipoModalidad == 1) {
        this.formMX.controls[event.target.name].setValue('')
      } else if (tipoModalidad == 2) {
        this.formES.controls[event.target.name].setValue('')
      } else if (tipoModalidad == 3) {
        this.formPC.controls[event.target.name].setValue('')
      }
    }
  }

  guardarCapacidades() {
    let capacidadJson: any = {}
    let MX!: ModalidadModel
    let ES!: ModalidadModel
    let PC!: ModalidadModel
    const controlMX = this.formMX.controls
    const controlES = this.formES.controls
    const controlPC = this.formPC.controls
    //////////////////// MX ///////////////////////////////
    if (this.formMX.invalid) {//Valida formulario contarctual (Esté lleno)
      marcarFormularioComoSucio(this.formMX)
      Swal.fire({
        text: "Hay errores en " + this.modalidades[0].nombre + " sin corregir",
        icon: "error",
        titleText: "¡No se ha realizado el envío a ST!",
      })
      return;
    } else if (controlMX['numeroRMX'].value) {
      MX = {
        numero: controlMX['numeroRMX'].value,
        vigencia: controlMX['fechaRMX'].value,
        modalidadId: this.modalidades[0].id,
        nombre: this.archivoPDFMX?.nombreAlmacenado,
        nombreOriginal: this.archivoPDFMX?.nombreOriginalArchivo,
        ruta: this.archivoPDFMX?.ruta,
      }
    }
    /////////////////// ES /////////////////////////////
    if (this.formES.invalid) {//Valida formulario contarctual (Esté lleno)
      marcarFormularioComoSucio(this.formES)
      Swal.fire({
        text: "Hay errores en " + this.modalidades[1].nombre + " sin corregir",
        icon: "error",
        titleText: "¡No se ha realizado el envío a ST!",
      })
      return;
    } else if (controlES['numeroRES'].value) {
      ES = {
        numero: controlES['numeroRES'].value,
        vigencia: controlES['fechaRES'].value,
        modalidadId: this.modalidades[1].id,
        nombre: this.archivoPDFES?.nombreAlmacenado,
        nombreOriginal: this.archivoPDFES?.nombreOriginalArchivo,
        ruta: this.archivoPDFES?.ruta,
      }
    }
    //////////////////// PC //////////////////////////
    if (this.formPC.invalid) {//Valida formulario contarctual (Esté lleno)
      marcarFormularioComoSucio(this.formPC)
      Swal.fire({
        text: "Hay errores en " + this.modalidades[2].nombre + " sin corregir",
        icon: "error",
        titleText: "¡No se ha realizado el envío a ST!",
      })
      return;
    } else if (controlPC['numeroRPC'].value) {
      PC = {
        numero: this.formPC.controls['numeroRPC'].value,
        vigencia: this.formPC.controls['fechaRPC'].value,
        modalidadId: this.modalidades[2].id,
        nombre: this.archivoPDFPC?.nombreAlmacenado,
        nombreOriginal: this.archivoPDFPC?.nombreOriginalArchivo,
        ruta: this.archivoPDFPC?.ruta,
      }
    }

    if (MX && !ES && !PC) {//Solo MX existe
      capacidadJson.capacidades = [MX]
    }
    else if (!MX && ES && !PC) {//Solo ES existe
      capacidadJson.capacidades = [ES]
    }
    else if (!MX && !ES && PC) {//Solo PC existe
      capacidadJson.capacidades = [PC]
    }
    else if (MX && ES && !PC) {//Solo existe MX y ES
      capacidadJson.capacidades = [MX, ES]
    }
    else if (MX && !ES && PC) {
      capacidadJson.capacidades = [MX, PC]
    }
    else if (!MX && ES && PC) {
      capacidadJson.capacidades = [ES, PC]
    }
    else if (MX && ES && PC) {
      capacidadJson.capacidades = [MX, ES, PC]
    }/*  else if (!MX && !ES && !PC) {
      Swal.fire({
        text: 'Debe diligenciar al menos una modlidad',
        icon: "error",
      })
      return;
    } */

    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicioAdministrarPoliza.guardarCapacidades(capacidadJson).subscribe({
      next: (respuesta) => {
        this.formMX.reset()
        this.formES.reset()
        this.formPC.reset()
        Swal.fire({
          text: respuesta.mensaje,
          icon: "success",
          confirmButtonText: "Finalizar",
        }).then((result) => {
          if (result.isConfirmed) {
            this.servicioModal.dismissAll();
          }
        })
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          text: error.error.mensaje,
          icon: "error",
        })
      }
    })


  /* if (MX || ES || PC) {
    console.log(this.capacidadJson);

  }else {
    Swal.fire({
      titleText: 'Debe llenar al menos una Modalidad',
      icon: "warning",
    })
  } */
}

cargarArchivoPDf(event: any, tipoModalidad: number) {
  const archivoSeleccionado = event.target.files[0];
  if (archivoSeleccionado) {
    if (this.excedeTamano1 || this.excedeTamano2 || this.excedeTamano3) {
      Swal.fire({
        icon: 'error',
        titleText: 'Excede el tamaño de archivo permitido',
        text: 'El archivo debe pesar máximo 5MB',
      });
      if (tipoModalidad == 1) {
        this.formMX.controls['PDFRMX'].setValue('')
      } else if (tipoModalidad == 2) {
        this.formES.controls['PDFRES'].setValue('')
      } else if (tipoModalidad == 3) {
        this.formPC.controls['PDFRPC'].setValue('')
      }
      return;
    }if (this.tipoIncorrecto1 || this.tipoIncorrecto2 || this.tipoIncorrecto3) {
      Swal.fire({
        icon: 'error',
        titleText: 'Formato de archivo incorrecto',
        text: 'Solo se permiten archivos PDF',
      });
      if (tipoModalidad == 1) {
        this.formMX.controls['PDFRMX'].setValue('')
      } else if (tipoModalidad == 2) {
        this.formES.controls['PDFRES'].setValue('')
      } else if (tipoModalidad == 3) {
        this.formPC.controls['PDFRPC'].setValue('')
      }
      return;
    }
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicioAdministrarPoliza.cargarArchivoPDF(this.usuario!.id,archivoSeleccionado).subscribe({
      next: (respuesta) => {
        if (tipoModalidad == 1) {
          this.archivoPDFMX = respuesta
        } else if (tipoModalidad == 2) {
          this.archivoPDFES = respuesta
        } else if (tipoModalidad == 3) {
          this.archivoPDFPC = respuesta
        }
        Swal.close()
      },
      error: (error: HttpErrorResponse) => {
        console.log('Error: ', error.error.mensaje)
        Swal.fire({
          text: "¡Lo sentimos! No hemos podido cargar el archivo",
          icon: "warning",
        })
        if (tipoModalidad == 1) {
          this.formMX.controls['PDFMX'].setValue('')
        } else if (tipoModalidad == 2) {
          this.formES.controls['PDFES'].setValue('')
        } else if (tipoModalidad == 3) {
          this.formPC.controls['PDFPC'].setValue('')
        }

      }
    })
  }
}

alternarDesplegarMX() {
  this.desplegarMX = !this.desplegarMX
}
alternarDesplegarES() {
  this.desplegarES = !this.desplegarES
}
alternarDesplegarPC() {
  this.desplegarPC = !this.desplegarPC
}

/* resolucionLLeno(event: any, modalidad: number) {
  if (modalidad == 1) {
    const controlMX = this.formMX.controls
    const resolucion = event.target.value; console.log(resolucion, this.archivoPDFMX);
    if (resolucion) {
      controlMX['numeroRMX'].setValidators([Validators.required, valorCeroValidar()])
      controlMX['fechaRMX'].setValidators(Validators.required)
      controlMX['PDFRMX'].setValidators(Validators.required)
      this.formMX.updateValueAndValidity()
    } else {
      this.formMX.reset(); this.archivoPDFMX = undefined
      //this.formMX.clearValidators()
      this.formMX.updateValueAndValidity()
    }
  } else if (modalidad == 2) {
    const controlES = this.formES.controls
    if (controlES['numeroRES'].value) {
      controlES['numeroRES'].setValidators([Validators.required, valorCeroValidar()])
      controlES['fechaRES'].setValidators(Validators.required)
      controlES['PDFRES'].setValidators(Validators.required)
      this.formES.updateValueAndValidity()
    } else {
      this.formES.reset()
      this.formES.clearValidators()
      this.formES.updateValueAndValidity()
    }
  } else if (modalidad == 3) {
    const controlPC = this.formPC.controls
    if (controlPC['numeroRPC'].value) {
      controlPC['numeroRPC'].setValidators([Validators.required, valorCeroValidar()])
      controlPC['fechaRPC'].setValidators(Validators.required)
      controlPC['PDFRPC'].setValidators(Validators.required)
      this.formMX.updateValueAndValidity()
    } else {
      this.formPC.reset()
      this.formPC.clearValidators()
      this.formPC.updateValueAndValidity()
    }
  }
} */

  manejarExcedeTamano(tipo:number){
    if(tipo === 1) {this.excedeTamano1 = true; this.tipoIncorrecto1 = false}
    if(tipo === 2) {this.excedeTamano2 = true; this.tipoIncorrecto2 = false}
    if(tipo === 3) {this.excedeTamano3 = true; this.tipoIncorrecto3 = false}
  }
  manejarTipoIncorrecto(tipo:number){
    if(tipo === 1) {this.tipoIncorrecto1 = true; this.excedeTamano1 = false}
    if(tipo === 2) {this.tipoIncorrecto2 = true; this.excedeTamano2 = false}
    if(tipo === 3) {this.tipoIncorrecto3 = true; this.excedeTamano3 = false}
  }
  manejarArchivoCorrecto(tipo:number){
    if(tipo === 1) {
      this.excedeTamano1 = false
      this.tipoIncorrecto1 = false
    }
    if(tipo === 2) {
      this.excedeTamano2 = false
      this.tipoIncorrecto2 = false
    }
    if(tipo === 3) {
      this.excedeTamano3 = false
      this.tipoIncorrecto3 = false
    }
  }

closeModal() {
  this.servicioModal.dismissAll();
  this.formMX.reset()
  this.formES.reset()
  this.formPC.reset()
}
}
