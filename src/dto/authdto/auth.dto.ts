import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: '' })
  username: string;

  @ApiProperty({ example: '' })
  password: string;
}

export class ForgotPasswordDto{
    @IsEmail()
    email: string;
}