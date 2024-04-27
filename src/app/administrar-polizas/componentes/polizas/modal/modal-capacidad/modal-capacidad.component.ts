import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-capacidad',
  templateUrl: './modal-capacidad.component.html',
  styleUrls: ['./modal-capacidad.component.css']
})
export class ModalCapacidadComponent {
  
  form: FormGroup

  constructor(){
    this.form = new FormGroup({})
  }
}
