import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString, IsEmail, IsPhoneNumber, IsBoolean, Min } from 'class-validator';
import { Type, Expose } from 'class-transformer';
export class ImportUserDTO{

    @ApiProperty()
    @IsString()
    UserName: string;

    @ApiProperty()
    @IsString()
    Fullname: string;

    @ApiProperty()
    @IsEmail()
    Email: string;

    @ApiProperty()
    @IsPhoneNumber()
    Phone: string;

    @ApiProperty()
    @IsBoolean()
    Roles: boolean;

    @ApiProperty()
    @IsString()
    Pass: string;

}

export class UpdateUserDTO{

    @ApiProperty()
    @IsString()
    Fullname: string;

    @ApiProperty()
    @IsEmail()
    Email: string;

    @ApiProperty()
    @IsPhoneNumber()
    Phone: string;

    @ApiProperty()
    @IsBoolean()
    Roles: boolean;

}



export class ExportUserDTO{
    @ApiProperty()
    @Expose({ name: 'UserId' }) // tên phải khớp với entity
    UserId: number;

    @ApiProperty()
    @Expose({ name: 'UserName' })
    UserName: string;

    @ApiProperty()
    @Expose({ name: 'Fullname' })
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