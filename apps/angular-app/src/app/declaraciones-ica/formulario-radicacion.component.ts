import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DeclaracionesIcaService } from './declaraciones-ica.service';

@Component({
  selector: 'app-formulario-radicacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>Radicación de ICA (Informática y Tributos)</h2>
      <form [formGroup]="radicacionForm" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <label>NIT Contribuyente:</label>
          <input formControlName="nitContribuyente" id="nit" placeholder="Ej. 901234567-8">
          <span class="error" *ngIf="radicacionForm.get('nitContribuyente')?.touched && radicacionForm.get('nitContribuyente')?.invalid">
            NIT inválido (requerido).
          </span>
        </div>

        <div class="form-field">
          <label>Periodo Grabable:</label>
          <input formControlName="periodoGrabable" id="periodo" placeholder="Ej. 202604">
          <span class="error" *ngIf="radicacionForm.get('periodoGrabable')?.touched && radicacionForm.get('periodoGrabable')?.invalid">
            Periodo requerido (formato YYYYMM).
          </span>
        </div>

        <div class="form-field">
          <label>Monto Retenido ($):</label>
          <input type="number" formControlName="montoRetenido" id="monto" placeholder="0.00">
          <span class="error" *ngIf="radicacionForm.get('montoRetenido')?.touched && radicacionForm.get('montoRetenido')?.invalid">
            El monto retenido debe ser mayor a cero.
          </span>
        </div>

        <button type="submit" [disabled]="radicacionForm.invalid">Radicar Trámite</button>
      </form>
    </div>
  `
})
export class FormularioRadicacionComponent {
  estadoGeneral = signal('LISTO');
  radicacionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: DeclaracionesIcaService
  ) {
    this.radicacionForm = this.fb.group({
      nitContribuyente: ['', [Validators.required, Validators.maxLength(20)]],
      periodoGrabable: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      montoRetenido: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  onSubmit() {
    if (this.radicacionForm.valid) {
      this.estadoGeneral.set('ENVIANDO');
      this.service.create(this.radicacionForm.value).subscribe({
        next: () => {
          this.estadoGeneral.set('COMPLETO');
          this.radicacionForm.reset({ nitContribuyente: '', periodoGrabable: '', montoRetenido: 0 });
        },
        error: () => this.estadoGeneral.set('ERROR')
      });
    }
  }
}
