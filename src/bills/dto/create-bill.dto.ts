import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateBillDto {
  @IsString()
  @MinLength(1)
  number_bill: string;

  @IsString()
  provider: string;

  @IsInt()
  @IsPositive()
  price: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  pay: number;

  @IsBoolean()
  credit: boolean;

  @IsString()
  date_input: Date;
}
