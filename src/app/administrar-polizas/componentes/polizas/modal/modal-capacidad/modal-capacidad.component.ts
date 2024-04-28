import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CapacidadesModel, ModalidadModel, ModalidadesModel } from 'src/app/administrar-polizas/modelos/modalidades';
import { ServicioAdministrarPolizas } from 'src/app/administrar-polizas/servicios/administrar-polizas.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-capacidad',
  templateUrl: './modal-capacidad.component.html',
  styleUrls: ['./modal-capacidad.component.css']
})
export class ModalCapacidadComponent implements OnInit{
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!:PopupComponent
  form: FormGroup

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
    this.form = new FormGroup({
      // Modalidad MX
      numeroRMX: new FormControl(undefined),
      fechaRMX: new FormControl(undefined),
      PDFRMX: new FormControl(undefined),
      //Modalidad ES
      numeroRES: new FormControl(undefined),
      fechaRES: new FormControl(undefined),
      PDFRES: new FormControl(undefined),
      //Modalidad PC
      numeroRPC: new FormControl(undefined),
      fechaRPC: new FormControl(undefined),
      PDFRPC: new FormControl(undefined),
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
      if(this.form.controls['numeroRMX'].value){
        MX = {
          numero: this.form.controls['numeroRMX'].value,
          vigencia: this.form.controls['fechaRMX'].value,
          modalidadId: this.modalidades[0].id,
          nombre: this.archivoPDFMX?.nombreAlmacenado,
          nombreOriginal: this.archivoPDFMX?.nombreOriginalArchivo,
          ruta: this.archivoPDFMX?.ruta,
        }
      }
      if(this.form.controls['numeroRES'].value){
        ES = {
          numero: this.form.controls['numeroRES'].value,
          vigencia: this.form.controls['fechaRES'].value,
          modalidadId: this.modalidades[1].id,
          nombre: this.archivoPDFES?.nombreAlmacenado,
          nombreOriginal: this.archivoPDFES?.nombreOriginalArchivo,
          ruta: this.archivoPDFES?.ruta,
        }
      }
      if(this.form.controls['numeroRPC'].value){
        PC = {
          numero: this.form.controls['numeroRPC'].value,
          vigencia: this.form.controls['fechaRPC'].value,
          modalidadId: this.modalidades[2].id,
          nombre: this.archivoPDFPC?.nombreAlmacenado,
          nombreOriginal: this.archivoPDFPC?.nombreOriginalArchivo,
          ruta: this.archivoPDFPC?.ruta,
        }
      }
      if(MX && !ES && !PC){capacidadJson.capacidades = [MX]}
      else if(!MX && ES && !PC){capacidadJson.capacidades = [ES]}
      else if(!MX && !ES && PC){capacidadJson.capacidades = [PC]}
      else if(MX && ES && !PC){capacidadJson.capacidades = [MX,ES]}
      else if(MX && !ES && PC){capacidadJson.capacidades = [MX,PC]}
      else if(!MX && ES && PC){capacidadJson.capacidades = [ES,PC]}
      else if(MX && ES && PC){capacidadJson.capacidades = [MX,ES,PC]}

    if(MX || ES || PC){
      //console.log(this.capacidadJson);
      this.servicioAdministrarPoliza.guardarCapacidades(capacidadJson).subscribe({
        next: (respuesta) => {
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
            this.form.controls['PDFMX'].setValue('')
          }else if(tipoModalidad == 2){
            this.form.controls['PDFES'].setValue('')
          }else if(tipoModalidad == 3){
            this.form.controls['PDFPC'].setValue('')
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
  }
}
