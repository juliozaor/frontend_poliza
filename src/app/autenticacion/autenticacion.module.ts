import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { HttpClientModule } from '@angular/common/http'
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ModalRecuperacionContrasenaComponent } from './componentes/modal-recuperacion-contrasena/modal-recuperacion-contrasena.component';
import { ActualizarContrasenaComponent } from './componentes/actualizar-contrasena/actualizar-contrasena.component';
import { SoporteAccesoComponent } from './componentes/soporte-acceso/soporte-acceso.component';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { RouterModule } from '@angular/router';
import { TemplatesModule } from '../templates/templates.module';
import { InicioVigia2Component } from './componentes/inicio-vigia2/inicio-vigia2.component';


@NgModule({
  declarations: [
    InicioSesionComponent,
    ModalRecuperacionContrasenaComponent,
    ActualizarContrasenaComponent,
    SoporteAccesoComponent,
    InicioVigia2Component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxCaptchaModule,
    NgbModule,
    InputsModule,
    TemplatesModule,
    SweetAlert2Module.forRoot(),
    AlertasModule,
    RouterModule
  ]
})
export class AutenticacionModule { }
