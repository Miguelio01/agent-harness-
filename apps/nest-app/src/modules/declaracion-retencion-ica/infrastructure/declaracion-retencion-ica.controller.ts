import { Controller, Post, Get, Body } from '@nestjs/common';
import { DeclaracionRetencionIcaService } from '../application/declaracion-retencion-ica.service.js';
import { CreateDeclaracionDto } from './declaracion-retencion-ica.dto.js';
import { DeclaracionRetencionIcaEntity } from '../domain/declaracion-retencion-ica.entity.js';

@Controller('declaraciones-ica')
export class DeclaracionRetencionIcaController {
  constructor(private readonly service: DeclaracionRetencionIcaService) {}

  @Post()
  async create(@Body() dto: CreateDeclaracionDto): Promise<DeclaracionRetencionIcaEntity> {
    return this.service.create(dto);
  }

  @Get()
  async findAll(): Promise<DeclaracionRetencionIcaEntity[]> {
    return this.service.findAll();
  }
}
