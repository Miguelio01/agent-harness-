import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeclaracionRetencionIcaModule } from './modules/declaracion-retencion-ica/infrastructure/declaracion-retencion-ica.module.js';
import { DeclaracionRetencionIcaEntity } from './modules/declaracion-retencion-ica/domain/declaracion-retencion-ica.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'tributos_user',
      password: 'tributos_password',
      database: 'tributos_db',
      entities: [DeclaracionRetencionIcaEntity],
      synchronize: true,
    }),
    DeclaracionRetencionIcaModule,
  ],
})
export class AppModule {}
