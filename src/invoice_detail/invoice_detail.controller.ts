import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { InvoiceDetailService } from './invoice_detail.service';
import { Invoice_Detail } from './invoice_detail.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckNumberPipe } from './checking_pipe';

@ApiTags('/v1/invoice-detail')
@Controller('/v1/invoice-detail')
export class InvoiceDetailController {
    constructor(private readonly invoice_detailService: InvoiceDetailService) {}
        @Get()
        @ApiOperation({ summary: 'Get All Invoice Detail' })
        findAll(): Promise<Invoice_Detail[]> {
            return this.invoice_detailService.getAll();
        }
    
        @Get(':id')
        @ApiOperation({ summary: 'Search Invoice Detail' })
        findOne(@Param('id', ParseIntPipe) InvoiceDetailId: number): Promise<Invoice_Detail|null> {
            return this.invoice_detailService.findOne(+InvoiceDetailId);
        }
    
        @Post()
        @ApiOperation({ summary: 'Create Invoice Detail' })
        create(@Body(CheckNumberPipe) invoice_detail: Partial<Invoice_Detail>): Promise<Invoice_Detail> {
            return this.invoice_detailService.create(invoice_detail);
        }
    
}
