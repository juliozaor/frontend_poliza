import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-amparos-adicionales-rce',
  templateUrl: './amparos-adicionales-rce.component.html',
  styleUrls: ['./amparos-adicionales-rce.component.css']
})
export class AmparosAdicionalesRceComponent {
  @Input() amparosAdicionales!: any

  desplegado: boolean = true

  constructor(){}
  
  alternarDesplegar(){
    this.desplegado = !this.desplegado
  }
}
