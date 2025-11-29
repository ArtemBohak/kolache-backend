import { Injectable } from '@nestjs/common';
import { ProcessActionDTO } from './dto/process-action-dto';
import { BotFlowHandlersService } from './bot-flow-handlers.service';
import { ChatStatusesEnum } from './types';

@Injectable()
export class TelegramBotStateMachineService {
  private chatStatuses: { [chatId: number]: ChatStatusesEnum } = {};

  constructor(private botFlowHandlers: BotFlowHandlersService) {}

  async processAction({ payload, chatId }: ProcessActionDTO) {
    const chatStatus = this.chatStatuses[chatId];
    if (!chatStatus) {
      this.chatStatuses[chatId] = ChatStatusesEnum.startCommandEntered;
    }

    const { newChatStatus } = await this.botFlowHandlers.processStateChange({
      chatId,
      currentChatStatus: this.chatStatuses[chatId],
      payload,
    });

    this.chatStatuses[chatId] = newChatStatus;
  }
}
