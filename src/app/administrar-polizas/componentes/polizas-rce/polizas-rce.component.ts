import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-polizas-rce',
  templateUrl: './polizas-rce.component.html',
  styleUrls: ['./polizas-rce.component.css']
})
export class PolizasRceComponent{
  
  @Input() polizaRCE!: any

  desplegado: boolean = true
  fondoResponsabilidad: boolean = false

  alternarDesplegar(){
    this.desplegado = !this.desplegado
  }
  
  DesplegarFondoResponsabilidad(estado: boolean){
    this.fondoResponsabilidad = estado
  }
}
