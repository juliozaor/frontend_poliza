import { Component, OnInit} from '@angular/core';
import { ServicioAdministrarPolizas } from './servicios/administrar-polizas.service';
import { AutenticacionService } from '../autenticacion/servicios/autenticacion.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Paginador } from '../administrador/modelos/compartido/Paginador';
import { Observable } from 'rxjs';
import { Paginacion } from '../compartido/modelos/Paginacion';
import { FiltrarPolizas } from './modelos/FiltrosPoliza';
import { ActivatedRoute, Router } from '@angular/router';

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
  termino: string = ""

  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
    private servicioAut: AutenticacionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
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

  setTermino(termino: string){
    this.termino = termino
  }

  limpiarFiltros(){
    this.termino = ""
    this.paginador.filtrar({ poliza: '', tipoPoliza: '', fechaInicio:'', fechaFin:'' })
  }

  obtenerPolizas = (pagina: number, limite: number, filtros?: FiltrarPolizas) => {
    return new Observable<Paginacion>((suscriptor:any) => {
      this.servicioAdministrarPoliza.listarPolizas(pagina, limite, filtros).subscribe({
        next: (polizas: any) => {
          //console.log(polizas)
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

  crearPolizas(){
    const ruta = '/administrar-poliza/crear-poliza'
    this.router.navigateByUrl(`/administrar${ruta}`)
  }

  visualizarPoliza(numero:any, tipoPoliza:any){
    let idTipo; let ruta:string
    if(tipoPoliza === 'RESPONSABILIDAD CIVIL CONTRACTUAL')idTipo = 1, ruta = '/administrar-poliza/polizas-contractuales'
    if(tipoPoliza === 'RESPONSABILIDAD CIVIL EXTRACONTRACTUAL')idTipo = 2, ruta = '/administrar-poliza/polizas-extracontractuales'
    //console.log(numero, idTipo)
    this.servicioAdministrarPoliza.visualizarPoliza(numero,idTipo).subscribe({
      next: (poliza:any) => {
        //console.log(poliza)
        localStorage.setItem('poliza',JSON.stringify(poliza))
        this.router.navigateByUrl(`/administrar${ruta}`)
      }
    })
  }
}
