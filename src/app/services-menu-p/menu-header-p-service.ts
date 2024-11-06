import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class MenuHeaderPService {
    /***ingeniero Paolo */
    constructor() {}
    public RutaModelo:string='';
    public RutaActual:string='';
    public OptionMenu:number=0;
    ActivarOpcionMenuPpal(rutaModelo:string,rutaActual:string): boolean
    {
        return true;
    }

    AsginarRutas(rutaModelo:string,rutaActual:string)
    {
        this.RutaActual=rutaActual;
        this.RutaModelo=rutaModelo;
        console.log(this.RutaActual)
       console.log(this.RutaModelo)
    }

    get RutaModuloP()
    {
      return this.RutaModelo
    }

  }