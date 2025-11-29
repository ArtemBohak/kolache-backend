import { IsNumber, IsString } from 'class-validator';

export class SignInTelegramDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  telegramUserId: number;
}
