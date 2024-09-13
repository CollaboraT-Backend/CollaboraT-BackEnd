import { ConfigService } from '@nestjs/config';
import { ErrorManager } from '../filters/error-manager.filter';
import * as bcrypt from 'bcrypt';

export async function hashPassword(
  password: string,
  configService: ConfigService,
) {
  try {
    const saltRoundsStr = configService.get<string>('HASH_SALT');
    
    if (!saltRoundsStr) {
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Salt rounds no set',
      });
    }

    const saltRounds = parseInt(saltRoundsStr, 10);

    if (isNaN(saltRounds)) {
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Invalid salt rounds configuration',
      });
    } 

    const passwordEncrypted = await bcrypt.hash(password, saltRounds);

    return passwordEncrypted;
  } catch (error) {
    if (error instanceof Error) {
      throw ErrorManager.createSignatureError(error.message);
    } else {
      throw ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }
}
