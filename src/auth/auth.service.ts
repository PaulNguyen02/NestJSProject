import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.entity';
@Injectable()
export class AuthService {
    constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}


  async validateUser(username: string, pass: string): Promise<Users | null> {
    const user = await this.usersService.findByUsername(username);
    //console.log('Input pass:', pass, 'Type:', typeof pass);
    //console.log('Stored hash:', user?.Pass, 'Type:', typeof user?.Pass);

    if (!user || !pass || !user.Pass) {
      console.error('Thiếu dữ liệu so sánh');
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.Pass);

    if (isMatch) {
      return user;
    }
    return null;
  }

  async login(user: Users) {
    const payload = { 
      username: user.UserName, 
      sub: user.UserId, 
      role: user.Roles 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
