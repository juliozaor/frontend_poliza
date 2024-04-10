import { Component, Input } from '@angular/core';
import { AdministrarPolizasComponent } from 'src/app/administrar-polizas/administrar-polizas.component';

@Component({
  selector: 'app-amparos-basicos',
  templateUrl: './amparos-basicos.component.html',
  styleUrls: ['./amparos-basicos.component.css']
})
export class AmparosBasicosComponent {
  
  @Input() amparosBasicos!: any

  desplegado: boolean = true

  alternarDesplegar(){
    this.desplegado = !this.desplegado
  }
}
