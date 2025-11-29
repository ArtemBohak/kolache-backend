import { IsNumber, IsObject, IsString } from 'class-validator';
import { ChatStatusesEnum } from '../types';

export class ProcessStateChangeDTO {
  @IsObject()
  payload: any;

  @IsNumber()
  chatId: number;

  @IsString()
  currentChatStatus: ChatStatusesEnum;
}
