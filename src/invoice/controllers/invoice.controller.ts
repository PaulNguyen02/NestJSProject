import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    InternalServerErrorException, 
    ParseIntPipe 
} from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../entities/invoice.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckDatePipe } from '../pipes/checking_pipe'

@ApiTags('/v1/invoice')
@Controller('/v1/invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}
        @Get()
        @ApiOperation({ summary: 'Get All Invoices' })
        findAll(): Promise<Invoice[]> {
            try{
                return this.invoiceService.getAll();
            }catch(error){
                throw new InternalServerErrorException('Không thể lấy danh sách hóa đơn');
            }
        }
        
        @Get(':id')
        @ApiOperation({ summary: 'Search Invoice' })
        findOne(@Param('id', ParseIntPipe) InvoiceId: number): Promise<Invoice|null> {
            try{
                return this.invoiceService.findOne(+InvoiceId);
            }catch(error){
                throw new InternalServerErrorException('Không thể lấy chi tiết hóa đơn');
            }
        }
        
        @Post()
        @ApiOperation({ summary: 'Create Invoice' })
        create(@Body(CheckDatePipe) invoice: Partial<Invoice>): Promise<Invoice> {
            try{
                return this.invoiceService.create(invoice);
            }catch(error){
                throw new InternalServerErrorException('Không thể tạo hóa đơn');
            }
        }

}
