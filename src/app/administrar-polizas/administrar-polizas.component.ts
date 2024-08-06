import { Component, OnInit} from '@angular/core';
import { ServicioAdministrarPolizas } from './servicios/administrar-polizas.service';
import { AutenticacionService } from '../autenticacion/servicios/autenticacion.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Paginador } from '../administrador/modelos/compartido/Paginador';
import { Observable } from 'rxjs';
import { Paginacion } from '../compartido/modelos/Paginacion';
import { FiltrarPolizas } from './modelos/FiltrosPoliza';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-administrar-polizas',
  templateUrl: './administrar-polizas.component.html',
  styleUrls: ['./administrar-polizas.component.css']
})
export class AdministrarPolizasComponent implements OnInit{
  titulo: string = "SISI/POLIZA"
  usuario?:{usuario:string,nombre:string};
  localStorageUsuario:string

  polizas:Array<{poliza:string,tipoPoliza:string | number,fechaInicio:string,fechaFin:string}> = []
  tipoPoliza = [{id:1,nombre:'RESPONSABILIDAD CIVIL CONTRACTUAL'},{id:2,nombre:'RESPONSABILIDAD CIVIL EXTRACONTRACTUAL'}]

  formulario: FormGroup
  paginador: Paginador<FiltrarPolizas>
  page: number = 1; // Página inicial
  itemsPerPage: number = 10; // Items por página

  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas, private servicioAut: AutenticacionService, private activatedRoute: ActivatedRoute
  ){
    this.localStorageUsuario = servicioAut.llaveUsuarioLocalStorage
    this.formulario = this.construirFormulario()
    this.paginador = new Paginador<FiltrarPolizas>(this.obtenerPolizas)
  }
  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem(this.localStorageUsuario)!)
    //this.listarPolizas()
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
    //console.log(this.usuario)
    //this.obtenerModalidades()
  }

  construirFormulario(){
    return new FormGroup({
      termino: new FormControl<string>(""),
      tipoPoliza: new FormControl<number | string>("")
    })
  }

  cambiarFiltros(){
    this.paginador.inicializar(undefined, undefined, {
      tipoPoliza: this.formulario.get('tipoPoliza')!.value,
      poliza: this.formulario.get('termino')!.value,
      fechaInicio: '',
      fechaFin: ''
    })
  }

  obtenerPolizas = (pagina: number, limite: number, filtros?: FiltrarPolizas) => {
    return new Observable<Paginacion>((suscriptor:any) => {
      this.servicioAdministrarPoliza.listarPolizas(pagina, limite, filtros).subscribe({
        next: (polizas: any) => {
          console.log(polizas)
          this.polizas = polizas.polizas
          suscriptor.next(polizas.paginacion)
        }
      })
    })
  }

  listarPolizas(){
    this.servicioAdministrarPoliza.listarPolizas().subscribe({
      next: (polizas: any) => {
        console.log(polizas)
        this.polizas = polizas.polizas
      }
    })
  }

  visualizarPoliza(numero:any, tipo:any){

  }
}
