export interface PolizaPlaca {
  contractual?: Poliza
  extraContractual?: Poliza
  novedades?: Array<Novedades>
}

export interface Poliza {
  id?: number
  existe?: boolean
  placa?: string
  poliza?: string
  estadoPoliza?: any
  fechaCargue?: string
  fechaInicio?: string
  fechaFin?: string
  aseguradora?: string
  vinculada?: boolean
  observacion?: string
  mensaje?: string
}

export interface Novedades {
  placa?: string
  poliza?: string
  tipoPoliza?: 1
  fechaActualizacion?: string
  estado?: string
  observacion?: string
}
