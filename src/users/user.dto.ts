import { ApiProperty } from '@nestjs/swagger';

export class UserDTO{

    @ApiProperty()
    UserName: string;

    @ApiProperty()
    Fullname: string;

    @ApiProperty()
    Email: string;

    @ApiProperty()
    Phone: string;

    @ApiProperty()
    Pass: string;

    @ApiProperty()
    Roles: boolean;
}