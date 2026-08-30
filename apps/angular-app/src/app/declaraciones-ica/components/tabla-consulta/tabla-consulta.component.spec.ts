import '@angular/compiler';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TablaConsultaComponent } from './tabla-consulta.component';
import { of } from 'rxjs';

describe('TablaConsultaComponent', () => {
  let component: TablaConsultaComponent;
  let serviceMock: any;

  beforeEach(() => {
    serviceMock = {
      declaraciones: vi.fn().mockReturnValue([
        { id: 'uuid-1', nitContribuyente: '901234567-8', periodoGrabable: '202604', montoRetenido: 50000, estado: 'PENDIENTE' }
      ]),
      findAll: vi.fn().mockReturnValue(of([]))
    };

    component = new TablaConsultaComponent(serviceMock);
  });

  it('should retrieve list of radicados on initialization', () => {
    component.ngOnInit();
    expect(serviceMock.findAll).toHaveBeenCalled();
    const data = component.service.declaraciones();
    expect(data.length).toBe(1);
    expect(data[0].nitContribuyente).toBe('901234567-8');
  });
});
