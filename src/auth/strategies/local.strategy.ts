import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { Company } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'localStrategy') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const user: Company = await this.authService.validateUser(email, password);
    return user;
  }
}
