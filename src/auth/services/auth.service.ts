import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns';
import { JwtService } from '@nestjs/jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';
@Injectable()
export class AuthService {
    constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private userRepository: UsersService,
    private readonly mailerService: MailerService
  ) {}


  async validateUser(username: string, pass: string): Promise<Users | null> {
    const user = await this.usersService.findByUsername(username);

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



  async forgotPassword(email: string){
    const user = await this.usersService.findEmail(email);
    if (!user) throw new NotFoundException('User not found');

      const id = user.UserId;
      const token = uuidv4();
      const expires = addMinutes(new Date(), 15); // token valid for 15 min

      user.resetPasswordToken = token;
      user.resetPasswordExpires = expires;
      await this.userRepository.update(id, user)   //Cập nhật lại 2 trường này

      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset',
        template: './reset-password', // e.g., reset-password.hbs
        context: {
          name: user.Fullname,
          resetUrl: `http://yourdomain.com/reset-password?token=${token}`
        }
      });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findResetPassToken(token);
    if (!user) {
      throw new NotFoundException('Lỗi');
    }
    if(user.resetPasswordExpires != null){
      if(user.resetPasswordExpires < new Date()){
        throw new NotFoundException('Token không hợp lệ hoặc đã hết hạn');
      }else{
        const id = user?.UserId;
        user.Pass = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = "";
        user.resetPasswordExpires = null;
        await this.userRepository.update(id, user);
      }
    }
    
  }
}
