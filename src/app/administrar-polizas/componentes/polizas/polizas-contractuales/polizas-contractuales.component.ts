import { Component, ViewChild } from '@angular/core';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { Aseguradoras } from 'src/app/administrar-polizas/modelos/aseguradoras';
import { amparos } from 'src/app/administrar-polizas/modelos/amparos';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicioAdministrarPolizas } from 'src/app/administrar-polizas/servicios/administrar-polizas.service';
import { valorCeroValidar } from '../validadores/cero-validacion';
import { maxLengthNumberValidator } from '../validadores/maximo-validador';
import { negativoValidar } from '../validadores/negativo-verificar';
import Swal from 'sweetalert2';
import { fechaValida } from '../validadores/fecha-validador';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { CaratulaModel, PolizaContractualModel, ResponsabilidadModel } from 'src/app/administrar-polizas/modelos/guardarPoliza';
import { capasValidator } from '../validadores/capas-validacion';
import { HttpErrorResponse } from '@angular/common/http';
import { tamanioValido } from '../validadores/tamanio-archivo-validar';

@Component({
  selector: 'app-polizas-contractuales',
  templateUrl: './polizas-contractuales.component.html',
  styleUrls: ['./polizas-contractuales.component.css']
})
export class PolizasContractualesComponent {

  base64String!: string
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

