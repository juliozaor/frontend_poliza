import { Component, OnInit} from '@angular/core';
import { ServicioAdministrarPolizas } from './servicios/administrar-polizas.service';
import { Modalidades } from './modelos/modalidades';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-administrar-polizas',
  templateUrl: './administrar-polizas.component.html',
  styleUrls: ['./administrar-polizas.component.css']
})
export class AdministrarPolizasComponent implements OnInit{
  titulo: string = "SISI/POLIZA"
  polizas: any
  modalidades: Modalidades[] = []
  pruebas = [
    {id: 1, nombre: 'uno', estado: true},
    {id: 2, nombre: 'dos', estado: true},
  ]

  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
  ){
    
  }
  ngOnInit(): void {
    //this.obtenerModalidades()
  }

  obtenerModalidades(){
    this.servicioAdministrarPoliza.obtenerModalidades().subscribe({
      next: (modalidad: any) =>{
        this.modalidades = modalidad['modalidades']
        //console.log(this.modalidades)
      }
    })
  }

  guardarPolizas(){
    
  }
}
