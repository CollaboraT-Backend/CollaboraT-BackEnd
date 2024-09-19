import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { Collaborator, Company } from '@prisma/client';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import validator from 'validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'localStrategy') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Company | Collaborator> {
    try {
      //validate email

      if (!validator.isEmail(email.toLowerCase().trim()) || !password) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid credential',
        });
      }
      const user: Company | Collaborator = await this.authService.validateUser({
        email: email.toLowerCase().trim(),
        password,
      });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }

      throw ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }
}
