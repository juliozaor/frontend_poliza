import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alertas-gov',
  templateUrl: './alertas-gov.component.html',
  styleUrls: ['./alertas-gov.component.css']
})
export class AlertasGovComponent {
  @Input() alert?: 'exito' | 'info' | 'error' | string
  @Input() text?:string
  closeAlert() {
    document.getElementById('closealertcontainer')!.style.display = 'none';
  }
}
