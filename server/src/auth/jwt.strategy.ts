import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') || 'default_secret_key';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    this.logger.log(`JWT Strategy initialized with secret: ${secret.substring(0, 10)}...`);
  }

  async validate(payload: any) {
    this.logger.debug(`JWT payload validated: ${JSON.stringify(payload)}`);
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
