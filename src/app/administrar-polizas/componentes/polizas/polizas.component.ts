import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Aseguradoras } from '../../modelos/aseguradoras';
import { ServicioAdministrarPolizas } from '../../servicios/administrar-polizas.service';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { HttpErrorResponse } from '@angular/common/http';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { GuardarPoliza } from '../../modelos/guardarPoliza';
import Swal from 'sweetalert2';
import { amparos } from '../../modelos/amparos';


@Component({
  selector: 'app-polizas',
  templateUrl: './polizas.component.html',
  styleUrls: ['./polizas.component.css']
})
export class PolizasComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent

  guardarPoliza?: GuardarPoliza
  base64String!: string
  archivoCargado: string = ""
  archivoPDF?: ArchivoGuardado
  coberturaId1: number = 0
  coberturaId2: number = 0
  coberturaId3: number = 0
  coberturaId4: number = 0

  desplegarRCC: boolean = true
  desplegarRCE: boolean = true
  desplegarAmparosB: boolean = true
  desplegarAmparosA: boolean = true
  fondoResponsabilidadC: boolean = false
  fondoResponsabilidadE: boolean = false

  aseguradoras: Aseguradoras[] = []

  amparosBasicosC: amparos[] = [
    {nombre:'Muerte Accidental', id:'1'},
    {nombre:'Incapacidad Temporal', id:'2'},
    {nombre:'Incapacidad Permanente', id:'3'},
    {nombre:'Gastos Médicos Hospitalarios', id:'4'}
  ]
  amparosBasicosE: amparos[] = [
    {nombre:'Daños a bienes de terceros', id:'5'},
    {nombre:'Lesiones o Muerte a 1 persona', id:'6'},
    {nombre:'Lesiones o Muerte a 2 o mas personas', id:'7'}
  ]
  amparosAdicionales: amparos[] = [
    {nombre:'Amparo patrimonial', id:'8'},
    {nombre:'Asistencia Juridica en proceso penal y civil', id:'9'},
    {nombre:'Perjuicios patrimoniales y extrapatrimoniales', id:'10'},
    {nombre:'Otras', id:'11'}
  ]

  formContractual: FormGroup;
  formExtracontractual: FormGroup;

  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
  ){
    this.formContractual = new FormGroup({
      numeroPolizaC: new FormControl(undefined,[ Validators.required ]),
      aseguradorasC: new FormControl("",[ Validators.required ]),
      vigenciaPolizaInicioC: new FormControl(undefined,[ Validators.required ]),
      vigenciaPolizaFinalC: new FormControl(undefined,[ Validators.required ]),
      //----- Amparos basicos -----//
      valorAseguradoAB1: new FormControl(undefined),
      limitesAB1: new FormControl(undefined),
      deducibleAB1: new FormControl(undefined),
      //----- Amparos adicionales -----//
      valorAseguradoAA1: new FormControl(undefined),
      limitesAA1: new FormControl(undefined),
      deducibleAA1: new FormControl(undefined),
      //----- Cargue de archivos -----//
      cargarExcel: new FormControl(undefined),
      cargarPDF: new FormControl(undefined),
      //----- Responsabilidad -----//
      fechaConstitucion: new FormControl(undefined),
      numeroResolucion: new FormControl(undefined),
      fechaResolucion: new FormControl(undefined),
      valorReserva: new FormControl(undefined),
      fechaCorteReserva: new FormControl(undefined),
      infoComplementaria: new FormControl(undefined),
      capas: new FormControl(undefined),
      capa1: new FormControl(undefined),
      capa2: new FormControl(undefined)
    })

    this.formExtracontractual = new FormGroup({
      numeroPolizaE: new FormControl(undefined, [ Validators.required ]),
      aseguradorasE: new FormControl("",[ Validators.required ]),
      vigenciaPolizaInicioE: new FormControl(undefined,[ Validators.required ]),
      vigenciaPolizaFinalE: new FormControl(undefined,[ Validators.required ]),
      //----- Amparos basicos -----//
      valorAseguradoAB2: new FormControl(undefined),
      limitesAB2: new FormControl(undefined),
      deducibleAB2: new FormControl(undefined),
      //----- Amparos adicionales -----//
      valorAseguradoAA2: new FormControl(undefined),
      limitesAA2: new FormControl(undefined),
      deducibleAA2: new FormControl(undefined),
      //----- Cargue de archivos -----//
      cargarExcel: new FormControl(undefined),
      cargarPDF: new FormControl(undefined),
      //----- Responsabilidad -----//
      fechaConstitucion: new FormControl(undefined),
      numeroResolucion: new FormControl(undefined),
      fechaResolucion: new FormControl(undefined),
      valorReserva: new FormControl(undefined),
      fechaCorteReserva: new FormControl(undefined),
      infoComplementaria: new FormControl(undefined),
      capas: new FormControl(undefined),
      capa1: new FormControl(undefined),
      capa2: new FormControl(undefined)
    })
  }

  ngOnInit(): void {
    this.obtenerAseguradora()
    this.formContractual.controls['aseguradorasC'].valueChanges.subscribe({
      next: (idAseguradora) =>{
        console.log(this.formContractual.controls['aseguradorasC'].value)
        if(idAseguradora && idAseguradora !== null){
          console.log(idAseguradora)
        }
      }
    })
  }

  obtenerAseguradora(){
    this.servicioAdministrarPoliza.obtenerAseguradora().subscribe({
      next: (aseguradora: any) =>{
        this.aseguradoras = aseguradora['aseguradoras']
      }
    })
  }

  validacionExtra(){
    if(this.formExtracontractual.controls['numeroPolizaE'].value){
      return `[Validators.required]`
    }else{
      return
    }
  }

  guardarPolizas(){
    if(this.formContractual.invalid && this.formExtracontractual.invalid){
      //console.log("aqui llega")
      marcarFormularioComoSucio(this.formContractual)
      marcarFormularioComoSucio(this.formExtracontractual)
      return;
    }
    const controlsC = this.formContractual.controls
    const controlsE = this.formExtracontractual.controls

    this.servicioAdministrarPoliza.guardarPoliza({
      polizaContractual: {
        numero: controlsC['numeroPolizaC'].value,
        aseguradoraId: controlsC['aseguradorasC'].value,
        inicioVigencia: controlsC['vigenciaPolizaInicioC'].value,
        finVigencia: controlsC['vigenciaPolizaFinalC'].value,
        amparos:[
          {
            coberturaId: this.amparosBasicosC[this.coberturaId1++].id,
            valorAsegurado: controlsC['valorAseguradoAB1'].value,
            limite: controlsC['limitesAB1'].value,
            deducible: controlsC['deducibleAB1'].value,
          },
          {
            coberturaId: this.amparosAdicionales[this.coberturaId2++].id,
            valorAsegurado: controlsC['valorAseguradoAA1'].value,
            limite: controlsC['limitesAA1'].value,
            deducible: controlsC['deducibleAA1'].value,
          }
        ],
        responsabilidad:{
          fechaConstitucion: controlsC['fechaConstitucion'].value,
          resolucion: controlsC['numeroResolucion'].value,
          fechaResolucion: controlsC['fechaResolucion'].value,
          valorReserva: controlsC['valorReserva'].value,
          fechaReserva: controlsC['fechaCorteReserva'].value,
          informacion: controlsC['infoComplementaria'].value,
          operacion: controlsC['capas'].value,
          valorCumplimientoUno: controlsC['capa1'].value,
          valorCumplimientoDos: controlsC['capa2'].value,
        },
        caratula:{
          nombre: this.archivoPDF?.nombreAlmacenado,
          nombreOriginal: this.archivoPDF?.nombreOriginalArchivo,
          ruta: this.archivoPDF?.ruta
        }
      },
      polizaExtracontractual:{
        numero: controlsE['numeroPolizaE'].value,
        aseguradoraId: controlsE['aseguradorasE'].value,
        inicioVigencia: controlsE['vigenciaPolizaInicioE'].value,
        finVigencia: controlsE['vigenciaPolizaFinalE'].value,
        amparos:[
          {
            coberturaId: this.amparosBasicosE[this.coberturaId3++].id,
            valorAsegurado: controlsE['valorAseguradoAB2'].value,
            limite: controlsE['limitesAB2'].value,
            deducible: controlsE['deducibleAB2'].value,
          },
          {
            coberturaId: this.amparosAdicionales[this.coberturaId4++].id,
            valorAsegurado: controlsE['valorAseguradoAA2'].value,
            limite: controlsE['limitesAA2'].value,
            deducible: controlsE['deducibleAA2'].value,
          }
        ],
        responsabilidad:{
          fechaConstitucion: controlsE['fechaConstitucion'].value,
          resolucion: controlsE['numeroResolucion'].value,
          fechaResolucion: controlsE['fechaResolucion'].value,
          valorReserva: controlsE['valorReserva'].value,
          fechaReserva: controlsE['fechaCorteReserva'].value,
          informacion: controlsE['infoComplementaria'].value,
          operacion: controlsE['capas'].value,
          valorCumplimientoUno: controlsE['capa1'].value,
          valorCumplimientoDos: controlsE['capa2'].value,
        },
        caratula:{
          nombre: this.archivoPDF?.nombreAlmacenado,
          nombreOriginal: this.archivoPDF?.nombreOriginalArchivo,
          ruta: this.archivoPDF?.ruta
        }
      }
    }).subscribe({
      next: (respuesta) => {
        console.log(respuesta.mensaje)
        Swal.fire({
          text: respuesta.mensaje,
          icon: "success",

        })
      }
    })
  }

  descargarArchivoXLSX(): any{
    this.servicioAdministrarPoliza.descargarCadenaBase64().subscribe({
      next: (respuesta) => { // Cadena base64 del archivo, que obtienes de tu API
        this.servicioAdministrarPoliza.descargarArchivoXLSX(respuesta, 'vehiculos.xlsx');
      }
    });
  }

  cargarArchivoXLSX(event: any, tipoPoliza: number){
    if(tipoPoliza == 1){
      const numeroPliza = this.formContractual.controls['numeroPolizaC'].value
      if(numeroPliza){
        const archivoSeleccionado = event.target.files[0];
        this.servicioAdministrarPoliza.cargarArchivoXLSX(archivoSeleccionado,numeroPliza).subscribe({
          next: (respuesta) =>{
            this.archivoCargado = respuesta.mensaje
            this.popup.abrirPopupExitoso(this.archivoCargado)
          },
          error: (error: HttpErrorResponse) =>{
            this.archivoCargado = error.error.mensaje
            if(error.status == 415){
              Swal.fire({
                text:error.error.mensaje,
                icon:"error"
              })
              this.formContractual.controls['cargarExcel'].setValue('')
            }else if(error.status == 422){
              Swal.fire({
                text: "Se han encontrado errores en el archivo, ¿Desea ver los errores?",
                icon:"error",
                showCancelButton: true,
                allowOutsideClick: false,
                confirmButtonText: "Descargar",
                cancelButtonText:"Cancelar"
              }).then((result) =>{
                if(result.isConfirmed){
                  this.servicioAdministrarPoliza.descargarArchivoXLSX(error.error.archivo, 'Errores.xlsx')
                }
              })
              this.formContractual.controls['cargarExcel'].setValue('')
            }            
          }
        })
      }else{
        Swal.fire({
          text: "No has agregado un número de poliza",
          icon: "warning",
        })
        this.formContractual.controls['cargarExcel'].setValue('')
      }
    }
    else if(tipoPoliza == 2){
      const numeroPliza = this.formExtracontractual.controls['numeroPolizaE'].value
      if(numeroPliza){
        const archivoSeleccionado = event.target.files[0];
        this.servicioAdministrarPoliza.cargarArchivoXLSX(archivoSeleccionado,numeroPliza).subscribe({
          next: (respuesta) =>{
            this.archivoCargado = respuesta.mensaje
            this.popup.abrirPopupExitoso(this.archivoCargado)
          },
          error: (error: HttpErrorResponse) =>{
            this.archivoCargado = error.error.mensaje
            if(error.status == 415){
              Swal.fire({
                text:error.error.mensaje,
                icon:"error"
              })
              this.formContractual.controls['cargarExcel'].setValue('')
            }else if(error.status == 422){
              Swal.fire({
                text: "Se han encontrado errores en el archivo, ¿Desea ver los errores?",
                icon:"error",
                showCancelButton: true,
                allowOutsideClick: false,
                confirmButtonText: "Descargar",
                cancelButtonText:"Cancelar"
              }).then((result) =>{
                if(result.isConfirmed){
                  this.servicioAdministrarPoliza.descargarArchivoXLSX(error.error.archivo, 'Errores.xlsx')
                }
              })
              this.formContractual.controls['cargarExcel'].setValue('')
            }
          }
        })
      }else{
        Swal.fire({
          text: "No has agregado un número de poliza",
          icon: "warning",
        })
        this.formExtracontractual.controls['cargarExcel'].setValue('')
      }
    }
  }

  cargarArchivoPDf(event: any, tipoPoliza: number){
    const archivoSeleccionado = event.target.files[0];
    if (archivoSeleccionado) {
      this.servicioAdministrarPoliza.cargarArchivoPDF(archivoSeleccionado).subscribe({
        next: (respuesta) =>{
          this.archivoPDF = respuesta
          Swal.fire({
            text: "Has cargado el archivo '"+this.archivoPDF.nombreOriginalArchivo+"' correctamente",
            icon: "success",
          })
        },
        error: (error: HttpErrorResponse) =>{
          console.log('Error: ',error.error.mensaje)
          Swal.fire({
            text: "¡Lo sentimos! No hemos podido cargar el archivo",
            icon: "warning",
          })
          if(tipoPoliza == 1){
            this.formContractual.controls['cargarPDF'].setValue('')
          }else if(tipoPoliza == 2){
            this.formExtracontractual.controls['cargarPDF'].setValue('')
          }
          
        }
      })
    }
  }

  alternarDesplegarRCC(){
    this.desplegarRCC = !this.desplegarRCC
  }
  alternarDesplegarRCE(){
    this.desplegarRCE = !this.desplegarRCE
  }
  alternarDesplegarAB(){
    this.desplegarAmparosB = !this.desplegarAmparosB
  }
  alternarDesplegarAA(){
    this.desplegarAmparosA = !this.desplegarAmparosA
  }

  DesplegarFondoResponsabilidad(estado: boolean, tipoPoliza: number){
    if(tipoPoliza == 1){
      this.fondoResponsabilidadC = estado
    }else if(tipoPoliza == 2){
      this.fondoResponsabilidadE = estado
    }
  }

  
}
