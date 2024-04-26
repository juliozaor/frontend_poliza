import { Component, OnInit, ViewChild } from '@angular/core';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { FiltrosUsuarios } from '../../modelos/FiltrosUsuarios';
import { ServicioUsuarios } from '../../servicios/usuarios.service';
import { Observable } from 'rxjs';
import { Usuario } from '../../modelos/Usuario';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { ModalActualizarUsuarioComponent } from '../../componentes/modal-actualizar-usuario/modal-actualizar-usuario.component';
import { Rol } from '../../modelos/Rol';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { Departamento } from '../../modelos/Departamento';
import { Ciudad } from '../../modelos/Ciudad';

@Component({
  selector: 'app-pagina-crear-usuario',
  templateUrl: './pagina-crear-usuario.component.html',
  styleUrls: ['./pagina-crear-usuario.component.css']
})
export class PaginaCrearUsuarioComponent implements OnInit{
  @ViewChild('modalActualizarUsuario') modalActualizarUsuario!: ModalActualizarUsuarioComponent
  @ViewChild('popup') popup!: PopupComponent
  paginador: Paginador<FiltrosUsuarios>
  usuarios: Usuario[] = []
  termino: string = ""
  rol: string = ""
  roles: Rol[] = []
  formulario: FormGroup

  /* cargo: string = ""
  departamentos: Departamento[] = []
  municipios: Ciudad[] = [] */

  constructor(
    private servicio: ServicioUsuarios
  ){
    this.paginador = new Paginador<FiltrosUsuarios>(this.obtenerUsuarios)
    this.formulario = new FormGroup({
      nombre: new FormControl(undefined, [ Validators.required ]),
      apellido: new FormControl(undefined),
      /* cargo: new FormControl("", [ Validators.required ]), */
      identificacion: new FormControl(undefined, [ Validators.required ]),
      fechaNacimiento: new FormControl(undefined, [ Validators.required ]),
      correo: new FormControl(undefined, [ Validators.required, Validators.email ]),
      telefono: new FormControl(undefined),
      rol: new FormControl("", [ Validators.required ]),
      /* departamento: new FormControl("", [Validators.required]),
      municipio: new FormControl("", [Validators.required]) */
    })
  }

  ngOnInit(): void {
    this.paginador.inicializar(1, 5)
    this.obtenerRoles()
    /* this.obtenerDepartamentos()
    this.formulario.controls['departamento'].valueChanges.subscribe({
      next: (idDepartamento)=>{
        if(idDepartamento && idDepartamento !== ""){
          this.obtenerMunicipios(idDepartamento)
        }else{
          this.municipios = []
        }
      }
    }) */
  }

  obtenerUsuarios = (pagina: number, limite: number, filtros?: FiltrosUsuarios)=>{
    return new Observable<Paginacion>( subscripcion => {
      this.servicio.listar(pagina, limite, filtros).subscribe({
        next: (respuesta)=>{
          this.usuarios = respuesta.usuarios
          subscripcion.next(respuesta.paginacion) 
        }
      })
    })
  }

  manejarUsuarioActualizado(){
    this.paginador.refrescar()
    this.popup.abrirPopupExitoso('Usuario actualizado con éxito.')
  }

  crear(){
    if(this.formulario.invalid){
      //console.log("aqui llega")
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const controls = this.formulario.controls
    this.servicio.guardar({
      nombre: controls['nombre'].value,
      apellido: controls['apellido'].value,
      identificacion: controls['identificacion'].value,
      telefono: controls['telefono'].value,
      correo: controls['correo'].value,
      fechaNacimiento: controls['fechaNacimiento'].value,
      idRol: controls['rol'].value
    }).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso("Usuario creado con éxito.")
        this.paginador.refrescar()
        this.limpiarFormulario()
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al crear el usuario", "Intentalo más tarde.")
      }
    })
  }

  actualizarFiltros(){
    this.paginador.filtrar({
      termino: this.termino,
      rol: this.rol
    })
  }

  limpiarFiltros(){
    this.termino = ""
    this.rol = ""
    this.paginador.filtrar({})
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('rol')!.setValue("")
  }

  abrirModalActualizarUsuario(usuario: Usuario){
    this.modalActualizarUsuario.abrir(usuario)
  }

  obtenerRoles(){
    this.servicio.listarRoles().subscribe({
      next: (respuesta) => {
        this.roles = respuesta.rols
      }
    })
  }

  /* obtenerDepartamentos(){
    this.servicioDepartamento.obtenerDepartamentos().subscribe({
      next: (departamentos)=>{
        this.departamentos = departamentos
      }
    })
  }

  obtenerMunicipios(departamentoId: number){
    this.servicioDepartamento.obtenerCiudades(departamentoId).subscribe({
      next: (municipios)=>{
        this.municipios = municipios 
      }
    })
  } */

}
