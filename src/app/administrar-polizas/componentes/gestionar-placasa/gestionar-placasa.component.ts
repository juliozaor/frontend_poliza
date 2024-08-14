import { Component, OnInit } from '@angular/core';
import { Historial, Novedades, PolizaPlaca } from '../../modelos/PolizaPlaca';
import { ServicioAdministrarPolizas } from '../../servicios/administrar-polizas.service';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';

@Component({
  selector: 'app-gestionar-placasa',
  templateUrl: './gestionar-placasa.component.html',
  styleUrls: ['./gestionar-placasa.component.css']
})
export class GestionarPlacasaComponent implements OnInit{
  polizas: PolizaPlaca = {}
  placa:string = ''
  novedades: Array<Novedades> = []
  historial: Array<Historial> = []

  vinculadaCont?: boolean = true; desVinculadaCont: boolean = true
  vinculadaExtraCont?: boolean = true; desVinculadaExtraCont: boolean = true
  observacionCont?: string
  observacionExtraCont?: string

  novedadesPaginadas: Array<Novedades> = []
  paginadorNovedades: {totalRegistros:number,pagina:number,limite:number}

  historialPaginado: Array<Historial> = []
  paginadorHistorial: {totalRegistros:number,pagina:number,limite:number}

  constructor(private servicioAdministrarPoliza: ServicioAdministrarPolizas){
    this.paginadorNovedades = {totalRegistros:0, pagina:1, limite:5}
    this.paginadorHistorial = {totalRegistros:0, pagina:1, limite:5}
  }

  ngOnInit(): void {}

  consultarPoliza(placa:string){
    this.servicioAdministrarPoliza.obtenerPolizaPlaca(placa).subscribe({
      next: (polizas: any) => {
        console.log(polizas)
        this.polizas = polizas
        this.desVinculadaCont = !this.polizas.contractual?.vinculada
        this.desVinculadaExtraCont = !this.polizas.extraContractual?.vinculada

        this.novedades = polizas.novedades
        this.paginadorNovedades.totalRegistros = polizas.novedades.length
        this.actualizarNovedadesPaginadas(); // Actualizar la tabla con los datos paginados

        this.historial = polizas.historial
        this.paginadorHistorial.totalRegistros = polizas.historial.length
        this.actualizarHistorialPaginado();

        this.vinculadaCont = this.polizas.contractual?.vinculada
        this.observacionCont = this.polizas.contractual?.observacion
        this.vinculadaExtraCont = this.polizas.extraContractual?.vinculada
        this.observacionExtraCont = this.polizas.extraContractual?.observacion
      }
    })
  }
  desvincular(tipoPoliza:number,id:any, motivo:string){
    if(tipoPoliza === 1) this.desVinculadaCont = true
    if(tipoPoliza === 2) this.desVinculadaExtraCont = true

    this.servicioAdministrarPoliza.vinculacionPlaca(id,motivo).subscribe({
      next: (respuesta: any) => {
        console.log(respuesta)
      }
    })
    //this.openAlert()
  }

  openAlert() {
    document.getElementById('closealertcontainer')!.style.display = 'flex';
    document.getElementById('closealert')!.style.cssText = 'position: fixed; bottom: 23px; width: 100%; z-index: 2; display: flex;';
  }

  actualizarNovedadesPaginadas() {
    const startIndex = (this.paginadorNovedades.pagina - 1) * this.paginadorNovedades.limite;
    const endIndex = startIndex + this.paginadorNovedades.limite;
    this.novedadesPaginadas = this.novedades.slice(startIndex, endIndex); // Obtener solo las novedades para la página actual
  }
  // Cambia de página cuando se detecta un cambio
  cambiarPaginaNovedades(pagina: number) {
    this.paginadorNovedades.pagina = pagina;
    this.actualizarNovedadesPaginadas()  // Carga los datos para la nueva página
  }

  actualizarHistorialPaginado() {
    const startIndex = (this.paginadorHistorial.pagina - 1) * this.paginadorHistorial.limite;
    const endIndex = startIndex + this.paginadorHistorial.limite;
    this.historialPaginado = this.historial.slice(startIndex, endIndex); // Obtener solo las novedades para la página actual
  }
  // Cambia de página cuando se detecta un cambio
  cambiarPaginaHistorial(pagina: number) {
    this.paginadorHistorial.pagina = pagina;
    this.actualizarHistorialPaginado()  // Carga los datos para la nueva página
  }

}
