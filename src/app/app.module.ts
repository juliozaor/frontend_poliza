import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdministradorModule } from './administrador/administrador.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorAutorizacion } from './administrador/interceptores/InterceptorAutorizacion';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AdministrarPolizasComponent } from './administrar-polizas/administrar-polizas.component';
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';
import { PolizasRccComponent } from './administrar-polizas/componentes/polizas-rcc/polizas-rcc.component';
import { PolizasRceComponent } from './administrar-polizas/componentes/polizas-rce/polizas-rce.component';
import { AmparosBasicosComponent } from './administrar-polizas/componentes/polizas-rcc/amparos/amparos-basicos/amparos-basicos.component';
import { FormsModule } from '@angular/forms';
import { AmparosAdicionalesComponent } from './administrar-polizas/componentes/polizas-rcc/amparos/amparos-adicionales/amparos-adicionales.component';

@NgModule({
  declarations: [
    AppComponent,
    AdministrarPolizasComponent,
    CrearUsuariosComponent,
    PolizasRccComponent,
    PolizasRceComponent,
    AmparosBasicosComponent,
    AmparosAdicionalesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AdministradorModule,
    AutenticacionModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
  ],
  exports:[
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorAutorizacion,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
