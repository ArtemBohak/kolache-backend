import { IsNumber, IsObject } from 'class-validator';

export class ProcessActionDTO {
  @IsNumber()
  chatId: number;

  @IsObject()
  payload: Record<string, any>;
}
