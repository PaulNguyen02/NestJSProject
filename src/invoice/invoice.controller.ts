import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Invoice } from './invoice.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckDatePipe } from './checking_pipe'

@ApiTags('/v1/invoice')
@Controller('/v1/invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}
        @Get()
        @ApiOperation({ summary: 'Get All Invoices' })
        findAll(): Promise<Invoice[]> {
            return this.invoiceService.getAll();
        }
        
        @Get(':id')
        @ApiOperation({ summary: 'Search Invoice' })
        findOne(@Param('id', ParseIntPipe) InvoiceId: number): Promise<Invoice|null> {
            return this.invoiceService.findOne(+InvoiceId);
        }
        
        @Post()
        @ApiOperation({ summary: 'Create Invoice' })
        create(@Body(CheckDatePipe) invoice: Partial<Invoice>): Promise<Invoice> {
            return this.invoiceService.create(invoice);
        }

}
