import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
export class InvoiceResponseDetailDto {
  @ApiProperty()
  @Expose({ name: 'InvoiceDetailId' })
  InvoiceDetailId?: number;

  @ApiProperty()
  @Expose({ name: 'BookId' })
  BookId: number;

  @ApiProperty()
  @Expose({ name: 'Quantity' })
  Quantity: number;

  @ApiProperty()
  @Expose({ name: 'UnitPrice' })
  UnitPrice: number;
}

export class InvoiceResponseDto {
  @ApiProperty()
  @Expose({ name: 'InvoiceId' })
  InvoiceId: number;

  @ApiProperty()
  @Expose({ name: 'UserId' })
  UserId: number;

  @ApiProperty()
  @Expose({ name: 'UserName' })
  UserName: string;

  @ApiProperty()
  @Expose({ name: 'FullName' })
  Fullname: string;

  @ApiProperty()
  @Expose({ name: 'InvoiceDate' })
  InvoiceDate: string;

  @ApiProperty()
  @Expose({ name: 'Details' })
  Details: InvoiceResponseDetailDto[];
}