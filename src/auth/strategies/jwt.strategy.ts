import { Injectable } from "@nestjs/common";
import { PassportStrategy} from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){
  
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: jwtSecret
      });
  }
  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role, 
    };
  }
}