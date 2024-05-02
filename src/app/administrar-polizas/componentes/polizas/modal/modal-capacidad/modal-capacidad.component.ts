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

@Component({
  selector: 'app-modal-capacidad',
  templateUrl: './modal-capacidad.component.html',
  styleUrls: ['./modal-capacidad.component.css']
})
export class ModalCapacidadComponent implements OnInit{
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!:PopupComponent
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

  constructor(
    private servicioModal: NgbModal,
    private servicioAdministrarPoliza: ServicioAdministrarPolizas
  ){
    this.formMX = new FormGroup({
      // Modalidad MX
      numeroRMX: new FormControl(undefined, [ Validators.required, maxLengthNumberValidator(20), valorCeroValidar() ]),
      fechaRMX: new FormControl(undefined, [ Validators.required ]),
      PDFRMX: new FormControl(undefined, [ Validators.required ]),
    })
    this.formES = new FormGroup({
      //Modalidad ES
      numeroRES: new FormControl(undefined, [ Validators.required, maxLengthNumberValidator(20), valorCeroValidar() ]),
      fechaRES: new FormControl(undefined, [ Validators.required ]),
      PDFRES: new FormControl(undefined, [ Validators.required ]),
    })
    this.formPC = new FormGroup({
      //Modalidad PC
      numeroRPC: new FormControl(undefined, [ Validators.required, maxLengthNumberValidator(20), valorCeroValidar() ]),
      fechaRPC: new FormControl(undefined, [ Validators.required ]),
      PDFRPC: new FormControl(undefined, [ Validators.required ]),
    })
  }
  ngOnInit(): void {
    this.obtenerModalidades()
  }

  public abrir(): void{
    this.servicioModal.open(this.modal, {
      size: 'lg'
    })
  }

  obtenerModalidades(){
    this.servicioAdministrarPoliza.obtenerModalidades().subscribe({
      next: (modalidad: any) =>{
        this.modalidades = modalidad['modalidades']
      }
    })
  }

