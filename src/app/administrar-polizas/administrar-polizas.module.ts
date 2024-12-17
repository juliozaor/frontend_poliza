import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdministrarPolizasComponent } from './administrar-polizas.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { PipesModule } from '../pipes/pipes.module';
import { FondoResponsabilidadComponent } from './componentes/polizas/fondo-responsabilidad/fondo-responsabilidad.component';
import { AutenticacionModule } from '../autenticacion/autenticacion.module';
import { PolizasComponent } from './componentes/polizas/polizas.component';
import { VehiculosComponent } from './componentes/polizas/vehiculos/vehiculos.component';
import { ModalCapacidadComponent } from './componentes/polizas/modal/modal-capacidad/modal-capacidad.component';
import { TemplatesModule } from '../templates/templates.module';
import { PolizasContractualesComponent } from './componentes/polizas/polizas-contractuales/polizas-contractuales.component';
import { PolizasExtracontractualesComponent } from './componentes/polizas/polizas-extracontractuales/polizas-extracontractuales.component';
import { ListarVehiculosComponent } from './componentes/polizas/listar-vehiculos/listar-vehiculos.component';
import { GestionarPolizasComponent } from './componentes/gestionar-polizas/gestionar-polizas.component';
import { GestionarPlacasaComponent } from './componentes/gestionar-placasa/gestionar-placasa.component';
import { ActualizarPolizaComponent } from './componentes/actualizar-poliza/actualizar-poliza.component';

@NgModule({
    declarations: [
        AdministrarPolizasComponent,
        FondoResponsabilidadComponent,
        PolizasComponent,
        VehiculosComponent,
        ModalCapacidadComponent,
        PolizasContractualesComponent,
        PolizasExtracontractualesComponent,
        ListarVehiculosComponent,
        GestionarPolizasComponent,
        GestionarPlacasaComponent,
        ActualizarPolizaComponent,
    ],
    imports: [
        CommonModule,
        InputsModule,
        NgbModule,
        AlertasModule,
        PipesModule,
        ReactiveFormsModule,
        FormsModule,
        AutenticacionModule,
        TemplatesModule,
    ],
    providers: [DatePipe]
})
export class AdministrarPolizasModule{ }
