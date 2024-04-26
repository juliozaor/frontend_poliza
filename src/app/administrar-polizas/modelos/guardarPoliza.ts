export interface GuardarPoliza{
    polizaContractual:{
        numero: string
        aseguradoraId: string
        inicioVigencia: string
        finVigencia: string
        amparos:Amparos[]
        responsabilidad: Responsabilidad
        caratula: Caratula
    }
    polizaExtracontractual:{
        numero: string
        aseguradoraId: string
        inicioVigencia: string
        finVigencia: string
        amparos:Amparos[]
        responsabilidad: Responsabilidad
        caratula: Caratula
    }
}

interface Amparos{
    coberturaId: string
    valorAsegurado: string
    limite: string
    deducible: string
}

interface Responsabilidad{
    fechaConstitucion: string
    resolucion: string
    fechaResolucion: string
    valorReserva: string
    fechaReserva: string
    informacion: string
    operacion: string
    valorCumplimientoUno: string
    valorCumplimientoDos: string
}

interface Caratula{
    nombre?: string
    nombreOriginal?: string
    ruta?: string
}