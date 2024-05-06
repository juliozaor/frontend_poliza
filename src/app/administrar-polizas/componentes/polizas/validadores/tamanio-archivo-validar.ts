
export function tamanioValido(archivo: File, tamanioMaximoMb: number){
  const tm  = tamanioMaximoMb * 1048576
  if(archivo.size > tm){
    console.log(archivo.size, " > " ,tm);
    return true
  }else{
    console.log(archivo.size, " < " ,tm);
    return false
  }
}
