import { Component } from '@angular/core';
import { AA } from 'src/app/administrar-polizas/modelos/tipo-poliza';

@Component({
  selector: 'app-amparos-basicos',
  templateUrl: './amparos-basicos.component.html',
  styleUrls: ['./amparos-basicos.component.css']
})
export class AmparosBasicosComponent {
  poliza?: any
  id?: string
  tipoPoliza?: number
  tipoAmparo?: number
  amparosBasicos?: Array<any>
  contractual: string = "CONTRACTUA"
  extracontractual: string = "EXTRACONTRACTUAL"

  desplegado: boolean = true

  constructor(){this.visualizarAmparo()}
  
  alternarDesplegar(){
    this.desplegado = !this.desplegado
  }

  visualizarAmparo(){
    if(localStorage.getItem("poliza")?.length != 0){
      this.poliza = JSON.parse(localStorage.getItem("poliza")!)
      this.tipoPoliza = this.poliza["RESPONSABILIDAD CIVIL CONTRACTUA"]["AMPAROS BÁSICOS"][0]["tipo_poliza"]
      this.tipoAmparo = this.poliza["RESPONSABILIDAD CIVIL CONTRACTUA"]["AMPAROS BÁSICOS"][0]["tipo_amparo"]
      console.log("Tipo de poliza: ",this.tipoPoliza, "Tipo de amparo: ", this.tipoAmparo)

      this.amparosBasicos = this.poliza["RESPONSABILIDAD CIVIL "+this.contractual]["AMPAROS BÁSICOS"]
      console.log("R Civil Contractual - Amparos básicos: ",this.amparosBasicos)
    }else{
      console.log("Esa vaina está vacia")
    }
  }
}
