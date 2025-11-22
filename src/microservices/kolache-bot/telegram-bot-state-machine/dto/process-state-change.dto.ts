import { IsObject, IsString } from 'class-validator';
import { ChatStatusesEnum } from '../types';

export class ProcessStateChangeDTO {
  @IsObject()
  payload: any;

  @IsString()
  currentChatStatus: ChatStatusesEnum;
}
