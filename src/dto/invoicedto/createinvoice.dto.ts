import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber ,ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateInvoiceDetailDto {
  @ApiProperty()
  BookId: number;
  @ApiProperty()
  @IsNumber()
  Quantity: number;
  @ApiProperty()
  @IsNumber()
  UnitPrice: number;
}

export class CreateInvoiceDto {
  @ApiProperty()
  UserId: number;
  @ApiProperty()
  InvoiceDate: string;


  @ApiProperty({ type: [CreateInvoiceDetailDto] }) 
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceDetailDto)
  Details: CreateInvoiceDetailDto[];
}