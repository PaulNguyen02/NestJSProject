import { Controller, Post, Request ,Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from '../dto/login.dto';
import { ApiBody } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    const token = this.authService.login(req.user);
    const isAdmin = req.user.Roles === true;
    return {
      message: isAdmin ? 'Bạn là admin' : 'Bạn không phải là admin',
      role: isAdmin ? 'admin' : 'user',
      access_token: (await token).access_token,
    };
  }
}
