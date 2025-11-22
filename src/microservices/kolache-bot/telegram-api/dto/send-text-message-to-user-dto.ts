import { IsNumber, IsString } from 'class-validator';

export class SendTextMessageToUserDTO {
  @IsString()
  message: string;

  @IsNumber()
  chatId: number;
}
