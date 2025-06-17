import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: '' })
  @IsString()
  username: string;

  @ApiProperty({ example: '' })
  @IsString()
  password: string;
}

export class ForgotPasswordDto{
    @IsEmail()
    email: string;
}