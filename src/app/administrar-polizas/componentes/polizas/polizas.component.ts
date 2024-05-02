import { Component, OnInit, ViewChild } from '@angular/core';
import { Aseguradoras } from '../../modelos/aseguradoras';
import { ServicioAdministrarPolizas } from '../../servicios/administrar-polizas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { HttpErrorResponse } from '@angular/common/http';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { CaratulaModel, PolizaContractualModel, PolizaExtracontractualModel, ResponsabilidadModel } from '../../modelos/guardarPoliza';
import Swal from 'sweetalert2';
import { amparos } from '../../modelos/amparos';
import { ModalCapacidadComponent } from './modal/modal-capacidad/modal-capacidad.component';
import { maxLengthNumberValidator } from './validadores/maximo-validador';
import { capasValidator } from './validadores/capas-validacion';
import { valorCeroValidar } from './validadores/cero-validacion';
import { negativoValidar } from './validadores/negativo-verificar';

@Component({
  selector: 'app-polizas',
  templateUrl: './polizas.component.html',
  styleUrls: ['./polizas.component.css']
})
export class PolizasComponent implements OnInit {
  @ViewChild('modalCapacidad') modalCapacidad!: ModalCapacidadComponent
  @ViewChild('popup') popup!: PopupComponent

  base64String!: string
  archivoCargado: string = ""
  archivoPDF?: ArchivoGuardado
  obligatorio: boolean = false
  deshabilitado: boolean = false

  desplegarRCC: boolean = true
  desplegarRCE: boolean = true
  desplegarAmparosB: boolean = true
  desplegarAmparosA: boolean = true
  fondoResponsabilidadC: boolean = false
  fondoResponsabilidadE: boolean = false

  aseguradoras: Aseguradoras[] = []

  amparosBasicosC: amparos[] = [
    { nombre: 'Muerte Accidental', id: '1' },
    { nombre: 'Incapacidad Temporal', id: '2' },
    { nombre: 'Incapacidad Permanente', id: '3' },
    { nombre: 'Gastos Médicos Hospitalarios', id: '4' }
  ]
  amparosBasicosE: amparos[] = [
    { nombre: 'Daños a bienes de terceros', id: '5' },
    { nombre: 'Lesiones o Muerte a 1 persona', id: '6' },
    { nombre: 'Lesiones o Muerte a 2 o mas personas', id: '7' }
  ]
  amparosAdicionales: amparos[] = [
    { nombre: 'Amparo patrimonial', id: '8' },
    { nombre: 'Asistencia Juridica en proceso penal y civil', id: '9' },
    { nombre: 'Perjuicios patrimoniales y extrapatrimoniales', id: '10' },
    { nombre: 'Otras', id: '11' }
  ]

