import { 
    PipeTransform, 
    Injectable, 
    BadRequestException
} from "@nestjs/common";
@Injectable()
export class CheckNumberPipe implements PipeTransform{
    transform(value: any): any {
        const errors: string[] = [];
        if (typeof value !== 'object') {
            errors.push('Dữ liệu đầu vào phải là object');
        }
        if ( value == null || Object.keys(value).length === 0 ) {
            errors.push('Dữ liệu không được để trống');
        }else{
            if('InvoiceId' in value && isNaN(Number(value.InvoiceId))){
                errors.push('InvoiceId phải là số');
            }
            if('BookId' in value && isNaN(Number(value.BookId))){
                errors.push('BookId phải là số');
            }
            if('Quantity' in value && isNaN(Number(value.Quantity))){
                errors.push('Quantity phải là số')
            }
            if('UnitPrice' in value && isNaN(Number(value.UnitPrice))){
                errors.push('UnitPrice phải là số')
            }
        }
        if (errors.length > 0) {
            throw new BadRequestException(errors);      //trả về thông báo lỗi
        }
        return value;
    }
}