import { IsNotEmpty, IsString, IsNumber, Min, Length, Matches, IsOptional, IsEmail } from 'class-validator';

export class CreateDeclaracionDto {
  @IsNotEmpty({ message: 'El NIT no puede estar vacío.' })
  @IsString()
  @Length(5, 20, { message: 'El NIT debe tener entre 5 y 20 caracteres.' })
  nitContribuyente!: string;

  @IsNotEmpty({ message: 'El periodo gravable es obligatorio.' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'El periodo debe tener formato YYYYMM (6 dígitos).' })
  periodoGrabable!: string;

  @IsNotEmpty({ message: 'El monto retenido es obligatorio.' })
  @IsNumber()
  @Min(0.01, { message: 'El monto retenido debe ser mayor a cero.' })
  montoRetenido!: number;

  @IsOptional()
  @IsString()
  emailContacto?: string;

  @IsOptional()
  @IsString()
  telefonoContacto?: string;
}
