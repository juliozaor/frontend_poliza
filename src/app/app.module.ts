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
import { PolizasRccComponent } from './administrar-polizas/componentes/polizas-rcc/polizas-rcc.component';
import { PolizasRceComponent } from './administrar-polizas/componentes/polizas-rce/polizas-rce.component';
import { AmparosBasicosComponent } from './administrar-polizas/componentes/polizas-rcc/amparos/amparos-basicos/amparos-basicos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmparosAdicionalesComponent } from './administrar-polizas/componentes/polizas-rcc/amparos/amparos-adicionales/amparos-adicionales.component';
import { FondoResponsabilidadComponent } from './administrar-polizas/componentes/polizas-rcc/fondo-responsabilidad/fondo-responsabilidad.component';
import { FondoResponsabilidadRceComponent } from './administrar-polizas/componentes/polizas-rce/fondo-responsabilidad-rce/fondo-responsabilidad-rce.component';
import { AmparosAdicionalesRceComponent } from './administrar-polizas/componentes/polizas-rce/amparos/amparos-adicionales-rce/amparos-adicionales-rce.component';
import { AmparosBasicosRceComponent } from './administrar-polizas/componentes/polizas-rce/amparos/amparos-basicos-rce/amparos-basicos-rce.component';
import { PaginaCrearUsuarioComponent } from './usuarios/paginas/pagina-crear-usuario/pagina-crear-usuario.component';
import { UsuariosModule } from './usuarios/usuarios.module';

@NgModule({
  declarations: [
    AppComponent,
    AdministrarPolizasComponent,
    PolizasRccComponent,
    PolizasRceComponent,
    AmparosBasicosComponent,
    AmparosAdicionalesComponent,
    FondoResponsabilidadComponent,
    FondoResponsabilidadRceComponent,
    AmparosAdicionalesRceComponent,
    AmparosBasicosRceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AdministradorModule,
    AutenticacionModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    UsuariosModule,
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
