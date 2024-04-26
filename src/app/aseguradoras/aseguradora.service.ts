import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutenticacionService } from '../autenticacion/servicios/autenticacion.service';
import { environment } from 'src/environments/environment';
import { AseguradoraModel } from './Modelos/aseguradora';
import { FiltrosAseguradora } from './Modelos/filtros';
import { Paginacion } from '../compartido/modelos/Paginacion';

@Injectable({
  providedIn: 'root'
})
export class AseguradoraService {


  private urlBackend:string
  headers: HttpHeaders;
  rute = '/api/v1/aseguradoras'

  constructor(private http: HttpClient, private auth:AutenticacionService) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${auth.leerToken()}`
    })
  }

  crearAseguradora(aseguradora: AseguradoraModel){
    return this.http.post(`${this.urlBackend}${this.rute}`, aseguradora, { headers: this.headers } )
  }

  obtenerAseguradoras(pagina: number, limite: number, filtros?: FiltrosAseguradora){    
    let endpoint = `${this.rute}?pagina=${pagina}&limite=${limite}`
    if(filtros){
        if(filtros.termino){
            endpoint+=`&termino=${filtros.termino}`
        }
    }
    return this.http.get<{aseguradoras: AseguradoraModel[], paginacion: Paginacion}>(
        `${this.urlBackend}${endpoint}`, { headers: this.headers })
  }

  actualizarAseguradora(aseguradora: AseguradoraModel){
    return this.http.put(`${this.urlBackend}${this.rute}`, aseguradora, { headers: this.headers } )
  }

}
