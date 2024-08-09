import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantillaComponent } from './administrador/componentes/plantilla/plantilla.component';
import { InicioSesionComponent } from './autenticacion/componentes/inicio-sesion/inicio-sesion.component';
import { ActualizarContrasenaComponent } from './autenticacion/componentes/actualizar-contrasena/actualizar-contrasena.component';
import { AutenticacionGuard } from './guards/autenticacion.guard';
import { PaginaInformacionGeneralVigiladoComponent } from './administrador/paginas/pagina-informacion-general-vigilado/pagina-informacion-general-vigilado.component';
import { PaginaSoporteComponent } from './administrador/paginas/pagina-soporte/pagina-soporte.component';
import { PaginaSoportesComponent } from './soportes/paginas/pagina-soportes/pagina-soportes.component';
import { PaginaResponderSoporteComponent } from './soportes/paginas/pagina-responder-soporte/pagina-responder-soporte.component';
import { SoporteAccesoComponent } from './autenticacion/componentes/soporte-acceso/soporte-acceso.component';
import { AdministrarPolizasComponent } from './administrar-polizas/administrar-polizas.component';
import { PaginaCrearUsuarioComponent } from './usuarios/paginas/pagina-crear-usuario/pagina-crear-usuario.component';
import { VehiculosComponent } from './administrar-polizas/componentes/polizas/vehiculos/vehiculos.component';
import { AseguradoraComponent } from './aseguradoras/aseguradora/aseguradora.component';
import { PolizasContractualesComponent } from './administrar-polizas/componentes/polizas/polizas-contractuales/polizas-contractuales.component';
import { PolizasExtracontractualesComponent } from './administrar-polizas/componentes/polizas/polizas-extracontractuales/polizas-extracontractuales.component';
import { PolizasComponent } from './administrar-polizas/componentes/polizas/polizas.component';
import { GestionarPlacasaComponent } from './administrar-polizas/componentes/gestionar-placasa/gestionar-placasa.component';
import { GestionarPolizasComponent } from './administrar-polizas/componentes/gestionar-polizas/gestionar-polizas.component';



const routes: Routes = [
  {
    path: 'administrar',
    component: PlantillaComponent,
    canActivate: [AutenticacionGuard],
    children: [
      {
        path: 'informacion-general',
        component: PaginaInformacionGeneralVigiladoComponent
      },
      {
        path: 'crear-usuarios',
        component: PaginaCrearUsuarioComponent
      },
      {
        path: 'administrar-poliza',
        component: PolizasComponent
      },
      {
        path: 'crear-polizas',
        component: PolizasComponent
      },
      {
        path: 'gestionar-polizas',
        component: GestionarPolizasComponent
      },
      {
        path: 'gestionar-placas',
        component: GestionarPlacasaComponent
      },
      {
        path: 'administrar-poliza/polizas-contractuales',
        component: PolizasContractualesComponent
      },
      {
        path: 'administrar-poliza/polizas-extracontractuales',
        component: PolizasExtracontractualesComponent
      },
      {
        path: 'soporte',
        component: PaginaSoporteComponent
      },
      {
        path: 'responder-soporte/:idSoporte/:estado',
        component: PaginaResponderSoporteComponent
      },
      {
        path: 'soportes/:estado',
        component: PaginaSoportesComponent
      },
      {
        path: 'vehiculos',
        component: VehiculosComponent
      },
      {
        path: 'aseguradoras',
        component: AseguradoraComponent
      }
    ]
  },
  {
    path: 'inicio-sesion',
    component: InicioSesionComponent
  },
  {
    path: 'actualizar-contrasena',
    component: ActualizarContrasenaComponent
  },
  {
    path: 'soporte',
    component: SoporteAccesoComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'inicio-sesion'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
