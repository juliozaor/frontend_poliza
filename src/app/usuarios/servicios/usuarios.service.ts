import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { Usuario } from '../modelos/Usuario';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { FiltrosUsuarios } from '../modelos/FiltrosUsuarios';
import { PeticionCrearUsuario } from '../modelos/PeticionCrearUsuario';
import { Rol } from '../modelos/Rol';
import { PeticionActualizarUsuario } from '../modelos/PeticionActualizarUsuario';
import { MunicipioReportado } from '../modelos/MunicipioReportado';

@Injectable({
  providedIn: 'root'
})
export class ServicioUsuarios extends Autenticable {
  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) {
    super()
  }

  guardar(peticion: PeticionCrearUsuario){
    const endpoint = '/api/v1/usuarios/registro'
    return this.http.post(`${this.host}${endpoint}`, peticion, { headers: this.obtenerCabeceraAutorizacion() } )
  }

  actualizar(documento: string, peticion: PeticionActualizarUsuario){
    const endpoint = `/api/v1/usuarios/${documento}`
    return this.http.patch(`${this.host}${endpoint}`, peticion, { headers: this.obtenerCabeceraAutorizacion() } )
  }

  listar(pagina: number, limite: number, filtros?: FiltrosUsuarios){
    let endpoint = `/api/v1/usuarios/listar?pagina=${pagina}&limite=${limite}`
    if(filtros){
        if(filtros.rol){
            endpoint+=`&rol=${filtros.rol}`
        }
        if(filtros.termino){
            endpoint+=`&termino=${filtros.termino}`
        }
    }
    return this.http.get<{usuarios: Usuario[], paginacion: Paginacion}>(
        `${this.host}${endpoint}`, 
        { headers: this.obtenerCabeceraAutorizacion() 
    })
  }

  listarRoles(){
    const endpoint = '/api/v1/rol'
    return this.http.get<{rols: Rol[], paginacion: Paginacion}>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerMunicipiosDeUsuario(idVigilado: string){
    const endpoint = `/api/v1/usuarios/municipios/${idVigilado}`
    return this.http.get<MunicipioReportado[]>(
      `${this.host}${endpoint}`,
      { headers: this.obtenerCabeceraAutorizacion() }
    );
  }

}
