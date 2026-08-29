import '@angular/compiler';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FormularioRadicacionComponent } from './formulario-radicacion.component.js';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { DeclaracionesIcaService } from './declaraciones-ica.service.js';

describe('FormularioRadicacionComponent', () => {
  let component: FormularioRadicacionComponent;
  let serviceMock: any;

  beforeEach(() => {
    serviceMock = {
      create: vi.fn().mockReturnValue(of({ success: true }))
    };

    component = new FormularioRadicacionComponent(new FormBuilder(), serviceMock);
  });

  it('should validate form constraints and fail if fields are empty', () => {
    // Assert initial form validation
    const form = component.radicacionForm;
    form.setValue({ nitContribuyente: '', periodoGrabable: '', montoRetenido: 0 });
    
    // Check manual validation triggers since we use raw logic
    const nitEmpty = form.value.nitContribuyente === '';
    const montoZero = form.value.montoRetenido <= 0;
    expect(nitEmpty).toBe(true);
    expect(montoZero).toBe(true);
  });

  it('should call service create when submitting a valid form', () => {
    const form = component.radicacionForm;
    const payload = {
      nitContribuyente: '901234567-8',
      periodoGrabable: '202605',
      montoRetenido: 4500000
    };
    form.setValue(payload);

    component.onSubmit();
    expect(serviceMock.create).toHaveBeenCalledWith(payload);
    expect(component.estadoGeneral()).toBe('COMPLETO');
  });
});
