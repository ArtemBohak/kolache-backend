import { IsNumber, IsString, ValidateNested } from 'class-validator';

class InlineKeyboardCommand {
  @IsString()
  text: string;

  @IsString()
  callback_data: string;
}

export class SendInlineKeyboardDTO {
  @IsString()
  message?: string;

  @IsNumber()
  chatId: number;

  @ValidateNested({ each: true })
  keyboardCommands: InlineKeyboardCommand[];
}
