import { 
  Controller, 
  Post, 
  UseGuards, 
  Body,
  UnauthorizedException, 
  InternalServerErrorException
} from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { UsersService } from 'src/users/services/users.service';
import { Users } from 'src/users/entities/users.entity';
import { LoginDto } from 'src/dto/authdto/auth.dto';
import { ImportUserDTO } from 'src/dto/userdto/user.dto';
import { UserResetPass, UserForgot } from 'src/dto/userdto/user.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService, 
    private readonly userService: UsersService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async login(@Body() login_user: LoginDto) {

    const user = await this.authService.validateUser(login_user.username, login_user.password);
    if (!user) {
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
    }
    const token = await this.authService.login(user);
    const isAdmin = user.Roles === true;
    return {
      message: isAdmin ? 'Bạn là admin' : 'Bạn không phải là admin',
      role: isAdmin ? 'admin' : 'user',
      access_token: token.access_token,
    };
  }


  @Post('register')
  @ApiBody({ type: ImportUserDTO })
  @ApiOperation({ summary: 'Register' })
  create(@Body() user: Partial<ImportUserDTO>): Promise<Users> {
    try{
      return this.userService.create(user);
    }catch(error){
      throw new InternalServerErrorException('Không thể tạo sách');
    }
  }


  @Post('forgot-password')
  @ApiBody({ type: UserForgot })
  @ApiOperation({ summary: 'forgot password' })
  async forgot(@Body() user: UserForgot) {
    await this.authService.forgotPassword(user.Email);
    return { message: 'Vui lòng kiểm tra email để đặt lại mật khẩu' };
  }

  
  @Post('reset-password')
  @ApiOperation({ summary: 'gain password' })
  async reset(@Body() user: UserResetPass) {
    await this.authService.resetPassword(user.resetPasswordToken, user.newPass);
    return { message: 'Mật khẩu đã được cập nhật' };
  }

}
