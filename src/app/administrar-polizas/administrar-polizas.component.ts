import { Component, Input } from '@angular/core';
import { ServicioAdministrarPolizas } from './servicios/administrar-polizas.service';
import { AA, AB, Poliza } from './modelos/tipo-poliza';

@Component({
  selector: 'app-administrar-polizas',
  templateUrl: './administrar-polizas.component.html',
  styleUrls: ['./administrar-polizas.component.css']
})
export class AdministrarPolizasComponent {
  @Input() amparosBasicosContractuales!: AB

  idABC?: AA

  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
  ){
    this.obtenerTipoPolizas()
  }

  obtenerTipoPolizas(){
    this.servicioAdministrarPoliza.obtenerTipoPolizas().subscribe({
      next: (poliza: any) =>{
        localStorage.setItem("poliza", JSON.stringify(poliza))
        const responsabilidadCivilContractual = poliza["RESPONSABILIDAD CIVIL CONTRACTUA"];
        
        const responsabilidadCivilExtracontractual = poliza["RESPONSABILIDAD CIVIL EXTRACONTRACTUAL"];
        
        const amparosBasicosContractuales = responsabilidadCivilContractual["AMPAROS BÁSICOS"];
        const amparosAdicionalesContractuales = responsabilidadCivilContractual["AMPAROS ADICIONALES"];
        
        const amparosBasicosExtracontractuales = responsabilidadCivilExtracontractual["AMPAROS BÁSICOS"];
        const amparosAdicionalesExtracontractuales = responsabilidadCivilExtracontractual["AMPAROS ADICIONALES"];
        
        //this.idABC = amparosBasicosContractuales[0]["id"];
        
        /* console.log("responsabilidad Civil Contractual: ",responsabilidadCivilContractual)
        console.log("Amparos Básicos Contractuales:", amparosBasicosContractuales);
        console.log("Amparos Adicionales Contractuales:", amparosAdicionalesContractuales);
        console.log("Amparos Básicos Extracontractuales:", amparosBasicosExtracontractuales);
        console.log("Amparos Adicionales Extracontractuales:", amparosAdicionalesExtracontractuales); */
        
      }
    })
  }
}
