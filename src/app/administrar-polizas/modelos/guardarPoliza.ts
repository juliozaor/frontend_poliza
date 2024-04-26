export interface GuardarPoliza{
    polizaContractual:{
        numero: number
        aseguradoraId: number
        inicioVigencia: Date
        finVigencia: Date
        amparos:Amparos[]
        responsabilidad: Responsabilidad
        caratula: Caratula
    }
    polizaExtracontractual:{
        numero: number
        aseguradoraId: number
        inicioVigencia: Date
        finVigencia: Date
        amparos:Amparos[]
        responsabilidad: Responsabilidad
        caratula: Caratula
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

interface Caratula{
    nombre?: string
    nombreOriginal?: string
    ruta?: string
}