  formContractual: FormGroup;
  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
  ) {
    //-- Formulario Responsabilidad contractual
    this.formContractual = new FormGroup({
      numeroPolizaC: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(18), valorCeroValidar(), negativoValidar()]),
      aseguradorasC: new FormControl("", [Validators.required]),
      vigenciaPolizaInicioC: new FormControl(undefined, [Validators.required]),
      vigenciaPolizaFinalC: new FormControl(undefined, [Validators.required]),
      //----- Amparos basicos -----//
      valorAseguradoAB1: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAB1: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAB1: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAB2: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAB2: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAB2: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAB3: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAB3: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(),  */negativoValidar()]),
      deducibleAB3: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAB4: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(),  */negativoValidar()]),
      limitesAB4: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAB4: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      //----- Amparos adicionales -----//
      valorAseguradoAA5: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAA5: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAA5: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAA6: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAA6: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAA6: new FormControl(undefined, [ /* Validators.required,  */ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAA7: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAA7: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAA7: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      valorAseguradoAA8: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      limitesAA8: new FormControl(undefined, [Validators.required, maxLengthNumberValidator(3), /* valorCeroValidar(), */ negativoValidar()]),
      deducibleAA8: new FormControl(undefined, [ /* Validators.required, */ maxLengthNumberValidator(3), negativoValidar()]),
      //----- Cargue de archivos -----//
      cargarExcel: new FormControl(undefined, [Validators.required]),
      cargarPDF: new FormControl(undefined, [Validators.required]),
      //----- Responsabilidad -----//
      checkResponsabilidadC: new FormControl(false),
      checkNoResponsabilidadC: new FormControl(false),
      fechaConstitucion: new FormControl(undefined),
      numeroResolucion: new FormControl(undefined),
      fechaResolucion: new FormControl(undefined),
      valorReserva: new FormControl(undefined),
      fechaCorteReserva: new FormControl(undefined),
      infoComplementaria: new FormControl(undefined),
      capas: new FormControl(undefined),
      capa1: new FormControl(undefined),
      capa2: new FormControl(undefined),
    })
    this.formContractual.get('checkResponsabilidadC')?.enable()
  }

  ngOnInit(): void {
    this.deshabilitarFormularios()
    this.obtenerAseguradora()
  }
  fechasVerificar(tipoPoliza: number) {
    const controlC = this.formContractual.controls

    if (tipoPoliza == 1) {
      if (controlC['vigenciaPolizaInicioC'].value && controlC['vigenciaPolizaFinalC'].value) {
        if (controlC['vigenciaPolizaInicioC'].value >= controlC['vigenciaPolizaFinalC'].value) {
          controlC['vigenciaPolizaInicioC'].setValue('')
          controlC['vigenciaPolizaFinalC'].setValue('')
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
      if (tipoPoliza == 1) {
        this.formContractual.controls[event.target.name].setValue('')
      }
    }
  }

  respuestaNoResponsabilidad(tipoPoliza: number) {
    const controlC = this.formContractual.controls
    if (tipoPoliza == 1) {
      if (controlC['checkNoResponsabilidadC'].value) {
        controlC['checkResponsabilidadC'].disable()
        controlC['checkResponsabilidadC'].setValue(false)
      } else {
        controlC['checkResponsabilidadC'].enable()
        controlC['checkResponsabilidadC'].setValue(false)
      }
    }
  }

  deshabilitarFormularios() {
    this.servicioAdministrarPoliza.obtenerEstadoVigilado().subscribe({
      next: (deshabilitado: any) => {
        if (deshabilitado.enviado) {
          this.deshabilitado = deshabilitado.enviado
          this.formContractual.disable()
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
    if (tipoPoliza == 1) { this.formContractual.controls['cargarExcel'].reset() }
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
    if (tipoPoliza == 1) {
      if (this.formContractual.controls['checkResponsabilidadC'].value) {
        console.log(this.formContractual.controls['checkResponsabilidadC'].value);
        this.fondoResponsabilidadC = this.formContractual.controls['checkResponsabilidadC'].value
        this.formContractual.controls['checkNoResponsabilidadC'].disable()
        //this.formContractual.get('checkResponsabilidadC')?.disable()
        this.formContractual.get('fechaConstitucion')?.setValidators([Validators.required])
        this.formContractual.get('numeroResolucion')?.setValidators([Validators.required, maxLengthNumberValidator(18), negativoValidar(), valorCeroValidar()])
        this.formContractual.get('fechaResolucion')?.setValidators([Validators.required])
        this.formContractual.get('valorReserva')?.setValidators([Validators.required, maxLengthNumberValidator(4), negativoValidar(), valorCeroValidar()])
        this.formContractual.get('fechaCorteReserva')?.setValidators([Validators.required])
        this.formContractual.get('infoComplementaria')?.setValidators([Validators.required])
        this.formContractual.get('capas')?.setValidators([Validators.required, capasValidator()])
        this.formContractual.get('capa1')?.setValidators([Validators.required, maxLengthNumberValidator(4), negativoValidar(), valorCeroValidar()])
        this.formContractual.get('capa2')?.setValidators([Validators.required, maxLengthNumberValidator(4), negativoValidar(), valorCeroValidar()])
      } else {
        this.fondoResponsabilidadC = this.formContractual.controls['checkResponsabilidadC'].value
        console.log(this.formContractual.controls['checkResponsabilidadC'].value, this.fondoResponsabilidadC);
        this.formContractual.controls['checkNoResponsabilidadC'].enable()
        this.formContractual.get('checkResponsabilidadC')?.setValue(false); this.formContractual.get('checkResponsabilidadE')?.updateValueAndValidity()
        this.formContractual.get('fechaConstitucion')?.clearValidators(); this.formContractual.get('fechaConstitucion')?.updateValueAndValidity()
        this.formContractual.get('numeroResolucion')?.clearValidators(); this.formContractual.get('numeroResolucion')?.updateValueAndValidity()
        this.formContractual.get('fechaResolucion')?.clearValidators(); this.formContractual.get('fechaResolucion')?.updateValueAndValidity()
        this.formContractual.get('valorReserva')?.clearValidators(); this.formContractual.get('valorReserva')?.updateValueAndValidity()
        this.formContractual.get('fechaCorteReserva')?.clearValidators(); this.formContractual.get('fechaCorteReserva')?.updateValueAndValidity()
        this.formContractual.get('infoComplementaria')?.clearValidators(); this.formContractual.get('infoComplementaria')?.updateValueAndValidity()
        this.formContractual.get('capas')?.clearValidators(); this.formContractual.get('capas')?.updateValueAndValidity()
        this.formContractual.get('capa1')?.clearValidators(); this.formContractual.get('capa1')?.updateValueAndValidity()
        this.formContractual.get('capa2')?.clearValidators(); this.formContractual.get('capa2')?.updateValueAndValidity()
        this.formContractual.get('fechaConstitucion')?.reset()
        this.formContractual.get('numeroResolucion')?.reset()
        this.formContractual.get('fechaResolucion')?.reset()
        this.formContractual.get('valorReserva')?.reset()
        this.formContractual.get('fechaCorteReserva')?.reset()
        this.formContractual.get('infoComplementaria')?.reset()
        this.formContractual.get('capas')?.reset()
        this.formContractual.get('capa1')?.reset()
        this.formContractual.get('capa2')?.reset()
      }
    } 
  }
}
