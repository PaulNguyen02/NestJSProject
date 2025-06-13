import { Controller, Get, Post, Body, Param, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { InvoiceDetailService } from '../services/invoice_detail.service';
import { Invoice_Detail } from '../entites/invoice_detail.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckNumberPipe } from '../pipes/checking_pipe';

@ApiTags('/v1/invoice-detail')
@Controller('/v1/invoice-detail')
export class InvoiceDetailController {
    constructor(private readonly invoice_detailService: InvoiceDetailService) {}
        @Get()
        @ApiOperation({ summary: 'Get All Invoice Detail' })
        findAll(): Promise<Invoice_Detail[]> {
            try{
                return this.invoice_detailService.getAll();
            }catch(error){
                throw new InternalServerErrorException('Không thể lấy chi tiết hóa đơn');
            }
        }
    
        @Get(':id')
        @ApiOperation({ summary: 'Search Invoice Detail' })
        findOne(@Param('id', ParseIntPipe) InvoiceDetailId: number): Promise<Invoice_Detail|null> {
            try{
                return this.invoice_detailService.findOne(+InvoiceDetailId);
            }catch(error){
                throw new InternalServerErrorException('Không thể xác định hóa đơn');
            }
        }
    
        @Post()
        @ApiOperation({ summary: 'Create Invoice Detail' })
        create(@Body(CheckNumberPipe) invoice_detail: Partial<Invoice_Detail>): Promise<Invoice_Detail> {            
            try{
                return this.invoice_detailService.create(invoice_detail);
            }catch(error){
                throw new InternalServerErrorException('Không thể tạo CT hóa đơn');
            }
        }
    
}
