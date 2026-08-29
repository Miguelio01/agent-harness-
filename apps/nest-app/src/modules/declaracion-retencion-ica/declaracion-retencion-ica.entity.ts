import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('declaraciones_ica')
export class DeclaracionRetencionIcaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'nit_contribuyente', type: 'varchar', length: 20 })
  nitContribuyente!: string;

  @Column({ name: 'periodo_grabable', type: 'varchar', length: 6 })
  periodoGrabable!: string;

  @Column({ name: 'monto_retenido', type: 'numeric', precision: 15, scale: 2 })
  montoRetenido!: number;

  @Column({ type: 'varchar', length: 15, default: 'PENDIENTE' })
  estado!: string;
}
