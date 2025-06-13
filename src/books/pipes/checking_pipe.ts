import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CheckStringPipe implements PipeTransform {
  transform(value: any): any {
    const errors: string[] = [];

    if (typeof value !== 'object') {
      errors.push('Dữ liệu đầu vào phải là object');
    }
    if ( value == null || Object.keys(value).length === 0 ) {
      errors.push('Dữ liệu không được để trống');
    }else{
      // Kiểm tra Title không chứa số
      if ('Title' in value && /\d/.test(value.Title)) {
        errors.push('Tiêu đề không được chứa số');
      }
  
      // Kiểm tra Author không chứa số
      if ('Author' in value && /\d/.test(value.Author)) {
        errors.push('Tên tác giả không được chứa số');
      }
  
      // Kiểm tra Price là số nguyên hoặc thực, không có chữ
      if ('Price' in value && !/^\d+(\.\d+)?$/.test(String(value.Price))) {
        errors.push('Giá sách phải là số, không chứa chữ');
      }
  
      // Kiểm tra Stock là số nguyên, không có chữ
      if ('Stock' in value && !/^\d+$/.test(String(value.Stock))) {
        errors.push('Số lượng tồn kho phải là số nguyên, không chứa chữ');
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return value;
  }
}
