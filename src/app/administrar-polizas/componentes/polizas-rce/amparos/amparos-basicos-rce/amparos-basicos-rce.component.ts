import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-amparos-basicos-rce',
  templateUrl: './amparos-basicos-rce.component.html',
  styleUrls: ['./amparos-basicos-rce.component.css']
})
export class AmparosBasicosRceComponent {
  @Input() amparosBasicos: any

  desplegado: boolean = true

  constructor(){}
  
  alternarDesplegar(){
    this.desplegado = !this.desplegado
  }
}
