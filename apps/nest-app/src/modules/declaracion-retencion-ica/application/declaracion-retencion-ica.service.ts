import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeclaracionRetencionIcaEntity } from '../domain/declaracion-retencion-ica.entity.js';
import { CreateDeclaracionDto } from '../infrastructure/declaracion-retencion-ica.dto.js';

@Injectable()
export class DeclaracionRetencionIcaService {
  constructor(
    @InjectRepository(DeclaracionRetencionIcaEntity)
    private readonly repository: Repository<DeclaracionRetencionIcaEntity>,
  ) {}

  async create(dto: CreateDeclaracionDto): Promise<DeclaracionRetencionIcaEntity> {
    const entity = this.repository.create({
      ...dto,
      estado: 'PENDIENTE',
    });
    return this.repository.save(entity);
  }

  async findAll(): Promise<DeclaracionRetencionIcaEntity[]> {
    return this.repository.find();
  }
}
