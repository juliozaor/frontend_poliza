import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Usuario } from '../../modelos/Usuario';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicioUsuarios } from '../../servicios/usuarios.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { Rol } from '../../modelos/Rol';
import { DateTime } from 'luxon';
import { ServicioDepartamentos } from '../../servicios/departamentos.service';
import { Departamento } from '../../modelos/Departamento';
import { Ciudad } from '../../modelos/Ciudad';

@Component({
  selector: 'app-modal-actualizar-usuario',
  templateUrl: './modal-actualizar-usuario.component.html',
  styleUrls: ['./modal-actualizar-usuario.component.css']
})
export class ModalActualizarUsuarioComponent implements OnInit{
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!: PopupComponent

  @Output('usuarioActualizado') usuarioActualizado: EventEmitter<void>;
  usuario?: Usuario
  formulario: FormGroup
  roles: Rol[] = []
  departamentos: Departamento[] = []
  municipios: Ciudad[] = []

  constructor(
    private servicioModal: NgbModal, 
    private servicio: ServicioUsuarios, 
    private servicioDepartamento: ServicioDepartamentos
  ){
    this.usuarioActualizado = new EventEmitter<void>();
    this.formulario = new FormGroup({
      nombre: new FormControl(undefined, [ Validators.required ]),
      apellido: new FormControl(undefined),
      identificacion: new FormControl(undefined, [ Validators.required ]),
      fechaNacimiento: new FormControl(undefined, [ Validators.required ]),
      correo: new FormControl(undefined, [ Validators.required ]),
      telefono: new FormControl(undefined),
      rol: new FormControl("", [ Validators.required ]),
      departamento: new FormControl("", [Validators.required]),
      municipio: new FormControl("", [Validators.required])
    })
  }

  ngOnInit(): void {
    this.obtenerRoles()
    this.obtenerDepartamentos()
    this.formulario.controls['departamento'].valueChanges.subscribe({
      next: (idDepartamento)=>{
        if(idDepartamento && idDepartamento !== ""){
          this.obtenerMunicipios(idDepartamento)
        }else{
          this.municipios = []
        }
      }
    })
  }

  abrir(usuario: Usuario){
    this.usuario = usuario
    this.rellenarFormulario(usuario)
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  cerrar(){
    this.servicioModal.dismissAll();
  }

  actualizar(){
    console.log(this.formulario.controls)
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const controls = this.formulario.controls
    this.servicio.actualizar(this.usuario!.identificacion, {
      apellido: controls['apellido'].value,
      nombre: controls['nombre'].value,
      correo: controls['correo'].value,
      fechaNacimiento: controls['fechaNacimiento'].value,
      identificacion: controls['identificacion'].value,
      idRol: controls['rol'].value,
      telefono: controls['telefono'].value,
      departamentoId: Number(controls['departamento'].value),
      municipioId: Number(controls['municipio'].value)
    }).subscribe({
      next: ()=>{
        this.usuarioActualizado.emit();
        this.cerrar()
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al actualizar el usuario", "Intentalo más tarde.")
      }
    })
  }

  rellenarFormulario(usuario: Usuario){
    const controls = this.formulario.controls
    controls['apellido'].setValue(usuario.apellido)
    controls['nombre'].setValue(usuario.nombre)
    controls['correo'].setValue(usuario.correo)
    controls['fechaNacimiento'].setValue(
      DateTime.fromISO(usuario.fechaNacimiento).toFormat('yyyy-MM-dd') 
    )
    controls['identificacion'].setValue(usuario.identificacion)
    controls['rol'].setValue(usuario.idRol)
    controls['telefono'].setValue(usuario.telefono)
    controls['departamento'].setValue(usuario.departamentoId)
    controls['municipio'].setValue(usuario.municipioId)
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('rol')!.setValue("")
  }

  obtenerRoles(){
    this.servicio.listarRoles().subscribe({
      next: (respuesta) => {
        this.roles = respuesta.rols
      }
    })
  }

  obtenerDepartamentos(){
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
  }

}
