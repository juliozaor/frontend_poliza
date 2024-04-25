export interface GuardarPoliza{
    modalidadId: number
    polizaContractual:{
        numero: number
        aseguradoraId: number
        inicioVigencia: Date
        finVigencia: Date
        amparos:Amparos[]
        responsabilidad: Responsabilidad
    }
    polizaExtracontractual:{
        numero: number
        aseguradoraId: number
        inicioVigencia: Date
        finVigencia: Date
        amparos:Amparos[]
        responsabilidad: Responsabilidad
    }
}

interface Amparos{
    coberturaId: number
    valorAsegurado: number
    limite: number
    deducible: number
}

interface Responsabilidad{
    fechaConstitucion: Date
    resolucion: number
    fechaResolucion: Date
    valorReserva: number
    fechaReserva: Date
    informacion: string
    operacion: number
    valorCumplimientoUno: number
    valorCumplimientoDos: number
}