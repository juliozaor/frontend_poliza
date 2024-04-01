export interface Poliza {
    RCC: AA;
}

//Amparos adicionales
export interface AA {
    descripcion: string;
    estado: boolean;
    id: number;
    nombre: string;
    orden: number;
    tipo_amparo: number;
    tipo_poliza: number;
    tipos_amparos: TiposAmparos;
}

//Amparos basicos
export interface AB {
    descripcion: string;
    estado: boolean;
    id: number;
    nombre: string;
    orden: number;
    tipo_amparo: number;
    tipo_poliza: number;
    tipos_amparos: TiposAmparos;
}

//Tipos de Amparos
export interface TiposAmparos {
    estado: boolean;
    id: number;
    nombre: string;
    orden: number;
}