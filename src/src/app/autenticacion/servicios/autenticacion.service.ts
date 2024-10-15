import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IniciarSesionRespuesta } from '../modelos/IniciarSesionRespuesta';
import { PeticionRecuperarContrasena } from '../modelos/PeticionRecuperarContrasena';
import { PeticionCrearSoporte } from '../modelos/PeticionCrearSoporte';
import { Soporte } from 'src/app/soportes/modelos/Soporte';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private urlBackend: string
  headers: HttpHeaders;
  public readonly llaveTokenLocalStorage = 'jwt'
  public readonly llaveUsuarioLocalStorage = 'Usuario'
  public readonly llaveRolesLocalStorage = 'rol'
  public readonly poliza = 'poliza'
  userToken: string = '';

  constructor(private clientHttp:HttpClient) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    })
  }

  public iniciarSesion(documento:string, clave:string):Observable<IniciarSesionRespuesta>{
    const endpoint = '/api/v1/autenticacion/inicio-sesion'
    console.log(`${this.urlBackend}${endpoint}`, {usuario: documento, contrasena: clave})
    return this.clientHttp.post<IniciarSesionRespuesta>(`${this.urlBackend}${endpoint}`, {usuario: documento, contrasena: clave})
  }

  public cerrarSesion(){
    localStorage.removeItem(this.llaveUsuarioLocalStorage)
    localStorage.removeItem(this.llaveTokenLocalStorage)
    localStorage.removeItem(this.llaveRolesLocalStorage)
    localStorage.removeItem(this.poliza)
  }

  public guardarInformacionInicioSesion(jwt:string, rol:object, Usuario: object):void{
    localStorage.setItem(this.llaveTokenLocalStorage, jwt),
    localStorage.setItem(this.llaveRolesLocalStorage, JSON.stringify(rol))
    localStorage.setItem(this.llaveUsuarioLocalStorage, JSON.stringify(Usuario))
  }

  public recuperarContraseña(informacionUsuario:PeticionRecuperarContrasena): Observable<string>{
    const endpoint = '/api/v1/envio-email'
    return this.clientHttp.post<string>(`${this.urlBackend}${endpoint}`, informacionUsuario,)
  }

  public crearSoporte(peticion: PeticionCrearSoporte){
    const endpoint = `/api/v1/soportes/acceso`
    const formData = new FormData()
    formData.append('descripcion', peticion.descripcion)
    formData.append('razonSocial', peticion.razonSocial)
    formData.append('correo', peticion.correo)
    formData.append('nit', peticion.nit)
    formData.append('errorAcceso', peticion.errorAcceso)
    peticion.telefono ? formData.append('telefono', peticion.telefono) : undefined;
    peticion.adjunto ? formData.append('adjunto', peticion.adjunto) : undefined;
    return this.clientHttp.post<Soporte>(`${this.urlBackend}${endpoint}`, formData)
  }

  leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('jwt')!;
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

}
