import { Injectable, PipeTransform } from '@nestjs/common';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import { ErrorManager } from '../filters/error-manager.filter';

@Injectable()
export class PasswordComparisonPipe implements PipeTransform {
  transform(value: UpdatePasswordDto) {
    console.log('Datos en el Pipe:', value);
    try {
      if (value.newPassword === value.oldPassword) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'The new password cannot be the same as the old password.',
        });
      }
      return value;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }
}
