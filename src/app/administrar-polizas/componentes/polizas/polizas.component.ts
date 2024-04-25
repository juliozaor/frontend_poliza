import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Aseguradoras } from '../../modelos/aseguradoras';
import { ServicioAdministrarPolizas } from '../../servicios/administrar-polizas.service';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-polizas',
  templateUrl: './polizas.component.html',
  styleUrls: ['./polizas.component.css']
})
export class PolizasComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent

  archivoExcel:any
  base64String!: string
  archivoCargado: string = ""

  desplegarRCC: boolean = true
  desplegarRCE: boolean = true
  desplegarAmparosB: boolean = true
  desplegarAmparosA: boolean = true
  fondoResponsabilidad: boolean = false

  aseguradoras: Aseguradoras[] = []

  amparosBasicosC: string[] = [
    'Muerte Accidental','Incapacidad Temporal','Incapacidad Permanente','Gastos Médicos Hospitalarios'
  ]
  amparosBasicosE: string[] = [
    'Daños a bienes de terceros','Lesiones o Muerte a 1 persona','Lesiones o Muerte a 2 o mas personas'
  ]
  amparosAdicionales: string[] = [
    'Amparo patrimonial','Asistencia Juridica en proceso penal y civil','Perjuicios patrimoniales y extrapatrimoniales','Otras'
  ]

  formContractual: FormGroup;
  formExtracontractual: FormGroup;

  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
  ){
    this.formContractual = new FormGroup({
      numeroPolizaC: new FormControl(undefined),
      aseguradorasC: new FormControl(""),
      vigenciaPolizaInicioC: new FormControl(undefined),
      vigenciaPolizaFinalC: new FormControl(undefined),
      //----- Amparos basicos -----//
      valorAseguradoAB1: new FormControl(undefined),
      limitesAB1: new FormControl(undefined),
      deducibleAB1: new FormControl(undefined),
      //----- Amparos adicionales -----//
      valorAseguradoAA1: new FormControl(undefined),
      limitesAA1: new FormControl(undefined),
      deducibleAA1: new FormControl(undefined),
    })

    this.formExtracontractual = new FormGroup({
      numeroPolizaE: new FormControl(undefined),
      aseguradorasE: new FormControl(""),
      vigenciaPolizaInicioE: new FormControl(undefined),
      vigenciaPolizaFinalE: new FormControl(undefined),
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

  guardar(){
    if(this.formContractual.invalid && this.formExtracontractual.invalid){
      //console.log("aqui llega")
      marcarFormularioComoSucio(this.formContractual)
      marcarFormularioComoSucio(this.formExtracontractual)
      return;
    }
    const controlsC = this.formContractual.controls
    const controlsE = this.formExtracontractual.controls
  }

  descargarArchivoXLSX(): any{
    this.servicioAdministrarPoliza.descargarCadenaBase64().subscribe({
      next: (respuesta) => { // Cadena base64 del archivo, que obtienes de tu API
        this.servicioAdministrarPoliza.descargarArchivoXLSX(respuesta);
      }
    });
  }

  cargarArchivoXLSX(event: any, tipoPoliza: number){
    const archivoSeleccionado = event.target.files[0];
    if (archivoSeleccionado) {
      if(tipoPoliza == 1){
        const numeroPliza = this.formContractual.controls['numeroPolizaC'].value
        if(numeroPliza){
          console.log(numeroPliza)
          this.servicioAdministrarPoliza.cargarArchivoXLSX(archivoSeleccionado,numeroPliza).subscribe({
            next: (respuesta) =>{
              this.archivoCargado = respuesta.mensaje
              console.log(this.archivoCargado)
              this.popup.abrirPopupExitoso('Excelente',this.archivoCargado)
            },
            error: (error: HttpErrorResponse) =>{
              this.archivoCargado = error.error.mensaje
              console.log('Error: ',error.error.errores[0].error)
            }
          })
        }else{
          console.log("No has agregado un número de poliza")
        }
      }else 
      if(tipoPoliza == 2){
        const numeroPliza = this.formExtracontractual.controls['numeroPolizaE'].value
        if(numeroPliza){
          console.log(numeroPliza)
          this.servicioAdministrarPoliza.cargarArchivoXLSX(archivoSeleccionado,numeroPliza).subscribe({
            next: (respuesta) =>{
              this.archivoCargado = respuesta.mensaje
              console.log(this.archivoCargado)
              //this.popup.abrirPopupExitoso('Excelente',this.archivoCargado)
            },
            error: (error: HttpErrorResponse) =>{
              this.archivoCargado = error.error.mensaje
              console.log('Error: ',error.error.errores[0].error)
            }
          })
        }else{
          console.log("No has agregado un número de poliza")
        }
      }
      console.log('Se ha cargado un archivo:', archivoSeleccionado.name);
    }
  }

  cargarPDf(){

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

  DesplegarFondoResponsabilidad(estado: boolean){
    this.fondoResponsabilidad = estado
  }

  
}
