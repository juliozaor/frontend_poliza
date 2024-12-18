export function validarArchivo(event: Event, tiposPermitidos: string[]): boolean {
  const input = event.target as HTMLInputElement;
  const archivo = input.files?.[0];

  if (archivo) {
    // Verifica si el tipo del archivo está dentro de los tipos permitidos
    if (!tiposPermitidos.includes(archivo.type)) {
      input.value = ''; // Reinicia el input para permitir volver a seleccionar
      return true; // Indica que el archivo no es válido
    }
    return false; // Archivo válido
  }
  return false; // No se seleccionó ningún archivo
}
