import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type, Expose } from 'class-transformer';
export class ImportUserDTO{

    @ApiProperty()
    UserName: string;

    @ApiProperty()
    Fullname: string;

    @ApiProperty()
    Email: string;

    @ApiProperty()
    Phone: string;

    @ApiProperty()
    Roles: boolean;

    @ApiProperty()
    Pass: string;

}

export class ExportUserDTO{
    @ApiProperty()
    @Expose({ name: 'UserId' }) // tên phải khớp với entity
    UserId: number;

    @ApiProperty()
    @Expose({ name: 'UserName' })
    UserName: string;

    @ApiProperty()
    @Expose({ name: 'FullName' })
    Fullname: string;

    @ApiProperty()
    @Expose({ name: 'Email' })
    Email: string;

    @ApiProperty()
    @Expose({ name: 'Phone' })
    Phone: string;

    @ApiProperty()
    @Expose({ name: 'Roles' })
    Roles: boolean;
}

export class UserForgot{
    @ApiProperty()
    Email: string;
}

export class UserResetPass{

    @ApiProperty()
    resetPasswordToken: string;

    @ApiProperty()
    newPass: string;

}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number = 0;

}