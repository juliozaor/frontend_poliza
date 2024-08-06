import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { maxLengthNumberValidator } from '../validadores/maximo-validador';
import { valorCeroValidar } from '../validadores/cero-validacion';
import { negativoValidar } from '../validadores/negativo-verificar';
import { capasValidator } from '../validadores/capas-validacion';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { tamanioValido } from '../validadores/tamanio-archivo-validar';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { CaratulaModel, PolizaContractualModel, PolizaExtracontractualModel, ResponsabilidadModel } from 'src/app/administrar-polizas/modelos/guardarPoliza';
import { fechaValida } from '../validadores/fecha-validador';
import { ServicioAdministrarPolizas } from 'src/app/administrar-polizas/servicios/administrar-polizas.service';
import { amparos } from 'src/app/administrar-polizas/modelos/amparos';
import { Aseguradoras } from 'src/app/administrar-polizas/modelos/aseguradoras';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ModalCapacidadComponent } from '../modal/modal-capacidad/modal-capacidad.component';

@Component({
  selector: 'app-polizas-extracontractuales',
  templateUrl: './polizas-extracontractuales.component.html',
  styleUrls: ['./polizas-extracontractuales.component.css']
})
export class PolizasExtracontractualesComponent {

  base64String!: string
  archivoCargado: string = ""
  archivoPDF?: ArchivoGuardado
  obligatorio: boolean = false
  deshabilitado: boolean = false

  desplegarRCC: boolean = true
  desplegarRCE: boolean = true
  desplegarAmparosB1: boolean = true
  desplegarAmparosA1: boolean = true
  desplegarAmparosB2: boolean = true
  desplegarAmparosA2: boolean = true
  fondoResponsabilidadC: boolean = false
  fondoResponsabilidadE: boolean = false

  aseguradoras: Aseguradoras[] = []

  amparosBasicosC: amparos[] = [
    { nombre: 'Muerte Accidental', id: '1' },
    { nombre: 'Incapacidad Temporal', id: '2' },
    { nombre: 'Incapacidad Permanente', id: '3' },
    { nombre: 'Gastos Médicos Hospitalarios', id: '4' }
  ]
  amparosBasicosE: amparos[] = [
    { nombre: 'Daños a bienes de terceros', id: '5' },
    { nombre: 'Lesiones o Muerte a 1 persona', id: '6' },
    { nombre: 'Lesiones o Muerte a 2 o mas personas', id: '7' }
  ]
  amparosAdicionales: amparos[] = [
    { nombre: 'Amparo patrimonial', id: '8' },
    { nombre: 'Asistencia Juridica en proceso penal y civil', id: '9' },
    { nombre: 'Perjuicios patrimoniales y extrapatrimoniales', id: '10' },
    { nombre: 'Otras', id: '11' }
  ]

