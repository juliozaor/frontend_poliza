import { Component } from '@angular/core';

@Component({
  selector: 'app-polizas-rce',
  templateUrl: './polizas-rce.component.html',
  styleUrls: ['./polizas-rce.component.css']
})
export class PolizasRceComponent {
  desplegado: boolean = true
  
  alternarDesplegar(){
    this.desplegado = !this.desplegado
  }

}
