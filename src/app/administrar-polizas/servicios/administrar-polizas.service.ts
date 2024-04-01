import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Autenticable } from "src/app/administrador/servicios/compartido/Autenticable";
import { environment } from 'src/environments/environment';
import { Poliza } from "../modelos/tipo-poliza";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ServicioAdministrarPolizas extends Autenticable{

    private readonly host = environment.urlBackend

    constructor(private http: HttpClient) {
        super()
    }

    obtenerTipoPolizas()
    :Observable<Poliza>{
        let endpoint = `/api/v1/poliza`
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }
}