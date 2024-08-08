import { Component} from '@angular/core';
import { Aseguradoras } from 'src/app/administrar-polizas/modelos/aseguradoras';
import { amparos } from 'src/app/administrar-polizas/modelos/amparos';
import { FormControl, FormGroup} from '@angular/forms';
import { ServicioAdministrarPolizas } from 'src/app/administrar-polizas/servicios/administrar-polizas.service';

@Component({
  selector: 'app-polizas-contractuales',
  templateUrl: './polizas-contractuales.component.html',
  styleUrls: ['./polizas-contractuales.component.css']
})
export class PolizasContractualesComponent {

  base64String!: string

  desplegarRCC: boolean = true
  desplegarAmparosB1: boolean = true
  desplegarAmparosA1: boolean = true
  desplegarAmparosB2: boolean = true
  desplegarAmparosA2: boolean = true
  fondoResponsabilidadC: boolean = false
  polizaLocalStorage = localStorage.getItem('poliza');
  aseguradoras: Aseguradoras[] = []

  numeroPoliza:any
  tipoPoliza:any = 1

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
      numeroPolizaC: new FormControl(undefined),
      aseguradorasC: new FormControl(""),
      vigenciaPolizaInicioC: new FormControl(undefined),
      vigenciaPolizaFinalC: new FormControl(undefined),
      //----- Amparos basicos -----//
      valorAseguradoAB1: new FormControl(undefined),
      limitesAB1: new FormControl(undefined),
      deducibleAB1: new FormControl(undefined),
      valorAseguradoAB2: new FormControl(undefined),
      limitesAB2: new FormControl(undefined),
      deducibleAB2: new FormControl(undefined),
      valorAseguradoAB3: new FormControl(undefined),
      limitesAB3: new FormControl(undefined),
      deducibleAB3: new FormControl(undefined),
      valorAseguradoAB4: new FormControl(undefined),
      limitesAB4: new FormControl(undefined),
      deducibleAB4: new FormControl(undefined),
      //----- Amparos adicionales -----//
      valorAseguradoAA5: new FormControl(undefined),
      limitesAA5: new FormControl(undefined),
      deducibleAA5: new FormControl(undefined),
      valorAseguradoAA6: new FormControl(undefined),
      limitesAA6: new FormControl(undefined),
      deducibleAA6: new FormControl(undefined),
      valorAseguradoAA7: new FormControl(undefined),
      limitesAA7: new FormControl(undefined),
      deducibleAA7: new FormControl(undefined),
      valorAseguradoAA8: new FormControl(undefined),
      limitesAA8: new FormControl(undefined),
      deducibleAA8: new FormControl(undefined),
      //----- Cargue de archivos -----//
      cargarExcel: new FormControl(undefined),
      cargarPDF: new FormControl(undefined),
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
    this.formContractual.disable()
  }

  ngOnInit(): void {
    this.obtenerAseguradora();
    this.llenarFormulario();

  }

  formatearFecha(fechaString: string): string {
    return new Date(fechaString).toISOString().split('T')[0];
  }

  obtenerAseguradora() {
    this.servicioAdministrarPoliza.obtenerAseguradora().subscribe({
      next: (aseguradora: any) => {
        this.aseguradoras = aseguradora['aseguradoras']
      }
    })
  }

  llenarFormulario() {
    if (this.polizaLocalStorage) {
      const poliza = JSON.parse(this.polizaLocalStorage);
      const controlC = this.formContractual.controls;
      this.numeroPoliza = poliza.numero
    //-- Responsabilidad contractual
        controlC['numeroPolizaC'].setValue(poliza.numero);
        controlC['aseguradorasC'].setValue(poliza.aseguradoraId);
        controlC['vigenciaPolizaInicioC'].setValue(this.formatearFecha(poliza.inicioVigencia));
        controlC['vigenciaPolizaFinalC'].setValue(this.formatearFecha(poliza.finVigencia));
      //----- Amparos basicos -----//
        controlC['valorAseguradoAB1'].setValue(poliza.amparos[0].valorAsegurado);
        controlC['limitesAB1'].setValue(poliza.amparos[0].limite);
        controlC['deducibleAB1'].setValue(poliza.amparos[0].deducible);
        controlC['valorAseguradoAB2'].setValue(poliza.amparos[1].valorAsegurado);
        controlC['limitesAB2'].setValue(poliza.amparos[1].limite);
        controlC['deducibleAB2'].setValue(poliza.amparos[1].deducible);
        controlC['valorAseguradoAB3'].setValue(poliza.amparos[2].valorAsegurado);
        controlC['limitesAB3'].setValue(poliza.amparos[2].limite);
        controlC['deducibleAB3'].setValue(poliza.amparos[2].deducible);
        controlC['valorAseguradoAB4'].setValue(poliza.amparos[3].valorAsegurado);
        controlC['limitesAB4'].setValue(poliza.amparos[3].limite);
        controlC['deducibleAB4'].setValue(poliza.amparos[3].deducible);
        //----- Amparos adicionales -----//
        controlC['valorAseguradoAA5'].setValue(poliza.amparos[4].valorAsegurado);
        controlC['limitesAA5'].setValue(poliza.amparos[4].limite);
        controlC['deducibleAA5'].setValue(poliza.amparos[4].deducible);
        controlC['valorAseguradoAA6'].setValue(poliza.amparos[5].valorAsegurado);
        controlC['limitesAA6'].setValue(poliza.amparos[5].limite);
        controlC['deducibleAA6'].setValue(poliza.amparos[5].deducible);
        controlC['valorAseguradoAA7'].setValue(poliza.amparos[6].valorAsegurado);
        controlC['limitesAA7'].setValue(poliza.amparos[6].limite);
        controlC['deducibleAA7'].setValue(poliza.amparos[6].deducible);
        controlC['valorAseguradoAA8'].setValue(poliza.amparos[7].valorAsegurado);
        controlC['limitesAA8'].setValue(poliza.amparos[7].limite);
        controlC['deducibleAA8'].setValue(poliza.amparos[7].deducible);
      //----- Responsabilidad -----//
      if (poliza.responsabilidad == true) {
        // controlC['checkResponsabilidadC'].enable();
        controlC['checkResponsabilidadC'].setValue(poliza.responsabilidad);
        controlC['checkNoResponsabilidadC'].setValue(false);
        this.DesplegarFondoResponsabilidad();

        controlC['fechaConstitucion'].setValue(this.formatearFecha(poliza.responsabilidades.fechaConstitucion));
        controlC['numeroResolucion'].setValue(poliza.responsabilidades.resolucion);
        controlC['fechaResolucion'].setValue(this.formatearFecha(poliza.responsabilidades.fechaResolucion));
        controlC['valorReserva'].setValue(poliza.responsabilidades.valorReserva);
        controlC['fechaCorteReserva'].setValue(this.formatearFecha(poliza.responsabilidades.fechaReserva));
        controlC['infoComplementaria'].setValue(poliza.responsabilidades.informacion);
        controlC['capas'].setValue(poliza.responsabilidades.operacion);
        controlC['capa1'].setValue(poliza.responsabilidades.valorCumplimiento_uno);
        controlC['capa2'].setValue(poliza.responsabilidades.valorCumplimiento_dos);
      } else {
        controlC['checkResponsabilidadC'].setValue(false);
        // controlC['checkNoResponsabilidadC'].enable();
        controlC['checkNoResponsabilidadC'].setValue(true);
      }

    } else {
      console.error('polizaLocalStorage es null o undefined.');
    }
  }

  DesplegarFondoResponsabilidad() {
      if (this.formContractual.controls['checkResponsabilidadC'].value) {
        console.log(this.formContractual.controls['checkResponsabilidadC'].value);
        this.fondoResponsabilidadC = this.formContractual.controls['checkResponsabilidadC'].value
        this.formContractual.controls['checkNoResponsabilidadC'].disable()
        //this.formContractual.get('checkResponsabilidadC')?.disable()
        this.formContractual.get('fechaConstitucion')
        this.formContractual.get('numeroResolucion')
        this.formContractual.get('fechaResolucion')
        this.formContractual.get('valorReserva')
        this.formContractual.get('fechaCorteReserva')
        this.formContractual.get('infoComplementaria')
        this.formContractual.get('capas')
        this.formContractual.get('capa1')
        this.formContractual.get('capa2')
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
