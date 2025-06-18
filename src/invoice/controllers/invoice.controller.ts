import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    InternalServerErrorException, 
    ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { InvoiceService } from '../services/invoice.service';
import { CreateInvoiceDto } from 'src/dto/invoicedto/createinvoice.dto';
import { InvoiceResponseDto } from 'src/dto/invoicedto/invoiceresponse.dto';
@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}
        @Get()
        @ApiOperation({ summary: 'Get All Invoices' })
        findAll(): Promise<InvoiceResponseDto[]> {
            try{
                return this.invoiceService.getAll();
            }catch(error){
                throw new InternalServerErrorException('Không thể lấy danh sách hóa đơn');
            }
        }
        
        @Get(':id')
        @ApiOperation({ summary: 'Search Invoice' })
        findOne(@Param('id', ParseIntPipe) InvoiceId: number): Promise<InvoiceResponseDto|null> {
            try{
                return this.invoiceService.findOne(+InvoiceId);
            }catch(error){
                throw new InternalServerErrorException('Không thể lấy chi tiết hóa đơn');
            }
        }
        
        @Post()
        @ApiOperation({ summary: 'Create Invoice' })
        @ApiBody({ type: CreateInvoiceDto })
        create(@Body() invoice: CreateInvoiceDto): Promise<InvoiceResponseDto> {
            try{
                return this.invoiceService.create(invoice);
            }catch(error){
                throw new InternalServerErrorException('Không thể tạo hóa đơn');
            }
        }

}
