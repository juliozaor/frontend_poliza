import { Component, Input } from '@angular/core';
import { AA, AB, Poliza } from '../../modelos/tipo-poliza';

@Component({
  selector: 'app-polizas-rcc',
  templateUrl: './polizas-rcc.component.html',
  styleUrls: ['./polizas-rcc.component.css']
})
export class PolizasRccComponent {
  @Input() amparosBasicosContractuales!: AB

  constructor(){}

  desplegado: boolean = true
  
  alternarDesplegar(){
    this.desplegado = !this.desplegado
  }
}
