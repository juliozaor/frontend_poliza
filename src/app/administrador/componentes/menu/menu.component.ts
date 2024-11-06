import { Component, OnInit } from '@angular/core';
import { Rol, Submodulo } from 'src/app/autenticacion/modelos/Rol';
import { ServicioLocalStorage } from '../../servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { Router } from '@angular/router';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  rol?: Rol | null;
  usuario?: Usuario | null;
  isCollapsed = false;
  desplegado = true

  inicioSesion: boolean = false
  inicioVigia2: boolean = false

  rutasMenu:any//paolo
  constructor(
    private servicioLocalStorage: ServicioLocalStorage,
    private servicioAutenticacion: AutenticacionService,
    private router: Router,
    public ServiceMenuP:MenuHeaderPService
  ) {
  }

  ngOnInit(): void {
    const inicioSesion = JSON.parse(localStorage.getItem('inicio-sesion') || 'false');
    if(inicioSesion){this.inicioSesion = inicioSesion}
    const inicioVigia2 = JSON.parse(localStorage.getItem('inicio-vigia2') || 'false');
    if(inicioVigia2){this.inicioVigia2 = inicioVigia2}

    this.rol = this.servicioLocalStorage.obtenerRol()
    this.usuario = this.servicioLocalStorage.obtenerUsuario()
    this.rutasMenu=this.rol?.modulos

  }

  public abrir():void{
    this.desplegado = true
  }

  public cerrar():void{
    this.desplegado = false
  }

  public cerrarSesion(){
    /* this.servicioAutenticacion.cerrarSesion()
    this.router.navigateByUrl('/inicio-sesion') */
    localStorage.removeItem('inicio-sesion')
    localStorage.removeItem('inicio-vigia2')
    if(this.inicioVigia2){
      window.location.href = environment.urlVigia2+'/administrar/administrar-aplicativos'
    }else if(this.inicioSesion){
      this.router.navigateByUrl('/inicio-sesion')
    }
  }
  imprimirRuta(submodulo: Submodulo){
    console.log(`/administrar${submodulo.ruta}`)
  }

  navegarAlSubmodulo(submodulo: Submodulo){
    this.imprimirRuta(submodulo)
    this.router.navigateByUrl(`/administrar${submodulo.ruta}`)
  }
  public MostrarNombrePanP() : string
  {
   for (let modulo of this.rutasMenu) {

      for(let submodulo of modulo.submodulos )
      {
        if(`${this.ServiceMenuP.RutaModelo}`===`${submodulo.ruta}`)
          {
            return submodulo.nombre
          }
      }

    }

    return ''
  }
}
