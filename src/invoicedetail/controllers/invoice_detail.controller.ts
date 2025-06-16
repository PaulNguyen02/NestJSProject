import { Controller, Get, Post, Body, Param, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InvoiceDetailService } from '../services/invoice_detail.service';
import { Invoice_Detail } from '../entites/invoicedetail.entity';

@ApiTags('invoicedetail')
@Controller('invoicedetail')
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
    
}
