import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { User } from 'src/users/entities/user.entity';
import { PayloadToken } from 'src/common/interfaces/auth/payload-token.interface';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string) {
    try {
      const user =
        await this.userService.findByUsernameOrEmail(usernameOrEmail);
      if (!(await bcrypt.compare(password, user.password))) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Incorrect credentials',
        });
      }
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        // Manejo para errores inesperados que no sean instancias de Error
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  private signJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: number | string;
  }) {
    return jwt.sign(payload, secret, { expiresIn: expires });
  }

  async generateJwt(user: User): Promise<any> {
    const getUser = await this.userService.findOne(user.id);

    const payload: PayloadToken = {
      sub: getUser.id,
      role: getUser.role,
    };

    return {
      accessToken: this.signJWT({
        payload,
        secret: this.configService.get<string>('JWT_SECRET'),
        expires: '1h',
      }),
      user,
    };
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    try {
      const userByUsername = await this.userRepository.findOne({
        where: { name: usernameOrEmail },
      });

      if (userByUsername) {
        return userByUsername;
      }

      const userByEmail = await this.userRepository.findOne({
        where: { email: usernameOrEmail },
      });

      if (userByEmail) {
        return userByEmail;
      }

      throw new ErrorManager({ type: 'NOT_FOUND', message: 'User not found' });
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError(
          'An unexpected error occurred.',
        );
      }
    }
  }

  private async encryptPassword(password: string) {
    try {
      const saltRounds = this.configService.get<number>('HASH_SALT');
      if (typeof saltRounds !== 'number') {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'Invalid salt rounds configuration',
        });
      }
      const passwordEncrypt = await bcrypt.hash(password, saltRounds);
      return passwordEncrypt;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        // Manejo para errores inesperados que no sean instancias de Error
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }
}
