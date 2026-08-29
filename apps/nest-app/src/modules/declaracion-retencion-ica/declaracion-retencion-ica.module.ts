import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeclaracionRetencionIcaEntity } from './declaracion-retencion-ica.entity.js';
import { DeclaracionRetencionIcaService } from './declaracion-retencion-ica.service.js';
import { DeclaracionRetencionIcaController } from './declaracion-retencion-ica.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([DeclaracionRetencionIcaEntity])],
  providers: [DeclaracionRetencionIcaService],
  controllers: [DeclaracionRetencionIcaController],
  exports: [DeclaracionRetencionIcaService],
})
export class DeclaracionRetencionIcaModule {}
