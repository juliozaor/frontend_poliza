import { Component} from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { ServicioAdministrarPolizas } from 'src/app/administrar-polizas/servicios/administrar-polizas.service';
import { amparos } from 'src/app/administrar-polizas/modelos/amparos';
import { Aseguradoras } from 'src/app/administrar-polizas/modelos/aseguradoras';


@Component({
  selector: 'app-polizas-extracontractuales',
  templateUrl: './polizas-extracontractuales.component.html',
  styleUrls: ['./polizas-extracontractuales.component.css']
})
export class PolizasExtracontractualesComponent {

  base64String!: string
  obligatorio: boolean = false

  desplegarRCE: boolean = true
  desplegarAmparosB1: boolean = true
  desplegarAmparosA1: boolean = true
  desplegarAmparosB2: boolean = true
  desplegarAmparosA2: boolean = true
  fondoResponsabilidadE: boolean = false
  polizaLocalStorage = localStorage.getItem('poliza');
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
      numeroPolizaE: new FormControl(undefined),
      aseguradorasE: new FormControl(""),
      vigenciaPolizaInicioE: new FormControl(undefined),
      vigenciaPolizaFinalE: new FormControl(undefined),
      //----- Amparos basicos -----//
      valorAseguradoAB9: new FormControl(undefined),
      limitesAB9: new FormControl(undefined),
      deducibleAB9: new FormControl(undefined),
      valorAseguradoAB10: new FormControl(undefined),
      limitesAB10: new FormControl(undefined),
      deducibleAB10: new FormControl(undefined),
      valorAseguradoAB11: new FormControl(undefined),
      limitesAB11: new FormControl(undefined),
      deducibleAB11: new FormControl(undefined),
      //----- Amparos adicionales -----//
      valorAseguradoAA12: new FormControl(undefined),
      limitesAA12: new FormControl(undefined),
      deducibleAA12: new FormControl(undefined),
      valorAseguradoAA13: new FormControl(undefined),
      limitesAA13: new FormControl(undefined),
      deducibleAA13: new FormControl(undefined),
      valorAseguradoAA14: new FormControl(undefined),
      limitesAA14: new FormControl(undefined),
      deducibleAA14: new FormControl(undefined),
      valorAseguradoAA15: new FormControl(undefined),
      limitesAA15: new FormControl(undefined),
      deducibleAA15: new FormControl(undefined),
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
    this.formExtracontractual.disable()
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
      const controlC = this.formExtracontractual.controls;
    //-- Responsabilidad contractual
        controlC['numeroPolizaE'].setValue(poliza.numero);
        controlC['aseguradorasE'].setValue(poliza.aseguradoraId);
        controlC['vigenciaPolizaInicioE'].setValue(this.formatearFecha(poliza.inicioVigencia));
        controlC['vigenciaPolizaFinalE'].setValue(this.formatearFecha(poliza.finVigencia));
      //----- Amparos basicos -----//
        controlC['valorAseguradoAB9'].setValue(poliza.amparos[0].valorAsegurado);
        controlC['limitesAB9'].setValue(poliza.amparos[0].limite);
        controlC['deducibleAB9'].setValue(poliza.amparos[0].deducible);
        controlC['valorAseguradoAB10'].setValue(poliza.amparos[1].valorAsegurado);
        controlC['limitesAB10'].setValue(poliza.amparos[1].limite);
        controlC['deducibleAB10'].setValue(poliza.amparos[1].deducible);
        controlC['valorAseguradoAB11'].setValue(poliza.amparos[2].valorAsegurado);
        controlC['limitesAB11'].setValue(poliza.amparos[2].limite);
        controlC['deducibleAB11'].setValue(poliza.amparos[2].deducible);
      //----- Amparos adicionales -----//
        controlC['valorAseguradoAA12'].setValue(poliza.amparos[3].valorAsegurado);
        controlC['limitesAA12'].setValue(poliza.amparos[3].limite);
        controlC['deducibleAA12'].setValue(poliza.amparos[3].deducible);
        controlC['valorAseguradoAA13'].setValue(poliza.amparos[4].valorAsegurado);
        controlC['limitesAA13'].setValue(poliza.amparos[4].limite);
        controlC['deducibleAA13'].setValue(poliza.amparos[4].deducible);
        controlC['valorAseguradoAA14'].setValue(poliza.amparos[5].valorAsegurado);
        controlC['limitesAA14'].setValue(poliza.amparos[5].limite);
        controlC['deducibleAA14'].setValue(poliza.amparos[5].deducible);
        controlC['valorAseguradoAA15'].setValue(poliza.amparos[6].valorAsegurado);
        controlC['limitesAA15'].setValue(poliza.amparos[6].limite);
        controlC['deducibleAA15'].setValue(poliza.amparos[6].deducible);

      //----- Responsabilidad -----//
      if (poliza.responsabilidad == true) {
        // controlC['checkResponsabilidadE'].enable();
        controlC['checkResponsabilidadE'].setValue(poliza.responsabilidad);
        controlC['checkNoResponsabilidadE'].setValue(false);
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
        controlC['checkResponsabilidadE'].setValue(false);
        // controlC['checkNoResponsabilidadE'].enable();
        controlC['checkNoResponsabilidadE'].setValue(true);
      }

    } else {
      console.error('polizaLocalStorage es null o undefined.');
    }
  }


  DesplegarFondoResponsabilidad() {
      if (this.formExtracontractual.controls['checkResponsabilidadE'].value) {
        this.fondoResponsabilidadE = this.formExtracontractual.controls['checkResponsabilidadE'].value
        this.formExtracontractual.get('checkNoResponsabilidadE')?.disable()
        this.formExtracontractual.get('fechaConstitucion')
        this.formExtracontractual.get('numeroResolucion')
        this.formExtracontractual.get('fechaResolucion')
        this.formExtracontractual.get('valorReserva')
        this.formExtracontractual.get('fechaCorteReserva')
        this.formExtracontractual.get('infoComplementaria')
        this.formExtracontractual.get('capas')
        this.formExtracontractual.get('capa1')
        this.formExtracontractual.get('capa2')
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