  formExtracontractual: FormGroup;

  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
  ) {
    
    this.formExtracontractual = new FormGroup({
      numeroPolizaE: new FormControl(undefined, [maxLengthNumberValidator(18), valorCeroValidar(), negativoValidar()]),
      aseguradorasE: new FormControl("",),
      vigenciaPolizaInicioE: new FormControl(undefined,),
      vigenciaPolizaFinalE: new FormControl(undefined,),
      //----- Amparos basicos -----//
      valorAseguradoAB9: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAB9: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAB9: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAB10: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAB10: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAB10: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAB11: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAB11: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAB11: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      //----- Amparos adicionales -----//
      valorAseguradoAA12: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAA12: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAA12: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAA13: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAA13: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAA13: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAA14: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAA14: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAA14: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAA15: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAA15: new FormControl(undefined, [maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAA15: new FormControl(undefined, [maxLengthNumberValidator(3), negativoValidar()]),
      //----- Cargue de archivos -----//
      cargarExcel: new FormControl(undefined,),
      cargarPDF: new FormControl(undefined,),
      //----- Responsabilidad -----//
      checkResponsabilidadE: new FormControl(false),
      checkNoResponsabilidadE: new FormControl(false),
      fechaConstitucion: new FormControl(undefined),
      numeroResolucion: new FormControl(undefined),
      fechaResolucion: new FormControl(undefined),
      valorReserva: new FormControl(undefined),
      fechaCorteReserva: new FormControl(undefined,),
      infoComplementaria: new FormControl(undefined,),
      capas: new FormControl(undefined),
      capa1: new FormControl(undefined),
      capa2: new FormControl(undefined),
    })
    this.formExtracontractual.get('checkResponsabilidadE')?.disable()
  }

  ngOnInit(): void {
    this.deshabilitarFormularios()
    this.obtenerAseguradora()
  }
  fechasVerificar(tipoPoliza: number) {

    const controlE = this.formExtracontractual.controls
      if (tipoPoliza == 2) {
      if (controlE['vigenciaPolizaInicioE'].value && controlE['vigenciaPolizaFinalE'].value) {
        if (controlE['vigenciaPolizaInicioE'].value >= controlE['vigenciaPolizaFinalE'].value) {
          controlE['vigenciaPolizaInicioE'].setValue('')
          controlE['vigenciaPolizaFinalE'].setValue('')
          Swal.fire({
            titleText: "El inicio de la fecha de vigencia no puede ser posterior o igual a la fecha final de vigencia.",
            icon: "error"
          })
        }
      }
    }
  }

  fechaValida(event: any, tipoPoliza: number) {
    if (fechaValida(event)) {
      Swal.fire({
        titleText: "La fecha ingresada no puede ser superior o igual a la fecha actual",
        icon: "error"
      })
      console.log(event.target.name);
      if (tipoPoliza == 2) {
        this.formExtracontractual.controls[event.target.name].setValue('')
      }
    }
  }

  respuestaNoResponsabilidad(tipoPoliza: number) {
    const controlE = this.formExtracontractual.controls
    if (tipoPoliza == 2) {
      //console.log(controlC['checkNoResponsabilidadC'].value);
      if (controlE['checkNoResponsabilidadE'].value) {
        controlE['checkResponsabilidadE'].disable()
        controlE['checkResponsabilidadE'].setValue(false)
      } else {
        controlE['checkResponsabilidadE'].enable()
        controlE['checkResponsabilidadE'].setValue(false)
      }
    }
  }

  deshabilitarFormularios() {
    this.servicioAdministrarPoliza.obtenerEstadoVigilado().subscribe({
      next: (deshabilitado: any) => {
        if (deshabilitado.enviado) {
          this.deshabilitado = deshabilitado.enviado
          this.formExtracontractual.disable()
          Swal.fire({
            titleText: "¡Usted ya envió a la Superintendencia de Transporte",
            icon: "info"
          })
        }
      }
    })
  }

  obtenerAseguradora() {
    this.servicioAdministrarPoliza.obtenerAseguradora().subscribe({
      next: (aseguradora: any) => {
        this.aseguradoras = aseguradora['aseguradoras']
      }
    })
  }

  cambiarNumeroPoliza(tipoPoliza: number) {
    if (tipoPoliza == 2) { this.formExtracontractual.controls['cargarExcel'].setValue('') }
  }

  alternarDesplegarRCC() {
    this.desplegarRCC = !this.desplegarRCC
  }
  alternarDesplegarRCE() {
    this.desplegarRCE = !this.desplegarRCE
  }
  alternarDesplegarAB(tipoPoliza: number) {
    if (tipoPoliza == 1) { this.desplegarAmparosB1 = !this.desplegarAmparosB1 }
    if (tipoPoliza == 2) { this.desplegarAmparosB2 = !this.desplegarAmparosB2 }
  }
  alternarDesplegarAA(tipoPoliza: number) {
    if (tipoPoliza == 1) { this.desplegarAmparosA1 = !this.desplegarAmparosA1 }
    if (tipoPoliza == 2) { this.desplegarAmparosA2 = !this.desplegarAmparosA2 }
  }

  DesplegarFondoResponsabilidad(tipoPoliza: number) {
    if (tipoPoliza == 2) {
      if (this.formExtracontractual.controls['checkResponsabilidadE'].value) {
        this.fondoResponsabilidadE = this.formExtracontractual.controls['checkResponsabilidadE'].value
        this.formExtracontractual.get('checkNoResponsabilidadE')?.disable()
        this.formExtracontractual.get('fechaConstitucion')?.setValidators([Validators.required])
        this.formExtracontractual.get('numeroResolucion')?.setValidators([Validators.required, maxLengthNumberValidator(18), negativoValidar(), valorCeroValidar()])
        this.formExtracontractual.get('fechaResolucion')?.setValidators([Validators.required])
        this.formExtracontractual.get('valorReserva')?.setValidators([Validators.required, maxLengthNumberValidator(4), negativoValidar(), valorCeroValidar()])
        this.formExtracontractual.get('fechaCorteReserva')?.setValidators([Validators.required])
        this.formExtracontractual.get('infoComplementaria')?.setValidators([Validators.required])
        this.formExtracontractual.get('capas')?.setValidators([Validators.required, capasValidator()])
        this.formExtracontractual.get('capa1')?.setValidators([Validators.required, maxLengthNumberValidator(4), negativoValidar(), valorCeroValidar()])
        this.formExtracontractual.get('capa2')?.setValidators([Validators.required, maxLengthNumberValidator(4), negativoValidar(), valorCeroValidar()])
      } else {
        this.fondoResponsabilidadE = this.formExtracontractual.controls['checkResponsabilidadE'].value
        if (this.formExtracontractual.controls['numeroPolizaE'].value) {
          this.formExtracontractual.get('checkNoResponsabilidadE')?.enable()
        }
        this.formExtracontractual.get('checkResponsabilidadE')?.setValue(false); this.formExtracontractual.get('checkResponsabilidadE')?.updateValueAndValidity()
        this.formExtracontractual.get('fechaConstitucion')?.clearValidators(); this.formExtracontractual.get('fechaConstitucion')?.updateValueAndValidity()
        this.formExtracontractual.get('numeroResolucion')?.clearValidators(); this.formExtracontractual.get('numeroResolucion')?.updateValueAndValidity()
        this.formExtracontractual.get('fechaResolucion')?.clearValidators(); this.formExtracontractual.get('fechaResolucion')?.updateValueAndValidity()
        this.formExtracontractual.get('valorReserva')?.clearValidators(); this.formExtracontractual.get('valorReserva')?.updateValueAndValidity()
        this.formExtracontractual.get('fechaCorteReserva')?.clearValidators(); this.formExtracontractual.get('fechaCorteReserva')?.updateValueAndValidity()
        this.formExtracontractual.get('infoComplementaria')?.clearValidators(); this.formExtracontractual.get('infoComplementaria')?.updateValueAndValidity()
        this.formExtracontractual.get('capas')?.clearValidators(); this.formExtracontractual.get('capas')?.updateValueAndValidity()
        this.formExtracontractual.get('capa1')?.clearValidators(); this.formExtracontractual.get('capa1')?.updateValueAndValidity()
        this.formExtracontractual.get('capa2')?.clearValidators(); this.formExtracontractual.get('capa2')?.updateValueAndValidity()
        this.formExtracontractual.get('fechaConstitucion')?.reset()
        this.formExtracontractual.get('numeroResolucion')?.reset()
        this.formExtracontractual.get('fechaResolucion')?.reset()
        this.formExtracontractual.get('valorReserva')?.reset()
        this.formExtracontractual.get('fechaCorteReserva')?.reset()
        this.formExtracontractual.get('infoComplementaria')?.reset()
        this.formExtracontractual.get('capas')?.reset()
        this.formExtracontractual.get('capa1')?.reset()
        this.formExtracontractual.get('capa2')?.reset()
      }
    }
  }

  numeroPolizaELleno() {
    if (this.formExtracontractual.controls['numeroPolizaE'].value) {
      this.obligatorio = true
      this.formExtracontractual.get('checkResponsabilidadE')?.enable(); this.formExtracontractual.get('checkNoResponsabilidadE')?.enable()
      this.formExtracontractual.get('numeroPolizaE')?.setValidators([Validators.required, maxLengthNumberValidator(18), valorCeroValidar(), negativoValidar()]); this.formExtracontractual.get('numeroPolizaE')?.updateValueAndValidity()
      this.formExtracontractual.get('aseguradorasE')?.setValidators([Validators.required]); this.formExtracontractual.get('aseguradorasE')?.updateValueAndValidity()
      this.formExtracontractual.get('vigenciaPolizaInicioE')?.setValidators([Validators.required]); this.formExtracontractual.get('vigenciaPolizaInicioE')?.updateValueAndValidity()
      this.formExtracontractual.get('vigenciaPolizaFinalE')?.setValidators([Validators.required]); this.formExtracontractual.get('vigenciaPolizaFinalE')?.updateValueAndValidity()
      //------ Amparos basicos
      /* this.formExtracontractual.get('valorAseguradoAB9')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB9')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB9')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAB10')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB10')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB10')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAB11')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAB11')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB11')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAB11')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB11')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAB11')?.updateValueAndValidity()
       *///------- Amparos Adicionales
      /* this.formExtracontractual.get('valorAseguradoAA12')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAA12')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA12')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAA12')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA12')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAA12')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAA13')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAA13')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA13')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAA13')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA13')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAA13')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAA14')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAA14')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA14')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAA14')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA14')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAA14')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAA15')?.setValidators([ Validators.required ]); this.formExtracontractual.get('valorAseguradoAA15')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA15')?.setValidators([ Validators.required ]); this.formExtracontractual.get('limitesAA15')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA15')?.setValidators([ Validators.required ]); this.formExtracontractual.get('deducibleAA15')?.updateValueAndValidity()
       *///------ Cargar Archivos
      this.formExtracontractual.get('cargarExcel')?.setValidators([Validators.required]); this.formExtracontractual.get('cargarExcel')?.updateValueAndValidity()
      this.formExtracontractual.get('cargarPDF')?.setValidators([Validators.required]); this.formExtracontractual.get('cargarPDF')?.updateValueAndValidity()
    } else {
      this.obligatorio = false
      this.formExtracontractual.get('checkResponsabilidadE')?.disable(); this.formExtracontractual.get('checkNoResponsabilidadE')?.disable()
      this.formExtracontractual.get('numeroPolizaE')?.clearValidators(); this.formExtracontractual.get('numeroPolizaE')?.updateValueAndValidity()
      this.formExtracontractual.get('aseguradorasE')?.clearValidators(); this.formExtracontractual.get('aseguradorasE')?.updateValueAndValidity()
      this.formExtracontractual.get('vigenciaPolizaInicioE')?.clearValidators(); this.formExtracontractual.get('vigenciaPolizaInicioE')?.updateValueAndValidity()
      this.formExtracontractual.get('vigenciaPolizaFinalE')?.clearValidators(); this.formExtracontractual.get('vigenciaPolizaFinalE')?.updateValueAndValidity()
      //------ Amparos basicos
      /* this.formExtracontractual.get('valorAseguradoAB9')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB9')?.clearValidators(); this.formExtracontractual.get('limitesAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB9')?.clearValidators(); this.formExtracontractual.get('deducibleAB9')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAB10')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB10')?.clearValidators(); this.formExtracontractual.get('limitesAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB10')?.clearValidators(); this.formExtracontractual.get('deducibleAB10')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAB11')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAB11')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAB11')?.clearValidators(); this.formExtracontractual.get('limitesAB11')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAB11')?.clearValidators(); this.formExtracontractual.get('deducibleAB11')?.updateValueAndValidity()
       *///------- Amparos Adicionales
      /* this.formExtracontractual.get('valorAseguradoAA12')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAA12')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA12')?.clearValidators(); this.formExtracontractual.get('limitesAA12')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA12')?.clearValidators(); this.formExtracontractual.get('deducibleAA12')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAA13')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAA13')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA13')?.clearValidators(); this.formExtracontractual.get('limitesAA13')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA13')?.clearValidators(); this.formExtracontractual.get('deducibleAA13')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAA14')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAA14')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA14')?.clearValidators(); this.formExtracontractual.get('limitesAA14')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA14')?.clearValidators(); this.formExtracontractual.get('deducibleAA14')?.updateValueAndValidity()
      this.formExtracontractual.get('valorAseguradoAA15')?.clearValidators(); this.formExtracontractual.get('valorAseguradoAA15')?.updateValueAndValidity()
      this.formExtracontractual.get('limitesAA15')?.clearValidators(); this.formExtracontractual.get('limitesAA15')?.updateValueAndValidity()
      this.formExtracontractual.get('deducibleAA15')?.clearValidators(); this.formExtracontractual.get('deducibleAA15')?.updateValueAndValidity()
       *///------ Cargar Archivos
      this.formExtracontractual.get('cargarExcel')?.clearValidators(); this.formExtracontractual.get('cargarExcel')?.updateValueAndValidity()
      this.formExtracontractual.get('cargarPDF')?.clearValidators(); this.formExtracontractual.get('cargarPDF')?.updateValueAndValidity()

      this.formExtracontractual.controls['checkResponsabilidadE'].setValue(false); this.formExtracontractual.get('checkResponsabilidadE')?.updateValueAndValidity()
      this.formExtracontractual.controls['checkNoResponsabilidadE'].setValue(false); this.formExtracontractual.get('checkNoResponsabilidadE')?.updateValueAndValidity()
      this.DesplegarFondoResponsabilidad(2)
    }
  }
}
