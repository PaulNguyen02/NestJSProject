import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '' })
  username: string;

  @ApiProperty({ example: '' })
  password: string;
}