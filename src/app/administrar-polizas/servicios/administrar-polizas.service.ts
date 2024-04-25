import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Autenticable } from "src/app/administrador/servicios/compartido/Autenticable";
import { environment } from 'src/environments/environment';
import { Observable, catchError, map, mergeMap, throwError } from "rxjs";
import * as saveAs from "file-saver";
import * as XLSX from 'xlsx';
import { ServicioArchivos } from "src/app/archivos/servicios/archivos.service";
import { ArchivoGuardado } from "src/app/archivos/modelos/ArchivoGuardado";

@Injectable({
    providedIn: 'root'
})
export class ServicioAdministrarPolizas extends Autenticable{

    private readonly host = environment.urlBackend

    constructor(
      private http: HttpClient,
      private servicioArchivos: ServicioArchivos,
    ) {
        super()
    }

    obtenerPolizas(id: number)
    :Observable<any>{
        let endpoint = `/api/v1/poliza?modalidadId=${id}`
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }

    obtenerModalidades()
    :Observable<any>{
        let endpoint = `/api/v1/maestras/modalidades`
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }

    obtenerAseguradora()
    :Observable<any>{
        let endpoint = `/api/v1/maestras/aseguradoras`
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }

    guardar(){
      
    }

    descargarCadenaBase64():Observable<string>{
      let endpoint = `/api/v1/vehiculos/plantillas/vehiculos.xlsx`
      return this.http.get(
        `${this.host}${endpoint}`,
        { responseType: 'text' }
      )
    }

    descargarArchivoXLSX(cadenaBase64: string): void {
      const workbook: XLSX.WorkBook = XLSX.read(cadenaBase64, { type: 'base64' });
      const archivoBlob = this.convertirWorkbookABlob(workbook);
      saveAs(archivoBlob, 'vehiculos.xlsx');
    }
    private convertirWorkbookABlob(workbook: XLSX.WorkBook): Blob {
      const workbookArray = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
      return new Blob([workbookArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }

    cargarArchivoXLSX(archivo: File, numeroPoliza: string){
      const endpoint = `/api/v1/vehiculos/importar`
      const formData = new FormData()
      formData.append('archivo', archivo)
      formData.append('poliza', numeroPoliza)
      return this.http.post<any>(
        `${this.host}${endpoint}`, 
        formData, 
        { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
      )
    }

    cargarArchivoPDF(archivo: File){
      const endpoint = `/api/v1/archivos`
      const formData = new FormData()
      formData.append('archivo', archivo)
      return this.http.post<ArchivoGuardado>(
        `${this.host}${endpoint}`, 
        formData, 
        { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
      )
    }
    
}