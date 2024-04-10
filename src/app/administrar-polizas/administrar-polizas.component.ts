import { Component} from '@angular/core';
import { ServicioAdministrarPolizas } from './servicios/administrar-polizas.service';

@Component({
  selector: 'app-administrar-polizas',
  templateUrl: './administrar-polizas.component.html',
  styleUrls: ['./administrar-polizas.component.css']
})
export class AdministrarPolizasComponent {
  titulo: string = "SISI/POLIZA"
  polizas: any
  modalidades: any

  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
  ){
    this.obtenerPolizas()
    this.obtenerModalidades()
  }

  obtenerPolizas(){
    this.servicioAdministrarPoliza.obtenerPolizas().subscribe({
      next: (poliza: any) =>{
        this.polizas = poliza
      }
    })
  }

  obtenerModalidades(){
    this.servicioAdministrarPoliza.obtenerModalidades().subscribe({
      next: (modalidad: any) =>{
        this.modalidades = modalidad
      }
    })
  }
}
