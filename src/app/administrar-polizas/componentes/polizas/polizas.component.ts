import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Aseguradoras } from '../../modelos/aseguradoras';
import { ServicioAdministrarPolizas } from '../../servicios/administrar-polizas.service';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { HttpErrorResponse } from '@angular/common/http';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { CaratulaModel, GuardarPoliza, PolizaContractualModel, PolizaExtracontractualModel, PolizaJsonModel, ResponsabilidadModel } from '../../modelos/guardarPoliza';
import Swal from 'sweetalert2';
import { amparos } from '../../modelos/amparos';


@Component({
  selector: 'app-polizas',
  templateUrl: './polizas.component.html',
  styleUrls: ['./polizas.component.css']
})
export class PolizasComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent

  base64String!: string
  archivoCargado: string = ""
  archivoPDF?: ArchivoGuardado
  obligatorio: boolean = false

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
      numeroPolizaC: new FormControl<string | undefined>(undefined,[ Validators.required ]),
      aseguradorasC: new FormControl("",[ Validators.required ]),
      vigenciaPolizaInicioC: new FormControl(undefined,[ Validators.required ]),
      vigenciaPolizaFinalC: new FormControl(undefined,[ Validators.required ]),
      //----- Amparos basicos -----//
      valorAseguradoAB1: new FormControl(undefined,[ Validators.required ]),
      limitesAB1: new FormControl(undefined,[ Validators.required ]),
      deducibleAB1: new FormControl(undefined,[ Validators.required ]),
      //----- Amparos adicionales -----//
      valorAseguradoAA1: new FormControl(undefined,[ Validators.required ]),
      limitesAA1: new FormControl(undefined,[ Validators.required ]),
      deducibleAA1: new FormControl(undefined,[ Validators.required ]),
      //----- Cargue de archivos -----//
      cargarExcel: new FormControl(undefined,[ Validators.required ]),
      cargarPDF: new FormControl(undefined,[ Validators.required ]),
      //----- Responsabilidad -----//
      fechaConstitucion: new FormControl(undefined,[ Validators.required ]),
      numeroResolucion: new FormControl(undefined,[ Validators.required ]),
      fechaResolucion: new FormControl(undefined,[ Validators.required ]),
      valorReserva: new FormControl(undefined,[ Validators.required ]),
      fechaCorteReserva: new FormControl(undefined,[ Validators.required ]),
      infoComplementaria: new FormControl(undefined,[ Validators.required ]),
      capas: new FormControl(undefined,[ Validators.required ]),
      capa1: new FormControl(undefined,[ Validators.required ]),
      capa2: new FormControl(undefined,[ Validators.required ]),

      checkResponsabilidadC: new FormControl(false)
    })
    this.formContractual.get('checkResponsabilidadC')?.enable()

    this.formExtracontractual = new FormGroup({
      numeroPolizaE: new FormControl(undefined,[ Validators.required ]),
      aseguradorasE: new FormControl("",[ Validators.required ]),
      vigenciaPolizaInicioE: new FormControl(undefined,[ Validators.required ]),
      vigenciaPolizaFinalE: new FormControl(undefined,[ Validators.required ]),
      //----- Amparos basicos -----//
      valorAseguradoAB2: new FormControl(undefined,[ Validators.required ]),
      limitesAB2: new FormControl(undefined,[ Validators.required ]),
      deducibleAB2: new FormControl(undefined,[ Validators.required ]),
      //----- Amparos adicionales -----//
      valorAseguradoAA2: new FormControl(undefined,[ Validators.required ]),
      limitesAA2: new FormControl(undefined,[ Validators.required ]),
      deducibleAA2: new FormControl(undefined,[ Validators.required ]),
       //----- Cargue de archivos -----//
      cargarExcel: new FormControl(undefined,[ Validators.required ]),
      cargarPDF: new FormControl(undefined,[ Validators.required ]),
      //----- Responsabilidad -----//
      fechaConstitucion: new FormControl(undefined,[ Validators.required ]),
      numeroResolucion: new FormControl(undefined,[ Validators.required ]),
      fechaResolucion: new FormControl(undefined,[ Validators.required ]),
      valorReserva: new FormControl(undefined,[ Validators.required ]),
      fechaCorteReserva: new FormControl(undefined,[ Validators.required ]),
      infoComplementaria: new FormControl(undefined,[ Validators.required ]),
      capas: new FormControl(undefined,[ Validators.required ]),
      capa1: new FormControl(undefined,[ Validators.required ]),
      capa2: new FormControl(undefined,[ Validators.required ]),

      checkResponsabilidadE: new FormControl(false)
    })
    this.formExtracontractual.get('checkResponsabilidadE')?.disable()
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

  guardarPolizas(){
    if(this.formContractual.invalid){
      marcarFormularioComoSucio(this.formContractual)
      return;
    }
    
    const controlsC = this.formContractual.controls
    const controlsE = this.formExtracontractual.controls
    const polizaContractual:PolizaContractualModel = {
      numero: controlsC['numeroPolizaC'].value,
        aseguradoraId: controlsC['aseguradorasC'].value,
        inicioVigencia: controlsC['vigenciaPolizaInicioC'].value,
        finVigencia: controlsC['vigenciaPolizaFinalC'].value,
        amparos:[
          {
            coberturaId: '1',
            valorAsegurado: controlsC['valorAseguradoAB1'].value,
            limite: controlsC['limitesAB1'].value,
            deducible: controlsC['deducibleAB1'].value,
          },
          {
            coberturaId: '2',
            valorAsegurado: controlsC['valorAseguradoAB1'].value,
            limite: controlsC['limitesAB1'].value,
            deducible: controlsC['deducibleAB1'].value,
          },
          {
            coberturaId: '3',
            valorAsegurado: controlsC['valorAseguradoAB1'].value,
            limite: controlsC['limitesAB1'].value,
            deducible: controlsC['deducibleAB1'].value,
          },
          {
            coberturaId: '4',
            valorAsegurado: controlsC['valorAseguradoAB1'].value,
            limite: controlsC['limitesAB1'].value,
            deducible: controlsC['deducibleAB1'].value,
          },
          {
            coberturaId: '5',
            valorAsegurado: controlsC['valorAseguradoAA1'].value,
            limite: controlsC['limitesAA1'].value,
            deducible: controlsC['deducibleAA1'].value,
          },
          {
            coberturaId: '6',
            valorAsegurado: controlsC['valorAseguradoAA1'].value,
            limite: controlsC['limitesAA1'].value,
            deducible: controlsC['deducibleAA1'].value,
          },
          {
            coberturaId: '7',
            valorAsegurado: controlsC['valorAseguradoAA1'].value,
            limite: controlsC['limitesAA1'].value,
            deducible: controlsC['deducibleAA1'].value,
          },
          {
            coberturaId: '8',
            valorAsegurado: controlsC['valorAseguradoAA1'].value,
            limite: controlsC['limitesAA1'].value,
            deducible: controlsC['deducibleAA1'].value,
          }
        ]
    }
    const responsabilidadC:ResponsabilidadModel = {
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
        amparos:[
          {
            coberturaId: '9',
            valorAsegurado: controlsE['valorAseguradoAB2'].value,
            limite: controlsE['limitesAB2'].value,
            deducible: controlsE['deducibleAB2'].value,
          },
          {
            coberturaId: '10',
            valorAsegurado: controlsE['valorAseguradoAB2'].value,
            limite: controlsE['limitesAB2'].value,
            deducible: controlsE['deducibleAB2'].value,
          },
          {
            coberturaId: '11',
            valorAsegurado: controlsE['valorAseguradoAB2'].value,
            limite: controlsE['limitesAB2'].value,
            deducible: controlsE['deducibleAB2'].value,
          },
          {
            coberturaId: '12',
            valorAsegurado: controlsE['valorAseguradoAA2'].value,
            limite: controlsE['limitesAA2'].value,
            deducible: controlsE['deducibleAA2'].value,
          },
          {
            coberturaId: '13',
            valorAsegurado: controlsE['valorAseguradoAA2'].value,
            limite: controlsE['limitesAA2'].value,
            deducible: controlsE['deducibleAA2'].value,
          },
          {
            coberturaId: '14',
            valorAsegurado: controlsE['valorAseguradoAA2'].value,
            limite: controlsE['limitesAA2'].value,
            deducible: controlsE['deducibleAA2'].value,
          },
          {
            coberturaId: '15',
            valorAsegurado: controlsE['valorAseguradoAA2'].value,
            limite: controlsE['limitesAA2'].value,
            deducible: controlsE['deducibleAA2'].value,
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
    if(this.formContractual.get('checkResponsabilidadC')?.value == true){ //corrobora si tiene o no responsabilidad
      polizaContractual.responsabilidad = responsabilidadC
    }

    polizaExtracontractual.caratula = caratulaE //Añade la caratula correspondiente a la poliza extracontractual
    if(this.formExtracontractual.get('checkResponsabilidadE')?.value == true){ //corrobora si tiene o no responsabilidad
      polizaExtracontractual.responsabilidad = responsabilidadE
    }

    const polizaJson:any = {
      polizaContractual: polizaContractual,
    };
    
    if(this.formExtracontractual.controls['numeroPolizaE'].value && this.formExtracontractual.controls['numeroPolizaE'].value != ""){
      if(this.formExtracontractual.invalid){
        marcarFormularioComoSucio(this.formExtracontractual)
        return;
      }
      polizaJson.polizaExtracontractual = polizaExtracontractual
    }

    this.servicioAdministrarPoliza.guardarPoliza(polizaJson).subscribe({
      next: (respuesta) => {
        console.log(respuesta)
        if(respuesta){
          Swal.fire({
            titleText: respuesta.mensaje,
            text: "Estimado usuario si desea cargar otra póliza por favor de clic en el botón cargar nuevo o si no de clic en enviar",
            icon: "success",
            showCancelButton: true,
            allowOutsideClick: false,
            cancelButtonText: "Cargar nuevo",
            confirmButtonText: "Enviar",
          }).then((result) =>{
            if(result.isConfirmed){

            }else if(result.isDismissed){
              this.formContractual.reset()
              this.formExtracontractual.reset()
            }
          })
        }else{
          Swal.fire({
            text: "No se ha recibido ninguna respuesta",
            icon: "question",
            titleText: "¡Lo sentimos!",
            showCancelButton: true,
            allowOutsideClick: false,
            cancelButtonText: "Cargar nuevo",
            confirmButtonText: "Enviar",
          }).then((result) =>{
            if(result.isConfirmed){
              
            }else if(result.isDismissed){
              this.formContractual.reset()
              this.formExtracontractual.reset()
            }
          })
        }
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
              this.formExtracontractual.controls['cargarExcel'].setValue('')
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
              this.formExtracontractual.controls['cargarExcel'].setValue('')
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
    this.formContractual.get('checkResponsabilidadC')?.disable()
    this.formExtracontractual.get('checkResponsabilidadE')?.disable()
    
    if(tipoPoliza == 1){
      this.fondoResponsabilidadC = estado
    }else if(tipoPoliza == 2){
      this.fondoResponsabilidadE = estado
    }
  }
  
  numeroPolizaELleno(){
    if(this.formExtracontractual.controls['numeroPolizaE'].value){
      this.obligatorio = true
      this.formExtracontractual.get('checkResponsabilidadE')?.enable()
    }else{
      this.obligatorio = false
      this.formExtracontractual.get('checkResponsabilidadE')?.disable()
    }
  }
  
}
