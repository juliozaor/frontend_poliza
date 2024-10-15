import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { FiltrosVehiculos } from 'src/app/administrar-polizas/modelos/FiltrosVehiculos';
import { VehiculoModel } from 'src/app/administrar-polizas/modelos/vehiculosModel';
import { ServicioAdministrarPolizas } from 'src/app/administrar-polizas/servicios/administrar-polizas.service';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';

@Component({
  selector: 'app-listar-vehiculos',
  templateUrl: './listar-vehiculos.component.html',
  styleUrls: ['./listar-vehiculos.component.css']
})
export class ListarVehiculosComponent {
  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5
  paginador: Paginador<FiltrosVehiculos>
  vehiculos: VehiculoModel[] = []

  @Input() numeroPoliza:any
  @Input() tipoPoliza:any

  termino:string = ''

  constructor(
    private servicio: ServicioAdministrarPolizas,
  ){
    this.paginador = new Paginador<FiltrosVehiculos>(this.obtenerVehiculos)
  }

  ngOnInit(): void {
    this.paginador.inicializar(this.paginaInicial, this.limiteInicial, {
      poliza: this.numeroPoliza,
      tipoPoliza: this.tipoPoliza
    })

  }
  obtenerVehiculos = (pagina: number, limite: number, filtros?:FiltrosVehiculos)=>{
    return new Observable<Paginacion>( sub => {
      this.servicio.listarVehiculos(pagina, limite, filtros).subscribe({
        next: ( respuesta:any )=>{
          this.vehiculos = respuesta.vehiculos; console.log(this.vehiculos)
          sub.next(respuesta.paginacion)
        }
      })
    })
  }

  actualizarFiltros(){
    this.paginador.filtrar({ termino: this.termino })
  }

  limpiarFiltros(){
    this.termino = ""
    this.paginador.filtrar({ termino: this.termino })
  }

  setTermino(termino: string){
    this.termino = termino
  }
}
