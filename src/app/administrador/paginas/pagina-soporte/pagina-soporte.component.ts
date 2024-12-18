import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SoportesService } from 'src/app/soportes/servicios/soportes.service';
import { marcarFormularioComoSucio } from '../../utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { MotivoSoporte } from 'src/app/soportes/modelos/MotivoSoporte';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';

@Component({
  selector: 'app-pagina-soporte',
  templateUrl: './pagina-soporte.component.html',
  styleUrls: ['./pagina-soporte.component.css']
})
export class PaginaSoporteComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  formulario: FormGroup
  motivos: MotivoSoporte[] = []

  constructor(private servicioSoporte: SoportesService,private ServiceMenuP:MenuHeaderPService){
    this.obtenerMotivos()
    this.formulario = new FormGroup({
      motivo: new FormControl<number | string>("", [ Validators.required ]),
      descripcion: new FormControl<string | undefined>( undefined, [ Validators.required ] ),
      adjunto: new FormControl<File | null>( null )
    })
  }
  ngOnInit(): void {
    this.ServiceMenuP.RutaModelo='' //paolo
  }

  obtenerMotivos(){
    this.servicioSoporte.obtenerMotivos().subscribe({
      next: (motivos)=>{
        this.motivos = motivos
      }
    })
  }

  crearSoporte(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return
    }
    const controls = this.formulario.controls
    this.servicioSoporte.crearSoporte(
      controls['descripcion'].value,
      controls['motivo'].value,
      controls['adjunto'].value).subscribe({
      next: ( soporte: any )=>{
        this.popup.abrirPopupExitoso('Soporte creado', 'Radicado', soporte.radicado)
        this.formulario.reset()
      }
    })
  }

  manejarExcedeTamanio(){
    this.popup.abrirPopupFallido("El archivo pesa más de 7 Mb")
  }
  manejarTipoIncorrecto(){
    this.popup.abrirPopupFallido("El tipo de archivo seleccionado es incorrecto")
  }
}
