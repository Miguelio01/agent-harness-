import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, importProvidersFrom } from '@angular/core';
import { FormularioRadicacionComponent } from './app/declaraciones-ica/formulario-radicacion.component';
import { TablaConsultaComponent } from './app/declaraciones-ica/tabla-consulta.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormularioRadicacionComponent, TablaConsultaComponent],
  template: `
    <div class="app-container">
      <h1>Harness de Evaluación de Agentes - Panel Angular</h1>
      <app-formulario-radicacion></app-formulario-radicacion>
      <hr>
      <app-tabla-consulta></app-tabla-consulta>
    </div>
  `
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: []
}).catch(err => console.error(err));