  guardarCapacidades(){
    let capacidadJson: any = {}
    let MX!: ModalidadModel
    let ES!: ModalidadModel
    let PC!: ModalidadModel
      if(this.formMX.controls['numeroRMX'].value){
        MX = {
          numero: this.formMX.controls['numeroRMX'].value,
          vigencia: this.formMX.controls['fechaRMX'].value,
          modalidadId: this.modalidades[0].id,
          nombre: this.archivoPDFMX?.nombreAlmacenado,
          nombreOriginal: this.archivoPDFMX?.nombreOriginalArchivo,
          ruta: this.archivoPDFMX?.ruta,
        }
      }
      if(this.formES.controls['numeroRES'].value){
        ES = {
          numero: this.formES.controls['numeroRES'].value,
          vigencia: this.formES.controls['fechaRES'].value,
          modalidadId: this.modalidades[1].id,
          nombre: this.archivoPDFES?.nombreAlmacenado,
          nombreOriginal: this.archivoPDFES?.nombreOriginalArchivo,
          ruta: this.archivoPDFES?.ruta,
        }
      }
      if(this.formPC.controls['numeroRPC'].value){
        PC = {
          numero: this.formPC.controls['numeroRPC'].value,
          vigencia: this.formPC.controls['fechaRPC'].value,
          modalidadId: this.modalidades[2].id,
          nombre: this.archivoPDFPC?.nombreAlmacenado,
          nombreOriginal: this.archivoPDFPC?.nombreOriginalArchivo,
          ruta: this.archivoPDFPC?.ruta,
        }
      }
      if(MX && !ES && !PC){//Solo MX existe
        /* this.formES.reset();this.formES.markAsPristine()
        this.formPC.reset();this.formPC.markAsPristine()
        console.log("MX: ",MX);
        if(this.formMX.invalid){
          marcarFormularioComoSucio(this.formMX)
          Swal.fire({
            text: "Hay errores en "+this.modalidades[0].nombre+" sin corregir",
            icon: "error",
            titleText: "¡No se ha realizado el envio a la Superintendencia de Transporte!",
          })
          return;
        } */
        
        capacidadJson.capacidades = [MX]
      }
      else if(!MX && ES && !PC){//Solo ES existe
       /*  this.formMX.reset();this.formMX.markAsPristine()
        this.formPC.reset();this.formPC.markAsPristine()
        console.log("ES: ",ES);
        if(this.formES.invalid){
          marcarFormularioComoSucio(this.formES)
          Swal.fire({
            text: "Hay errores en "+this.modalidades[1].nombre+" sin corregir",
            icon: "error",
            titleText: "¡No se ha realizado el envio a la Superintendencia de Transporte!",
          })
          return;
        } */
        capacidadJson.capacidades = [ES]
      }
      else if(!MX && !ES && PC){//Solo PC existe
        /* this.formES.reset();this.formES.markAsPristine()
        this.formMX.reset();this.formMX.markAsPristine()
        if(this.formPC.invalid){
          marcarFormularioComoSucio(this.formPC)
          Swal.fire({
            text: "Hay errores en "+this.modalidades[2].nombre+" sin corregir",
            icon: "error",
            titleText: "¡No se ha realizado el envio a la Superintendencia de Transporte!",
          })
          return;
        } */
        capacidadJson.capacidades = [PC]
      }
      else if(MX && ES && !PC){//Solo existe MX y ES
        /* if(this.formMX.invalid && this.formES.invalid){
          marcarFormularioComoSucio(this.formMX)
          marcarFormularioComoSucio(this.formES)
          Swal.fire({
            text: "Hay errores en "+this.modalidades[0].nombre+" y "+this.modalidades[1].nombre+" sin corregir",
            icon: "error",
            titleText: "¡No se ha realizado el envio a la Superintendencia de Transporte!",
          })
          return;
        } */
        capacidadJson.capacidades = [MX,ES]
      }
      else if(MX && !ES && PC){
        capacidadJson.capacidades = [MX,PC]
      }
      else if(!MX && ES && PC){
        capacidadJson.capacidades = [ES,PC]
      }
      else if(MX && ES && PC){
        capacidadJson.capacidades = [MX,ES,PC]
      }

    if(MX || ES || PC){
      console.log(this.capacidadJson);
      this.servicioAdministrarPoliza.guardarCapacidades(capacidadJson).subscribe({
        next: (respuesta) => {
          this.formMX.reset()
          this.formES.reset()
          this.formPC.reset()
          Swal.fire({
            text: respuesta.mensaje,
            icon: "success",
            confirmButtonText: "Finalizar",
          }).then((result) =>{
            if(result.isConfirmed){
              this.servicioModal.dismissAll();
            }
          })

        }
      })
    }else{
      Swal.fire({
        titleText:'Debe llenar al menos una Modalidad',
        icon: "warning",
      })
    }
  }

  cargarArchivoPDf(event: any, tipoModalidad: number){
    const archivoSeleccionado = event.target.files[0];
    if (archivoSeleccionado) {
      this.servicioAdministrarPoliza.cargarArchivoPDF(archivoSeleccionado).subscribe({
        next: (respuesta) =>{
          if(tipoModalidad == 1){
            this.archivoPDFMX = respuesta
          }else if(tipoModalidad == 2){
            this.archivoPDFES = respuesta
          }else if(tipoModalidad == 3){
            this.archivoPDFPC = respuesta
          }
        },
        error: (error: HttpErrorResponse) =>{
          console.log('Error: ',error.error.mensaje)
          Swal.fire({
            text: "¡Lo sentimos! No hemos podido cargar el archivo",
            icon: "warning",
          })
          if(tipoModalidad == 1){
            this.formMX.controls['PDFMX'].setValue('')
          }else if(tipoModalidad == 2){
            this.formES.controls['PDFES'].setValue('')
          }else if(tipoModalidad == 3){
            this.formPC.controls['PDFPC'].setValue('')
          }
          
        }
      })
    }
  }

  alternarDesplegarMX(){
    this.desplegarMX = !this.desplegarMX
  }
  alternarDesplegarES(){
    this.desplegarES = !this.desplegarES
  }
  alternarDesplegarPC(){
    this.desplegarPC = !this.desplegarPC
  }

  closeModal() {
    this.servicioModal.dismissAll();
    this.formMX.reset()
    this.formES.reset()
    this.formPC.reset()
  }
}
