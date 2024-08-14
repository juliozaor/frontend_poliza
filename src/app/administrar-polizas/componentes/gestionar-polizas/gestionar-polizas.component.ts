import { Component } from '@angular/core';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { FiltrarPolizas } from '../../modelos/FiltrosPoliza';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Observable } from 'rxjs';
import { ServicioAdministrarPolizas } from '../../servicios/administrar-polizas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FiltrosNovedadesPoliza } from '../../modelos/FiltrosNovedadesPoliza';

@Component({
  selector: 'app-gestionar-polizas',
  templateUrl: './gestionar-polizas.component.html',
  styleUrls: ['./gestionar-polizas.component.css']
})
export class GestionarPolizasComponent {
  polizas: Array<{ poliza: string, tipoPoliza: string | number, estadoPoliza: string, fechaInicio: string, fechaFin: string, fechaCargue: string, aseguradora: string, cantidadVehiculos: string }> = []
  novedadesPoliza: Array<{ poliza: string, tipoPoliza: string | number, placa: string, fechaActualizacion: string, estado: string, observacion: string }> = []
  tipoPoliza: number = 0;
  numeroPoliza: any;
  verPoliza: boolean = false;
  poliza:any;

  paginador: Paginador<FiltrarPolizas>
  // paginador2: Paginador<{ placas : string }>
  // paginador3: Paginador<FiltrosNovedadesPoliza>
  constructor(private servicioAut: AutenticacionService,
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
    private activatedRoute: ActivatedRoute,
    private router: Router,) {
    this.paginador = new Paginador<FiltrarPolizas>(this.obtenerPolizas)
    // this.paginador2 = new Paginador<{ placas : string }>()
  }
  
  ngOnInit(): void {
    this.inicializarPaginador();
  }

  obtenerPolizas = (pagina: number, limite: number, filtros?: FiltrarPolizas) => {
    return new Observable<Paginacion>((suscriptor:any) => {
      this.servicioAdministrarPoliza.listarPolizas(pagina, limite, filtros).subscribe({
        next: (polizas: any) => {
          this.polizas = polizas.polizas
          suscriptor.next(polizas.paginacion)
          console.log(this.polizas);
        }
      })
    })
  }

  inicializarPaginador() {
    this.activatedRoute.queryParams.subscribe({
      next: (query)=>{
        this.paginador.inicializar(undefined, undefined, {
          poliza:'',
          tipoPoliza: '',
          fechaInicio: '',
          fechaFin: ''
        })
      }
    }) 
  }

  visualizarPoliza(numero:any, tipoPoliza:any){
    let idTipo; 
    this.numeroPoliza = numero;
    this.verPoliza = false;
    if(tipoPoliza === 'RESPONSABILIDAD CIVIL CONTRACTUAL')idTipo = 1, this.tipoPoliza = 1
    if (tipoPoliza === 'RESPONSABILIDAD CIVIL EXTRACONTRACTUAL') idTipo = 2, this.tipoPoliza = 2 
    this.servicioAdministrarPoliza.visualizarPoliza(numero,idTipo).subscribe({
      next: (poliza: any) => {
        this.poliza = poliza
        this.verPoliza = true;
        this.visualizarNovedadesPolizas(numero, tipoPoliza)
      }
    })
  }

  visualizarNovedadesPolizas(numero: any, tipoPoliza: any) {
    let idTipo; 
    if(tipoPoliza === 'RESPONSABILIDAD CIVIL CONTRACTUAL')idTipo = 1, this.tipoPoliza = 1
    if (tipoPoliza === 'RESPONSABILIDAD CIVIL EXTRACONTRACTUAL') idTipo = 2, this.tipoPoliza = 2 
    this.servicioAdministrarPoliza.consultarNovedadesPoliza(idTipo, numero).subscribe({
      next: (novedades: any) => {
        this.novedadesPoliza = novedades;
      }
    })
  }



}
