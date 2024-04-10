import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-amparos-adicionales',
  templateUrl: './amparos-adicionales.component.html',
  styleUrls: ['./amparos-adicionales.component.css']
})
export class AmparosAdicionalesComponent {
  @Input() amparosAdicionales!: any
  
  poliza?: any
  tipoPoliza?: number
  tipoAmparo?: number

  desplegado: boolean = true

  constructor(){}
  
  alternarDesplegar(){
    this.desplegado = !this.desplegado
  }

  visualizarPoliza(){
    if(localStorage.getItem("poliza")){
      this.poliza = JSON.parse(localStorage.getItem("poliza")!)
      this.tipoPoliza = this.poliza["RESPONSABILIDAD CIVIL CONTRACTUA"]["AMPAROS ADICIONALES"][0]["tipo_poliza"]
      this.tipoAmparo = this.poliza["RESPONSABILIDAD CIVIL CONTRACTUA"]["AMPAROS ADICIONALES"][0]["tipo_amparo"]
      console.log("Tipo de poliza: ",this.tipoPoliza, " Tipo de amparo: ", this.tipoAmparo)

      //this.amparosAdicionales = this.poliza["RESPONSABILIDAD CIVIL CONTRACTUA"]["AMPAROS ADICIONALES"]
      console.log("RCC - Amparos adicionales: ",this.amparosAdicionales)   
    }else{
      console.log("Esa vaina está vacia")
    }
  }
}
