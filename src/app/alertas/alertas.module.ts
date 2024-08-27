import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './componentes/popup/popup.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AlertaComponent } from './componentes/alerta/alerta.component';
import { ValidacionComponent } from './componentes/validacion/validacion.component';
import { LoadingComponent } from './componentes/loading/loading.component';
import { NotificacionComponent } from './componentes/notificacion/notificacion.component';
import { ModalComponent } from './componentes/modal/modal.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertasGovComponent } from './componentes/alertas-gov/alertas-gov.component';
import { AlertasModalGovComponent } from './componentes/alertas-modal-gov/alertas-modal-gov.component';



@NgModule({
  declarations: [
    PopupComponent,
    AlertaComponent,
    ValidacionComponent,
    LoadingComponent,
    NotificacionComponent,
    ModalComponent,
    AlertasGovComponent,
    AlertasModalGovComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    SweetAlert2Module.forRoot()
  ],
  exports:[
    PopupComponent,
    AlertaComponent,
    ValidacionComponent,
    LoadingComponent,
    ModalComponent,
    AlertasGovComponent,
    AlertasModalGovComponent
  ]
})
export class AlertasModule { }
