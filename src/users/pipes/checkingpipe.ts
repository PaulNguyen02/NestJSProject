import { 
    PipeTransform, 
    Injectable, 
    BadRequestException
} from "@nestjs/common";
@Injectable()
export class CheckNumberPipe implements PipeTransform{
    transform(value: any): any {
        const errors: string[] = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;    // Số điện thoại Việt Nam: 10 chữ số, bắt đầu bằng 0 hoặc +84

        if (typeof value !== 'object') {
            errors.push('Dữ liệu đầu vào phải là object');
        }
        if ( value == null || Object.keys(value).length === 0 ) {
            errors.push('Dữ liệu không được để trống');
        }else{
            if ('Email' in value && !emailRegex.test(value.Email)) {
                errors.push('Không đúng định dạng Email');
            }
            if ('Phone' in value && !phoneRegex.test(value.Phone)) {
                errors.push('Số điện thoại không hợp lệ');
            }
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors);      //trả về thông báo lỗi
        }
        return value;
    }
}