import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeclaracionRetencionIcaController } from './declaracion-retencion-ica.controller.js';
import { DeclaracionRetencionIcaService } from '../application/declaracion-retencion-ica.service.js';
import { CreateDeclaracionDto } from './declaracion-retencion-ica.dto.js';

describe('DeclaracionRetencionIcaController', () => {
  let controller: DeclaracionRetencionIcaController;
  let service: DeclaracionRetencionIcaService;

  beforeEach(() => {
    service = {
      create: vi.fn().mockImplementation((dto) => Promise.resolve({ id: 'uuid-123', ...dto, estado: 'PENDIENTE' })),
      findAll: vi.fn().mockImplementation(() => Promise.resolve([])),
    } as unknown as DeclaracionRetencionIcaService;

    controller = new DeclaracionRetencionIcaController(service);
  });

  it('should call service create when controller create is called', async () => {
    const dto: CreateDeclaracionDto = {
      nitContribuyente: '901234567-8',
      periodoGrabable: '202604',
      montoRetenido: 150000.0,
    };

    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result.id).toBe('uuid-123');
    expect(result.estado).toBe('PENDIENTE');
  });

  it('should call service findAll when controller findAll is called', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
