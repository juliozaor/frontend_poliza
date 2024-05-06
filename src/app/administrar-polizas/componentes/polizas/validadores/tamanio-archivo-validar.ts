import { AbstractControl, ValidatorFn } from "@angular/forms";

export function tamanioValido(archivo: File, tamanioMaximoMb: number): boolean{
  if(tamanioMaximoMb){
    return tamanioMaximoMb * 1000000 > archivo.size ? true : false
  }else{
    return true
  }
}
