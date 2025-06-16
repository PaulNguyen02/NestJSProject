import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateInvoiceDetailDto {
  @ApiProperty()
  BookId: number;
  @ApiProperty()
  Quantity: number;
  @ApiProperty()
  UnitPrice: number;
}

export class CreateInvoiceDto {
  @ApiProperty()
  UserId: number;
  @ApiProperty()
  InvoiceDate: string;


  @ApiProperty({ type: [CreateInvoiceDetailDto] }) // 👈 Đây là phần quan trọng
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceDetailDto)
  Details: CreateInvoiceDetailDto[];
}