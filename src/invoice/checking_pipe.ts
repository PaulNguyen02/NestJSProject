import { 
    PipeTransform, 
    Injectable, 
    BadRequestException
} from "@nestjs/common";

@Injectable()
export class CheckDatePipe implements PipeTransform{
    transform(value: any): any {
        const errors: string[] = [];
        if (typeof value !== 'object') {
            errors.push('Dữ liệu đầu vào phải là object');
        }
        if ( value == null || Object.keys(value).length === 0 ) {
            errors.push('Dữ liệu không được để trống');
        }else{
            if ('InvoiceDate' in value) {
                const date = new Date(value.date);
                if (isNaN(date.getTime())) {
                    errors.push('Ngày không hợp lệ');
                } 
            }
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors);      //trả về thông báo lỗi
        }
        return value;
    }

}