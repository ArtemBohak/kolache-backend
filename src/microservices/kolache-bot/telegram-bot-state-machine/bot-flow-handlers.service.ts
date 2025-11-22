import { Injectable } from '@nestjs/common';
import { ChatStatusesEnum } from './types';
import { ProcessStateChangeDTO } from './dto/process-state-change.dto';
import { TelegramApiService } from '../telegram-api';

type CommandHandler = (
  currentChatStatus: ChatStatusesEnum,
  paload?: any,
) => Promise<{
  newChatStatus: ChatStatusesEnum;
  payload?: any;
}>;

@Injectable()
export class BotFlowHandlersService {
  constructor(private telegramApiService: TelegramApiService) {}

  async processStateChange({
    currentChatStatus,
    payload,
  }: ProcessStateChangeDTO): Promise<{
    newChatStatus: ChatStatusesEnum;
    payload?: any;
  }> {
    const flowHandlers: {
      [key in ChatStatusesEnum]: CommandHandler;
    } = {
      [ChatStatusesEnum.startCommandEntered]: this.handleStartCommandEntered,
      [ChatStatusesEnum.authCommandEntered]: this.handleAuthCommandEntered,
      [ChatStatusesEnum.enteredAuthCredentials]:
        this.handleEnteredAuthCredentials,
    };

    if (flowHandlers[currentChatStatus]) {
      const result = await flowHandlers[currentChatStatus](
        currentChatStatus,
        payload,
      );
      return result;
    } else {
      return flowHandlers.startCommandEntered(currentChatStatus, payload);
    }
  }

  // handlers
  handleStartCommandEntered: CommandHandler = async (_, { chatId }) => {
    await this.telegramApiService.sendInlineKeyboardToUser({
      chatId: chatId,
      keyboardCommands: [{ text: 'Sign In', callback_data: '/auth' }],
    });
    return {
      newChatStatus: ChatStatusesEnum.startCommandEntered,
    };
  };

  handleAuthCommandEntered: CommandHandler = async (_, { chatId }) => {
    await this.telegramApiService.sendTextMessageToUser({
      message: 'Введіть email та пароль через пробіл:',
      chatId,
    });

    return {
      newChatStatus: ChatStatusesEnum.authCommandEntered,
    };
  };

  handleEnteredAuthCredentials: CommandHandler = async () => {
    return {
      newChatStatus: ChatStatusesEnum.authCommandEntered,
    };
  };
}
