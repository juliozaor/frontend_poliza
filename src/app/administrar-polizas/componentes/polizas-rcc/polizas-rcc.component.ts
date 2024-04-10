import { Component, Input} from '@angular/core';
import { ServicioAdministrarPolizas } from '../../servicios/administrar-polizas.service';

@Component({
  selector: 'app-polizas-rcc',
  templateUrl: './polizas-rcc.component.html',
  styleUrls: ['./polizas-rcc.component.css']
})
export class PolizasRccComponent{
  
  @Input() polizaRCC!: any
  
  desplegado: boolean = true
  fondoResponsabilidad: boolean = false

  aseguradoras: any

  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
  ){
    this.obtenerAseguradora()
  }
  
  alternarDesplegar(){
    this.desplegado = !this.desplegado
  }

  DesplegarFondoResponsabilidad(estado: boolean){
    this.fondoResponsabilidad = estado
  }

  obtenerAseguradora(){
    this.servicioAdministrarPoliza.obtenerAseguradora().subscribe({
      next: (aseguradora: any) =>{
        this.aseguradoras = aseguradora
      }
    })
  }
}
