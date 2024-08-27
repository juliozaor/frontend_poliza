export interface vincularVehiculoPolizaModel{
  numero_poliza?:string;
  tipo_poliza?: number;
  vehiculos?: [
    placa: string,
    pasajeros: number
  ]
}
