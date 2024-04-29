import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Aseguradoras } from '../../modelos/aseguradoras';
import { ServicioAdministrarPolizas } from '../../servicios/administrar-polizas.service';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { HttpErrorResponse } from '@angular/common/http';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { CaratulaModel, PolizaContractualModel, PolizaExtracontractualModel, ResponsabilidadModel } from '../../modelos/guardarPoliza';
import Swal from 'sweetalert2';
import { amparos } from '../../modelos/amparos';
import { ModalCapacidadComponent } from './modal/modal-capacidad/modal-capacidad.component';


@Component({
  selector: 'app-polizas',
  templateUrl: './polizas.component.html',
  styleUrls: ['./polizas.component.css']
})
export class PolizasComponent implements OnInit{
  @ViewChild('modalCapacidad') modalCapacidad!: ModalCapacidadComponent
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
    //-- Formulario Responsabilidad contractual
    this.formContractual = new FormGroup({
      numeroPolizaC: new FormControl(undefined,[ Validators.required ]),
      aseguradorasC: new FormControl("",[ Validators.required ]),
      vigenciaPolizaInicioC: new FormControl(undefined,[ Validators.required ]),
      vigenciaPolizaFinalC: new FormControl(undefined,[ Validators.required ]),
      //----- Amparos basicos -----//
      valorAseguradoAB1: new FormControl(undefined,[ Validators.required ]),
      limitesAB1: new FormControl(undefined,[ Validators.required ]),
      deducibleAB1: new FormControl(undefined,[ Validators.required ]),
      valorAseguradoAB2: new FormControl(undefined,[ Validators.required ]),
      limitesAB2: new FormControl(undefined,[ Validators.required ]),
      deducibleAB2: new FormControl(undefined,[ Validators.required ]),
      valorAseguradoAB3: new FormControl(undefined,[ Validators.required ]),
      limitesAB3: new FormControl(undefined,[ Validators.required ]),
      deducibleAB3: new FormControl(undefined,[ Validators.required ]),
      valorAseguradoAB4: new FormControl(undefined,[ Validators.required ]),
      limitesAB4: new FormControl(undefined,[ Validators.required ]),
      deducibleAB4: new FormControl(undefined,[ Validators.required ]),
      //----- Amparos adicionales -----//
      valorAseguradoAA5: new FormControl(undefined,[ Validators.required ]),
      limitesAA5: new FormControl(undefined,[ Validators.required ]),
      deducibleAA5: new FormControl(undefined,[ Validators.required ]),
      valorAseguradoAA6: new FormControl(undefined,[ Validators.required ]),
      limitesAA6: new FormControl(undefined,[ Validators.required ]),
      deducibleAA6: new FormControl(undefined,[ Validators.required ]),
      valorAseguradoAA7: new FormControl(undefined,[ Validators.required ]),
      limitesAA7: new FormControl(undefined,[ Validators.required ]),
      deducibleAA7: new FormControl(undefined,[ Validators.required ]),
      valorAseguradoAA8: new FormControl(undefined,[ Validators.required ]),
      limitesAA8: new FormControl(undefined,[ Validators.required ]),
      deducibleAA8: new FormControl(undefined,[ Validators.required ]),
      //----- Cargue de archivos -----//
      cargarExcel: new FormControl(undefined,[ Validators.required ]),
      cargarPDF: new FormControl(undefined,[ Validators.required ]),
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
      numeroPolizaE: new FormControl(undefined,),
      aseguradorasE: new FormControl("",),
      vigenciaPolizaInicioE: new FormControl(undefined,),
      vigenciaPolizaFinalE: new FormControl(undefined,),
      //----- Amparos basicos -----//
      valorAseguradoAB9: new FormControl(undefined,),
      limitesAB9: new FormControl(undefined,),
      deducibleAB9: new FormControl(undefined,),
      valorAseguradoAB10: new FormControl(undefined,),
      limitesAB10: new FormControl(undefined,),
      deducibleAB10: new FormControl(undefined,),
      valorAseguradoAB11: new FormControl(undefined,),
      limitesAB11: new FormControl(undefined,),
      deducibleAB11: new FormControl(undefined,),
      //----- Amparos adicionales -----//
      valorAseguradoAA12: new FormControl(undefined,),
      limitesAA12: new FormControl(undefined,),
      deducibleAA12: new FormControl(undefined,),
      valorAseguradoAA13: new FormControl(undefined,),
      limitesAA13: new FormControl(undefined,),
      deducibleAA13: new FormControl(undefined,),
      valorAseguradoAA14: new FormControl(undefined,),
      limitesAA14: new FormControl(undefined,),
      deducibleAA14: new FormControl(undefined,),
      valorAseguradoAA15: new FormControl(undefined,),
      limitesAA15: new FormControl(undefined,),
      deducibleAA15: new FormControl(undefined,),
       //----- Cargue de archivos -----//
      cargarExcel: new FormControl(undefined,),
      cargarPDF: new FormControl(undefined,),
      //----- Responsabilidad -----//
      checkResponsabilidadE: new FormControl(false),
      fechaConstitucion: new FormControl(undefined,),
      numeroResolucion: new FormControl(undefined,),
      fechaResolucion: new FormControl(undefined,),
      valorReserva: new FormControl(undefined,),
      fechaCorteReserva: new FormControl(undefined,),
      infoComplementaria: new FormControl(undefined,),
      capas: new FormControl(undefined,),
      capa1: new FormControl(undefined,),
      capa2: new FormControl(undefined,)
    })
    this.formExtracontractual.get('checkResponsabilidadE')?.disable()
  }

  ngOnInit(): void {
    this.obtenerAseguradora()
  }

  obtenerAseguradora(){
    this.servicioAdministrarPoliza.obtenerAseguradora().subscribe({
      next: (aseguradora: any) =>{
        this.aseguradoras = aseguradora['aseguradoras']
      }
    })
  }

  guardarPolizas(){
    console.log(this.formContractual);
    
    if(this.formContractual.invalid){//Valida formulario contarctual (Esté lleno)
      marcarFormularioComoSucio(this.formContractual)
      Swal.fire({
        text: "Hay datos obligatorios en Responsabilidad contractual sin llenar",
        icon: "error",
        titleText: "¡No se ha realizado el guardado de la póliza!",
      })
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
    
    //Valida formulario extracontarctual sea valido (Esté lleno) si y solo si se ha escrito el numero de poliza
    if(this.formExtracontractual.controls['numeroPolizaE'].value && this.formExtracontractual.controls['numeroPolizaE'].value != ""){
      if(this.formExtracontractual.invalid){
        marcarFormularioComoSucio(this.formExtracontractual)
        Swal.fire({
          text: "Hay datos obligatorios en Responsabilidad extracontractual sin llenar",
          icon: "error",
          titleText: "¡No se ha realizado el guardado de la póliza!",
        })
        return;
      }
      polizaJson.polizaExtracontractual = polizaExtracontractual
    }

    this.servicioAdministrarPoliza.guardarPoliza(polizaJson).subscribe({
      next: (respuesta) => {
        //console.log(respuesta)
        if(respuesta){
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
          }).then((result) =>{
            if(result.isConfirmed){
              this.abrirModalCapacidad()
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
          this.popup.abrirPopupExitoso('¡Archivo cargado correctamente!')
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
  abrirModalCapacidad(){
    this.modalCapacidad.abrir()
  }

  DesplegarFondoResponsabilidad(estado: boolean, tipoPoliza: number){
    if(tipoPoliza == 1){
      this.fondoResponsabilidadC = estado
      if(this.fondoResponsabilidadC == true){
        this.formContractual.get('checkResponsabilidadC')?.disable()
        this.formContractual.get('fechaConstitucion')?.setValidators([ Validators.required ])
        this.formContractual.get('numeroResolucion')?.setValidators([ Validators.required ])
        this.formContractual.get('fechaResolucion')?.setValidators([ Validators.required ])
        this.formContractual.get('valorReserva')?.setValidators([ Validators.required ])
        this.formContractual.get('fechaCorteReserva')?.setValidators([ Validators.required ])
        this.formContractual.get('infoComplementaria')?.setValidators([ Validators.required ])
        this.formContractual.get('capas')?.setValidators([ Validators.required ])
        this.formContractual.get('capa1')?.setValidators([ Validators.required ])
        this.formContractual.get('capa2')?.setValidators([ Validators.required ])
      }
    }else if(tipoPoliza == 2){
      this.fondoResponsabilidadE = estado
      if(this.fondoResponsabilidadE == true){
        this.formExtracontractual.get('checkResponsabilidadE')?.disable()
        this.formExtracontractual.get('fechaConstitucion')?.setValidators([ Validators.required ])
        this.formExtracontractual.get('numeroResolucion')?.setValidators([ Validators.required ])
        this.formExtracontractual.get('fechaResolucion')?.setValidators([ Validators.required ])
        this.formExtracontractual.get('valorReserva')?.setValidators([ Validators.required ])
        this.formExtracontractual.get('fechaCorteReserva')?.setValidators([ Validators.required ])
        this.formExtracontractual.get('infoComplementaria')?.setValidators([ Validators.required ])
        this.formExtracontractual.get('capas')?.setValidators([ Validators.required ])
        this.formExtracontractual.get('capa1')?.setValidators([ Validators.required ])
        this.formExtracontractual.get('capa2')?.setValidators([ Validators.required ])
      }else{
        this.formExtracontractual.get('checkResponsabilidadE')?.disable()
        this.formExtracontractual.get('checkResponsabilidadE')?.setValue(false);this.formExtracontractual.get('checkResponsabilidadE')?.updateValueAndValidity()
        this.formExtracontractual.get('fechaConstitucion')?.clearValidators();this.formExtracontractual.get('fechaConstitucion')?.updateValueAndValidity()
        this.formExtracontractual.get('numeroResolucion')?.clearValidators();this.formExtracontractual.get('numeroResolucion')?.updateValueAndValidity()
        this.formExtracontractual.get('fechaResolucion')?.clearValidators();this.formExtracontractual.get('fechaResolucion')?.updateValueAndValidity()
        this.formExtracontractual.get('valorReserva')?.clearValidators();this.formExtracontractual.get('valorReserva')?.updateValueAndValidity()
        this.formExtracontractual.get('fechaCorteReserva')?.clearValidators();this.formExtracontractual.get('fechaCorteReserva')?.updateValueAndValidity()
        this.formExtracontractual.get('infoComplementaria')?.clearValidators();this.formExtracontractual.get('infoComplementaria')?.updateValueAndValidity()
        this.formExtracontractual.get('capas')?.clearValidators();this.formExtracontractual.get('capas')?.updateValueAndValidity()
        this.formExtracontractual.get('capa1')?.clearValidators();this.formExtracontractual.get('capa1')?.updateValueAndValidity()
        this.formExtracontractual.get('capa2')?.clearValidators();this.formExtracontractual.get('capa2')?.updateValueAndValidity()
      }
    }
  }
  
  numeroPolizaELleno(){
    if(this.formExtracontractual.controls['numeroPolizaE'].value){
      this.obligatorio = true
      this.formExtracontractual.get('checkResponsabilidadE')?.enable()
      this.formExtracontractual.get('numeroPolizaE')?.setValidators([ Validators.required ]); this.formExtracontractual.get('numeroPolizaE')?.updateValueAndValidity()
      this.formExtracontractual.get('aseguradorasE')?.setValidators([ Validators.required ]); this.formExtracontractual.get('aseguradorasE')?.updateValueAndValidity()
      this.formExtracontractual.get('vigenciaPolizaInicioE')?.setValidators([ Validators.required ]); this.formExtracontractual.get('vigenciaPolizaInicioE')?.updateValueAndValidity()
      this.formExtracontractual.get('vigenciaPolizaFinalE')?.setValidators([ Validators.required ]); this.formExtracontractual.get('vigenciaPolizaFinalE')?.updateValueAndValidity()
      //------ Amparos basicos
      this.formExtracontractual.get('valorAseguradoAB9')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB9')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB9')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAB10')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB10')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB10')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAB11')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAB11')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB11')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAB11')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB11')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAB11')?.updateValueAndValidity()
      //------- Amparos Adicionales
      this.formExtracontractual.get('valorAseguradoAA12')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAA12')?.updateValueAndValidity()
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
      //------ Cargar Archivos
      this.formExtracontractual.get('cargarExcel')?.setValidators([ Validators.required ]);this.formExtracontractual.get('cargarExcel')?.updateValueAndValidity()
      this.formExtracontractual.get('cargarPDF')?.setValidators([ Validators.required ]);this.formExtracontractual.get('cargarPDF')?.updateValueAndValidity()
    }else{
      this.obligatorio = false
      this.formExtracontractual.get('checkResponsabilidadE')?.disable()

      this.formExtracontractual.get('numeroPolizaE')?.clearValidators(); this.formExtracontractual.get('numeroPolizaE')?.updateValueAndValidity()
      this.formExtracontractual.get('aseguradorasE')?.clearValidators(); this.formExtracontractual.get('aseguradorasE')?.updateValueAndValidity()
      this.formExtracontractual.get('vigenciaPolizaInicioE')?.clearValidators(); this.formExtracontractual.get('vigenciaPolizaInicioE')?.updateValueAndValidity()
      this.formExtracontractual.get('vigenciaPolizaFinalE')?.clearValidators(); this.formExtracontractual.get('vigenciaPolizaFinalE')?.updateValueAndValidity()
      //------ Amparos basicos
      this.formExtracontractual.get('valorAseguradoAB9')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB9')?.clearValidators(); this.formExtracontractual.get('limitesAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB9')?.clearValidators(); this.formExtracontractual.get('deducibleAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAB10')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB10')?.clearValidators(); this.formExtracontractual.get('limitesAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB10')?.clearValidators(); this.formExtracontractual.get('deducibleAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAB11')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAB11')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB11')?.clearValidators(); this.formExtracontractual.get('limitesAB11')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB11')?.clearValidators(); this.formExtracontractual.get('deducibleAB11')?.updateValueAndValidity()
      //------- Amparos Adicionales
      this.formExtracontractual.get('valorAseguradoAA12')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAA12')?.updateValueAndValidity()
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
      //------ Cargar Archivos
      this.formExtracontractual.get('cargarExcel')?.clearValidators();this.formExtracontractual.get('cargarExcel')?.updateValueAndValidity()
      this.formExtracontractual.get('cargarPDF')?.clearValidators();this.formExtracontractual.get('cargarPDF')?.updateValueAndValidity()

      this.DesplegarFondoResponsabilidad(false,2)
    }
  }
  
}
