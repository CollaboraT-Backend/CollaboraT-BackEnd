import { ConfigService } from '@nestjs/config';
import { hashPassword } from './hash-password.helper';

export const generateHashedRandomPassword = async (
  configService: ConfigService,
) => {
  const randomPassword = Math.random().toString(36).substring(2);
  const hashedRandomPassword = await hashPassword(
    randomPassword,
    configService,
  );
  return { randomPassword, hashedRandomPassword };
};
