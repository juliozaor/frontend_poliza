import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alertas-modal-gov',
  templateUrl: './alertas-modal-gov.component.html',
  styleUrls: ['./alertas-modal-gov.component.css']
})
export class AlertasModalGovComponent {
  @Input() alerta?: 'confirmacion' | 'exito' | 'error' | 'peligro'
  @Input() texto?:string
  @Input() titulo?:string
  @Input() icono?: 'confirmacion' | 'exito' | 'error' | 'peligro'
  @Input() botonOk?: boolean
  @Input() botonPrimario?: boolean
  @Input() textoBotonPrimario?: string

  constructor(){

  }

  abrirModal(){

  }

}