  formContractual: FormGroup;
  formExtracontractual: FormGroup;

  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
  ) {
    //-- Formulario Responsabilidad contractual
    this.formContractual = new FormGroup({
      numeroPolizaC: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(20), valorCeroValidar(), negativoValidar()]),
      aseguradorasC: new FormControl("", [Validators.required]),
      vigenciaPolizaInicioC: new FormControl(undefined, [Validators.required]),
      vigenciaPolizaFinalC: new FormControl(undefined, [Validators.required]),
      //----- Amparos basicos -----//
      valorAseguradoAB1: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAB1: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAB1: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAB2: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAB2: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAB2: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAB3: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAB3: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAB3: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAB4: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAB4: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAB4: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      //----- Amparos adicionales -----//
      valorAseguradoAA5: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAA5: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAA5: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAA6: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAA6: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAA6: new FormControl(undefined, [ /* Validators.required,  */ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAA7: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAA7: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAA7: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAA8: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAA8: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAA8: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      //----- Cargue de archivos -----//
      cargarExcel: new FormControl(undefined, [Validators.required]),
      cargarPDF: new FormControl(undefined, [Validators.required]),
      //----- Responsabilidad -----//
      checkResponsabilidadC: new FormControl(false),
      fechaConstitucion: new FormControl(undefined),
      numeroResolucion: new FormControl(undefined),
      fechaResolucion: new FormControl(undefined),
      valorReserva: new FormControl(undefined),
      fechaCorteReserva: new FormControl(undefined),
      infoComplementaria: new FormControl(undefined),
      capas: new FormControl(undefined),
      capa1: new FormControl(undefined),
      capa2: new FormControl(undefined),
    })
    this.formContractual.get('checkResponsabilidadC')?.enable()

    //-- Formulario Responsabilidad extracontractual
    this.formExtracontractual = new FormGroup({
      numeroPolizaE: new FormControl(undefined, [maxLengthNumberValidator(20), valorCeroValidar(), negativoValidar()]),
      aseguradorasE: new FormControl("",),
      vigenciaPolizaInicioE: new FormControl(undefined,),
      vigenciaPolizaFinalE: new FormControl(undefined,),
      //----- Amparos basicos -----//
      valorAseguradoAB9: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAB9: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAB9: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAB10: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAB10: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAB10: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAB11: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAB11: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAB11: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      //----- Amparos adicionales -----//
      valorAseguradoAA12: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAA12: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAA12: new FormControl(undefined,[ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAA13: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAA13: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAA13: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAA14: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAA14: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAA14: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAA15: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      limitesAA15: new FormControl(undefined, [maxLengthNumberValidator(3), valorCeroValidar(), negativoValidar()]),
      deducibleAA15: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      //----- Cargue de archivos -----//
      cargarExcel: new FormControl(undefined,),
      cargarPDF: new FormControl(undefined,),
      //----- Responsabilidad -----//
      checkResponsabilidadE: new FormControl(false),
      fechaConstitucion: new FormControl(undefined,),
      numeroResolucion: new FormControl(undefined, maxLengthNumberValidator(20)),
      fechaResolucion: new FormControl(undefined,),
      valorReserva: new FormControl(undefined, maxLengthNumberValidator(4)),
      fechaCorteReserva: new FormControl(undefined,),
      infoComplementaria: new FormControl(undefined,),
      capas: new FormControl(undefined, maxLengthNumberValidator(1)),
      capa1: new FormControl(undefined, maxLengthNumberValidator(4)),
      capa2: new FormControl(undefined, maxLengthNumberValidator(4))
    })
    this.formExtracontractual.get('checkResponsabilidadE')?.disable()
  }

  ngOnInit(): void {
    //this.deshabilitarFormularios()
    this.obtenerAseguradora()
  }

  finalizar() {
    Swal.fire({
      titleText: "¿Seguro que quiere finalizar?",
      text: "Después de enviar a la Superintendencia de Transporte no podrá llenar más polizas.",
      confirmButtonText: "Aceptar",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.formContractual.reset()
        this.formExtracontractual.reset()
        this.abrirModalCapacidad()
      } else if (result.isDismissed) {
        Swal.close()
      }
    })
  }

  deshabilitarFormularios() {
    this.servicioAdministrarPoliza.obtenerEstadoVigilado().subscribe({
      next: (deshabilitado: boolean) => {
        if (deshabilitado) {
          this.deshabilitado = deshabilitado
          this.formContractual.disable()
          this.formExtracontractual.disable()
          Swal.fire({
            titleText: "¡Usted ya envió a la Superintendencia de Transporte",
            icon: "info"
          })
        }
      }
    })
  }

  obtenerAseguradora() {
    this.servicioAdministrarPoliza.obtenerAseguradora().subscribe({
      next: (aseguradora: any) => {
        this.aseguradoras = aseguradora['aseguradoras']
      }
    })
  }

  cambiarNumeroPoliza(tipoPoliza: number){
    if(tipoPoliza == 1){this.formContractual.controls['cargarExcel'].setValue('')}
    if(tipoPoliza == 2){this.formExtracontractual.controls['cargarExcel'].setValue('')}
  }

  guardarPolizas() {
    console.log(this.formContractual);

    if (this.formContractual.invalid) {//Valida formulario contarctual (Esté lleno)
      marcarFormularioComoSucio(this.formContractual)
      Swal.fire({
        text: "Hay errores en Responsabilidad Contractual sin corregir",
        icon: "error",
        titleText: "¡No se ha realizado el guardado de la póliza!",
      })
      return;
    }

    const controlsC = this.formContractual.controls
    const controlsE = this.formExtracontractual.controls
    const polizaContractual: PolizaContractualModel = {
      numero: controlsC['numeroPolizaC'].value,
      aseguradoraId: controlsC['aseguradorasC'].value,
      inicioVigencia: controlsC['vigenciaPolizaInicioC'].value,
      finVigencia: controlsC['vigenciaPolizaFinalC'].value,
      amparos: [
        {
          coberturaId: '1',
          valorAsegurado: controlsC['valorAseguradoAB1'].value,
          limite: controlsC['limitesAB1'].value,
          deducible: controlsC['deducibleAB1'].value,
        },
        {
          coberturaId: '2',
          valorAsegurado: controlsC['valorAseguradoAB2'].value,
          limite: controlsC['limitesAB2'].value,
          deducible: controlsC['deducibleAB2'].value,
        },
        {
          coberturaId: '3',
          valorAsegurado: controlsC['valorAseguradoAB3'].value,
          limite: controlsC['limitesAB3'].value,
          deducible: controlsC['deducibleAB3'].value,
        },
        {
          coberturaId: '4',
          valorAsegurado: controlsC['valorAseguradoAB4'].value,
          limite: controlsC['limitesAB4'].value,
          deducible: controlsC['deducibleAB4'].value,
        },
        {
          coberturaId: '5',
          valorAsegurado: controlsC['valorAseguradoAA5'].value,
          limite: controlsC['limitesAA5'].value,
          deducible: controlsC['deducibleAA5'].value,
        },
        {
          coberturaId: '6',
          valorAsegurado: controlsC['valorAseguradoAA6'].value,
          limite: controlsC['limitesAA6'].value,
          deducible: controlsC['deducibleAA6'].value,
        },
        {
          coberturaId: '7',
          valorAsegurado: controlsC['valorAseguradoAA7'].value,
          limite: controlsC['limitesAA7'].value,
          deducible: controlsC['deducibleAA7'].value,
        },
        {
          coberturaId: '8',
          valorAsegurado: controlsC['valorAseguradoAA8'].value,
          limite: controlsC['limitesAA8'].value,
          deducible: controlsC['deducibleAA8'].value,
        }
      ]
    }
    const responsabilidadC: ResponsabilidadModel = {
      fechaConstitucion: controlsC['fechaConstitucion'].value,
      resolucion: controlsC['numeroResolucion'].value,
      fechaResolucion: controlsC['fechaResolucion'].value,
      valorReserva: controlsC['valorReserva'].value,
      fechaReserva: controlsC['fechaCorteReserva'].value,
      informacion: controlsC['infoComplementaria'].value,
      operacion: controlsC['capas'].value,
      valorCumplimientoUno: controlsC['capa1'].value,
      valorCumplimientoDos: controlsC['capa2'].value,
    }
    const caratulaC: CaratulaModel = {
      nombre: this.archivoPDF?.nombreAlmacenado,
      nombreOriginal: this.archivoPDF?.nombreOriginalArchivo,
      ruta: this.archivoPDF?.ruta
    }
    const polizaExtracontractual: PolizaExtracontractualModel = {
      numero: controlsE['numeroPolizaE'].value,
      aseguradoraId: controlsE['aseguradorasE'].value,
      inicioVigencia: controlsE['vigenciaPolizaInicioE'].value,
      finVigencia: controlsE['vigenciaPolizaFinalE'].value,
      amparos: [
        {
          coberturaId: '9',
          valorAsegurado: controlsE['valorAseguradoAB9'].value,
          limite: controlsE['limitesAB9'].value,
          deducible: controlsE['deducibleAB9'].value,
        },
        {
          coberturaId: '10',
          valorAsegurado: controlsE['valorAseguradoAB10'].value,
          limite: controlsE['limitesAB10'].value,
          deducible: controlsE['deducibleAB10'].value,
        },
        {
          coberturaId: '11',
          valorAsegurado: controlsE['valorAseguradoAB11'].value,
          limite: controlsE['limitesAB11'].value,
          deducible: controlsE['deducibleAB11'].value,
        },
        {
          coberturaId: '12',
          valorAsegurado: controlsE['valorAseguradoAA12'].value,
          limite: controlsE['limitesAA12'].value,
          deducible: controlsE['deducibleAA12'].value,
        },
        {
          coberturaId: '13',
          valorAsegurado: controlsE['valorAseguradoAA13'].value,
          limite: controlsE['limitesAA13'].value,
          deducible: controlsE['deducibleAA13'].value,
        },
        {
          coberturaId: '14',
          valorAsegurado: controlsE['valorAseguradoAA14'].value,
          limite: controlsE['limitesAA14'].value,
          deducible: controlsE['deducibleAA14'].value,
        },
        {
          coberturaId: '15',
          valorAsegurado: controlsE['valorAseguradoAA15'].value,
          limite: controlsE['limitesAA15'].value,
          deducible: controlsE['deducibleAA15'].value,
        },
      ]
    }
    const responsabilidadE: ResponsabilidadModel = {
      fechaConstitucion: controlsE['fechaConstitucion'].value,
      resolucion: controlsE['numeroResolucion'].value,
      fechaResolucion: controlsE['fechaResolucion'].value,
      valorReserva: controlsE['valorReserva'].value,
      fechaReserva: controlsE['fechaCorteReserva'].value,
      informacion: controlsE['infoComplementaria'].value,
      operacion: controlsE['capas'].value,
      valorCumplimientoUno: controlsE['capa1'].value,
      valorCumplimientoDos: controlsE['capa2'].value,
    }
    const caratulaE: CaratulaModel = {
      nombre: this.archivoPDF?.nombreAlmacenado,
      nombreOriginal: this.archivoPDF?.nombreOriginalArchivo,
      ruta: this.archivoPDF?.ruta
    }

    polizaContractual.caratula = caratulaC //Añade la caratula correspondiente a la poliza contractual
    if (this.formContractual.get('checkResponsabilidadC')?.value == true) { //corrobora si tiene o no responsabilidad
      polizaContractual.responsabilidad = responsabilidadC
    }

    polizaExtracontractual.caratula = caratulaE //Añade la caratula correspondiente a la poliza extracontractual
    if (this.formExtracontractual.get('checkResponsabilidadE')?.value == true) { //corrobora si tiene o no responsabilidad
      polizaExtracontractual.responsabilidad = responsabilidadE
    }

    const polizaJson: any = {
      polizaContractual: polizaContractual,
    };

    //Valida formulario extracontarctual sea valido (Esté lleno) si y solo si se ha escrito el numero de poliza
    if (this.formExtracontractual.controls['numeroPolizaE'].value && this.formExtracontractual.controls['numeroPolizaE'].value != "") {
      if (this.formExtracontractual.invalid) {
        marcarFormularioComoSucio(this.formExtracontractual)
        Swal.fire({
          text: "Hay errores en Responsabilidad Extracontractual sin corregir",
          icon: "error",
          titleText: "¡No se ha realizado el guardado de la póliza!",
        })
        return;
      }
      if(this.formExtracontractual.controls['numeroPolizaE'].value == this.formContractual.controls['numeroPolizaC'].value){
        Swal.fire({
          icon: "error",
          titleText: "¡Los números de póliza no pueden ser iguales!",
          text: "por favor, corrija los números de poliza"
        })
        controlsC['numeroPolizaC'].setValue('')
        controlsE['numeroPolizaE'].setValue('')
        return;
      }
      polizaJson.polizaExtracontractual = polizaExtracontractual
    }
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicioAdministrarPoliza.guardarPoliza(polizaJson).subscribe({
      next: (respuesta) => {
        console.log(respuesta)
        this.formContractual.reset()
        this.formExtracontractual.reset()
        Swal.fire({
          titleText: respuesta.mensaje,
          text: "Estimado usuario si desea cargar otra póliza por favor de clic en el botón cargar nuevo o si no de clic en enviar",
          icon: "success",
          showCancelButton: true,
          allowOutsideClick: false,
          cancelButtonText: "Cargar nuevo",
          confirmButtonText: "Enviar",
        }).then((result) => {
          if (result.isConfirmed) {
            this.abrirModalCapacidad()
          } else if (result.isDismissed) {
            this.formContractual.reset()
            this.formExtracontractual.reset()
            this.fondoResponsabilidadC = false
            this.fondoResponsabilidadE = false
          }
        })
      },
      error: (error: HttpErrorResponse) => {
        if (error.error.estado == 400) {
          Swal.fire({
            icon: "error",
            titleText: error.error.mensaje,
          })
        }else if (error.status == 500) {
          Swal.fire({
            icon: "error",
            titleText: "¡Error interno del servidor!",
          })
        }else{
          Swal.fire({
            text: "No se ha recibido ninguna respuesta",
            icon: "question",
            titleText: "¡Lo sentimos!",
          })
        }
      }
    })
  }

  descargarArchivoXLSX(): any {
    this.servicioAdministrarPoliza.descargarCadenaBase64().subscribe({
      next: (respuesta) => { // Cadena base64 del archivo, que obtienes de tu API
        this.servicioAdministrarPoliza.descargarArchivoXLSX(respuesta, 'vehiculos.xlsx');
      }
    });
  }

  cargarArchivoXLSX(event: any, tipoPoliza: number) {
    if (tipoPoliza == 1) {
      const numeroPliza = this.formContractual.controls['numeroPolizaC'].value
      if (numeroPliza) {
        Swal.fire({
          icon: 'info',
          allowOutsideClick: false,
          text: 'Espere por favor...',
        });
        Swal.showLoading(null);

        const archivoSeleccionado = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.servicioAdministrarPoliza.cargarArchivoXLSX(archivoSeleccionado, numeroPliza).subscribe({
            next: (respuesta) => {
              this.archivoCargado = respuesta.mensaje
              Swal.close();
              //this.popup.abrirPopupExitoso(this.archivoCargado)
              Swal.fire({
                titleText: "¡Archivo cargado correctamente!",
                icon: "success"
              })
            },
            error: (error: HttpErrorResponse) => {
              this.archivoCargado = error.error.mensaje
              if (error.status == 415) {
                Swal.close();
                Swal.fire({
                  text: error.error.mensaje,
                  icon: "error"
                })
                this.formContractual.controls['cargarExcel'].setValue('')
              } else if (error.status == 422) {
                Swal.close();
                Swal.fire({
                  text: "Se han encontrado errores en el archivo, ¿Desea ver los errores?",
                  icon: "error",
                  showCancelButton: true,
                  allowOutsideClick: false,
                  confirmButtonText: "Descargar",
                  cancelButtonText: "Cancelar"
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.servicioAdministrarPoliza.descargarArchivoXLSX(error.error.archivo, 'Errores.xlsx')
                  }
                })
                this.formContractual.controls['cargarExcel'].setValue('')
              } else if(error.status == 500){
                Swal.close();
                Swal.fire({
                  text: error.error.mensaje,
                  icon: "error"
                })
                this.formContractual.controls['cargarExcel'].setValue('')
              }
              else{
                Swal.close();
                Swal.fire({
                  text: "Hubo un error de conexión, intentelo más tarde.",
                  icon: "error",
                  titleText: "¡Lo sentimos!",
                })
                this.formContractual.controls['cargarExcel'].setValue('')
              }
              //            
            }
          })
        }
        reader.readAsDataURL(archivoSeleccionado);
      } else {
        Swal.fire({
          text: "No has agregado un número de poliza",
          icon: "warning",
        })
        this.formContractual.controls['cargarExcel'].setValue('')
      }
    }
    else if (tipoPoliza == 2) {
      const numeroPliza = this.formExtracontractual.controls['numeroPolizaE'].value
      if (numeroPliza) {

        Swal.fire({
          icon: 'info',
          allowOutsideClick: false,
          text: 'Espere por favor...',
        });
        Swal.showLoading(null);

        const archivoSeleccionado = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.servicioAdministrarPoliza.cargarArchivoXLSX(archivoSeleccionado, numeroPliza).subscribe({
            next: (respuesta) => {
              this.archivoCargado = respuesta.mensaje
              Swal.close();
              this.popup.abrirPopupExitoso(this.archivoCargado)
            },
            error: (error: HttpErrorResponse) => {
              this.archivoCargado = error.error.mensaje
              if (error.status == 415) {
                Swal.fire({
                  text: error.error.mensaje,
                  icon: "error"
                })
                this.formExtracontractual.controls['cargarExcel'].setValue('')
              } else if (error.status == 422) {
                Swal.fire({
                  text: "Se han encontrado errores en el archivo, ¿Desea ver los errores?",
                  icon: "error",
                  showCancelButton: true,
                  allowOutsideClick: false,
                  confirmButtonText: "Descargar",
                  cancelButtonText: "Cancelar"
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.servicioAdministrarPoliza.descargarArchivoXLSX(error.error.archivo, 'Errores.xlsx')
                  }
                })
                this.formExtracontractual.controls['cargarExcel'].setValue('')
              }
              //Swal.close();
            }
          })
        };
        reader.readAsDataURL(archivoSeleccionado);
      } else {
        Swal.fire({
          text: "No has agregado un número de poliza",
          icon: "warning",
        })
        this.formExtracontractual.controls['cargarExcel'].setValue('')
      }
    }
  }

  cargarArchivoPDf(event: any, tipoPoliza: number) {
    const archivoSeleccionado = event.target.files[0];
    if (archivoSeleccionado) {
      Swal.fire({
        icon: 'info',
        allowOutsideClick: false,
        text: 'Espere por favor...',
      });
      Swal.showLoading(null);
      this.servicioAdministrarPoliza.cargarArchivoPDF(archivoSeleccionado).subscribe({
        next: (respuesta) => {
          Swal.fire({
            titleText: "¡Archivo cargado correctamente!",
            icon: "success"
          })
          this.archivoPDF = respuesta
          //this.popup.abrirPopupExitoso('¡Archivo cargado correctamente!')
        },
        error: (error: HttpErrorResponse) => {
          //console.log('Error: ',error.error)
          Swal.fire({
            text: "¡Lo sentimos! No hemos podido cargar el archivo",
            icon: "warning",
          })
          if (tipoPoliza == 1) {
            this.formContractual.controls['cargarPDF'].setValue('')
          } else if (tipoPoliza == 2) {
            this.formExtracontractual.controls['cargarPDF'].setValue('')
          }

        }
      })
    }
  }

  alternarDesplegarRCC() {
    this.desplegarRCC = !this.desplegarRCC
  }
  alternarDesplegarRCE() {
    this.desplegarRCE = !this.desplegarRCE
  }
  alternarDesplegarAB() {
    this.desplegarAmparosB = !this.desplegarAmparosB
  }
  alternarDesplegarAA() {
    this.desplegarAmparosA = !this.desplegarAmparosA
  }
  abrirModalCapacidad() {
    this.modalCapacidad.abrir()
  }

  DesplegarFondoResponsabilidad(tipoPoliza: number) {
    if (tipoPoliza == 1) {
      if (this.formContractual.controls['checkResponsabilidadC'].value) {
        this.fondoResponsabilidadC = this.formContractual.controls['checkResponsabilidadC'].value
        //this.formContractual.get('checkResponsabilidadC')?.disable()
        this.formContractual.get('fechaConstitucion')?.setValidators([Validators.required])
        this.formContractual.get('numeroResolucion')?.setValidators([Validators.required, maxLengthNumberValidator(20), negativoValidar()])
        this.formContractual.get('fechaResolucion')?.setValidators([Validators.required])
        this.formContractual.get('valorReserva')?.setValidators([Validators.required, maxLengthNumberValidator(4), negativoValidar()])
        this.formContractual.get('fechaCorteReserva')?.setValidators([Validators.required])
        this.formContractual.get('infoComplementaria')?.setValidators([Validators.required])
        this.formContractual.get('capas')?.setValidators([Validators.required, capasValidator()])
        this.formContractual.get('capa1')?.setValidators([Validators.required, maxLengthNumberValidator(4), negativoValidar()])
        this.formContractual.get('capa2')?.setValidators([Validators.required, maxLengthNumberValidator(4), negativoValidar()])
      } else {
        this.fondoResponsabilidadC = this.formContractual.controls['checkResponsabilidadC'].value
        this.formContractual.get('checkResponsabilidadE')?.setValue(false); this.formContractual.get('checkResponsabilidadE')?.updateValueAndValidity()
        this.formContractual.get('fechaConstitucion')?.clearValidators(); this.formContractual.get('fechaConstitucion')?.updateValueAndValidity()
        this.formContractual.get('numeroResolucion')?.clearValidators(); this.formContractual.get('numeroResolucion')?.updateValueAndValidity()
        this.formContractual.get('fechaResolucion')?.clearValidators(); this.formContractual.get('fechaResolucion')?.updateValueAndValidity()
        this.formContractual.get('valorReserva')?.clearValidators(); this.formContractual.get('valorReserva')?.updateValueAndValidity()
        this.formContractual.get('fechaCorteReserva')?.clearValidators(); this.formContractual.get('fechaCorteReserva')?.updateValueAndValidity()
        this.formContractual.get('infoComplementaria')?.clearValidators(); this.formContractual.get('infoComplementaria')?.updateValueAndValidity()
        this.formContractual.get('capas')?.clearValidators(); this.formContractual.get('capas')?.updateValueAndValidity()
        this.formContractual.get('capa1')?.clearValidators(); this.formContractual.get('capa1')?.updateValueAndValidity()
        this.formContractual.get('capa2')?.clearValidators(); this.formContractual.get('capa2')?.updateValueAndValidity()
        this.formContractual.get('fechaConstitucion')?.reset()
        this.formContractual.get('numeroResolucion')?.reset()
        this.formContractual.get('fechaResolucion')?.reset()
        this.formContractual.get('valorReserva')?.reset()
        this.formContractual.get('fechaCorteReserva')?.reset()
        this.formContractual.get('infoComplementaria')?.reset()
        this.formContractual.get('capas')?.reset()
        this.formContractual.get('capa1')?.reset()
        this.formContractual.get('capa2')?.reset()
      }
    } else if (tipoPoliza == 2) {
      if (this.formExtracontractual.controls['checkResponsabilidadE'].value) {
        this.fondoResponsabilidadE = this.formExtracontractual.controls['checkResponsabilidadE'].value
        //this.formExtracontractual.get('checkResponsabilidadE')?.disable()
        this.formExtracontractual.get('fechaConstitucion')?.setValidators([Validators.required])
        this.formExtracontractual.get('numeroResolucion')?.setValidators([Validators.required, maxLengthNumberValidator(20), negativoValidar()])
        this.formExtracontractual.get('fechaResolucion')?.setValidators([Validators.required])
        this.formExtracontractual.get('valorReserva')?.setValidators([Validators.required, maxLengthNumberValidator(4), negativoValidar()])
        this.formExtracontractual.get('fechaCorteReserva')?.setValidators([Validators.required])
        this.formExtracontractual.get('infoComplementaria')?.setValidators([Validators.required])
        this.formExtracontractual.get('capas')?.setValidators([Validators.required, capasValidator()])
        this.formExtracontractual.get('capa1')?.setValidators([Validators.required, maxLengthNumberValidator(4), negativoValidar()])
        this.formExtracontractual.get('capa2')?.setValidators([Validators.required, maxLengthNumberValidator(4), negativoValidar()])
      } else {
        this.fondoResponsabilidadE = this.formExtracontractual.controls['checkResponsabilidadE'].value
        //this.formExtracontractual.get('checkResponsabilidadE')?.disable()
        this.formExtracontractual.get('checkResponsabilidadE')?.setValue(false); this.formExtracontractual.get('checkResponsabilidadE')?.updateValueAndValidity()
        this.formExtracontractual.get('fechaConstitucion')?.clearValidators(); this.formExtracontractual.get('fechaConstitucion')?.updateValueAndValidity()
        this.formExtracontractual.get('numeroResolucion')?.clearValidators(); this.formExtracontractual.get('numeroResolucion')?.updateValueAndValidity()
        this.formExtracontractual.get('fechaResolucion')?.clearValidators(); this.formExtracontractual.get('fechaResolucion')?.updateValueAndValidity()
        this.formExtracontractual.get('valorReserva')?.clearValidators(); this.formExtracontractual.get('valorReserva')?.updateValueAndValidity()
        this.formExtracontractual.get('fechaCorteReserva')?.clearValidators(); this.formExtracontractual.get('fechaCorteReserva')?.updateValueAndValidity()
        this.formExtracontractual.get('infoComplementaria')?.clearValidators(); this.formExtracontractual.get('infoComplementaria')?.updateValueAndValidity()
        this.formExtracontractual.get('capas')?.clearValidators(); this.formExtracontractual.get('capas')?.updateValueAndValidity()
        this.formExtracontractual.get('capa1')?.clearValidators(); this.formExtracontractual.get('capa1')?.updateValueAndValidity()
        this.formExtracontractual.get('capa2')?.clearValidators(); this.formExtracontractual.get('capa2')?.updateValueAndValidity()
        this.formExtracontractual.get('fechaConstitucion')?.reset()
        this.formExtracontractual.get('numeroResolucion')?.reset()
        this.formExtracontractual.get('fechaResolucion')?.reset()
        this.formExtracontractual.get('valorReserva')?.reset()
        this.formExtracontractual.get('fechaCorteReserva')?.reset()
        this.formExtracontractual.get('infoComplementaria')?.reset()
        this.formExtracontractual.get('capas')?.reset()
        this.formExtracontractual.get('capa1')?.reset()
        this.formExtracontractual.get('capa2')?.reset()
      }
    }
  }

  numeroPolizaELleno() {
    if (this.formExtracontractual.controls['numeroPolizaE'].value) {
      this.obligatorio = true
      this.formExtracontractual.get('checkResponsabilidadE')?.enable()
      this.formExtracontractual.get('numeroPolizaE')?.setValidators([Validators.required, maxLengthNumberValidator(20), valorCeroValidar(), negativoValidar()]); this.formExtracontractual.get('numeroPolizaE')?.updateValueAndValidity()
      this.formExtracontractual.get('aseguradorasE')?.setValidators([Validators.required]); this.formExtracontractual.get('aseguradorasE')?.updateValueAndValidity()
      this.formExtracontractual.get('vigenciaPolizaInicioE')?.setValidators([Validators.required]); this.formExtracontractual.get('vigenciaPolizaInicioE')?.updateValueAndValidity()
      this.formExtracontractual.get('vigenciaPolizaFinalE')?.setValidators([Validators.required]); this.formExtracontractual.get('vigenciaPolizaFinalE')?.updateValueAndValidity()
      //------ Amparos basicos
      /* this.formExtracontractual.get('valorAseguradoAB9')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB9')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB9')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAB10')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB10')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB10')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAB11')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAB11')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB11')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAB11')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB11')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAB11')?.updateValueAndValidity()
       *///------- Amparos Adicionales
      /* this.formExtracontractual.get('valorAseguradoAA12')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAA12')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA12')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAA12')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA12')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAA12')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAA13')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAA13')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA13')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAA13')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA13')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAA13')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAA14')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAA14')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA14')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAA14')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA14')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAA14')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAA15')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAA15')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA15')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAA15')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA15')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAA15')?.updateValueAndValidity()
       *///------ Cargar Archivos
      this.formExtracontractual.get('cargarExcel')?.setValidators([Validators.required]); this.formExtracontractual.get('cargarExcel')?.updateValueAndValidity()
      this.formExtracontractual.get('cargarPDF')?.setValidators([Validators.required]); this.formExtracontractual.get('cargarPDF')?.updateValueAndValidity()
    } else {
      this.obligatorio = false
      this.formExtracontractual.get('checkResponsabilidadE')?.disable()

      this.formExtracontractual.get('numeroPolizaE')?.clearValidators(); this.formExtracontractual.get('numeroPolizaE')?.updateValueAndValidity()
      this.formExtracontractual.get('aseguradorasE')?.clearValidators(); this.formExtracontractual.get('aseguradorasE')?.updateValueAndValidity()
      this.formExtracontractual.get('vigenciaPolizaInicioE')?.clearValidators(); this.formExtracontractual.get('vigenciaPolizaInicioE')?.updateValueAndValidity()
      this.formExtracontractual.get('vigenciaPolizaFinalE')?.clearValidators(); this.formExtracontractual.get('vigenciaPolizaFinalE')?.updateValueAndValidity()
      //------ Amparos basicos
      /* this.formExtracontractual.get('valorAseguradoAB9')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB9')?.clearValidators(); this.formExtracontractual.get('limitesAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB9')?.clearValidators(); this.formExtracontractual.get('deducibleAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAB10')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB10')?.clearValidators(); this.formExtracontractual.get('limitesAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB10')?.clearValidators(); this.formExtracontractual.get('deducibleAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAB11')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAB11')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB11')?.clearValidators(); this.formExtracontractual.get('limitesAB11')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB11')?.clearValidators(); this.formExtracontractual.get('deducibleAB11')?.updateValueAndValidity()
       *///------- Amparos Adicionales
      /* this.formExtracontractual.get('valorAseguradoAA12')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAA12')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA12')?.clearValidators(); this.formExtracontractual.get('limitesAA12')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA12')?.clearValidators(); this.formExtracontractual.get('deducibleAA12')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAA13')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAA13')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA13')?.clearValidators(); this.formExtracontractual.get('limitesAA13')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA13')?.clearValidators(); this.formExtracontractual.get('deducibleAA13')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAA14')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAA14')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA14')?.clearValidators(); this.formExtracontractual.get('limitesAA14')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA14')?.clearValidators(); this.formExtracontractual.get('deducibleAA14')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAA15')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAA15')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA15')?.clearValidators(); this.formExtracontractual.get('limitesAA15')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA15')?.clearValidators(); this.formExtracontractual.get('deducibleAA15')?.updateValueAndValidity()
       *///------ Cargar Archivos
      this.formExtracontractual.get('cargarExcel')?.clearValidators(); this.formExtracontractual.get('cargarExcel')?.updateValueAndValidity()
      this.formExtracontractual.get('cargarPDF')?.clearValidators(); this.formExtracontractual.get('cargarPDF')?.updateValueAndValidity()

      this.formExtracontractual.controls['checkResponsabilidadE'].setValue(false); this.formExtracontractual.get('checkResponsabilidadE')?.updateValueAndValidity()
      this.DesplegarFondoResponsabilidad(2)
    }
  }

}
