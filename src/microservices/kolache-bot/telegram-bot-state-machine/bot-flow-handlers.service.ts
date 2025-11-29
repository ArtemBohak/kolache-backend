import { Injectable } from '@nestjs/common';
import { ChatCommandsEnum, ChatStatusesEnum } from './types';
import { ProcessStateChangeDTO } from './dto/process-state-change.dto';
import { TelegramApiService } from '../telegram-api';
import { UsersService } from 'src/microservices/core/users/users.service';
import { AuthService } from 'src/microservices/core/auth/auth.service';

type Payload = {
  text: string;
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
  };
  chat: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    type: string;
  };
  date: 1764363617;
  data?: string;
};

type CommandHandler = (
  currentChatStatus: ChatStatusesEnum,
  chatId: number,
  payload?: Payload,
) => Promise<{
  newChatStatus: ChatStatusesEnum;
  payload?: Payload;
}>;

@Injectable()
export class BotFlowHandlersService {
  constructor(
    private telegramApiService: TelegramApiService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async processStateChange({
    chatId,
    currentChatStatus,
    payload,
  }: ProcessStateChangeDTO): Promise<{
    newChatStatus: ChatStatusesEnum;
    payload?: Record<string, any>;
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
        chatId,
        payload,
      );
      return result;
    } else {
      return flowHandlers.startCommandEntered(
        currentChatStatus,
        chatId,
        payload,
      );
    }
  }

  // handlers
  handleStartCommandEntered: CommandHandler = async (_, chatId, payload) => {
    const text = payload?.data || payload?.text;

    if (text === ChatCommandsEnum.authCommand) {
      await this.telegramApiService.sendTextMessageToUser({
        chatId,
        message: 'Введіть імейл та пароль через пробіл:',
      });

      return {
        newChatStatus: ChatStatusesEnum.authCommandEntered,
      };
    }

    await this.telegramApiService.sendInlineKeyboardToUser({
      chatId,
      keyboardCommands: [{ text: 'Sign In', callback_data: '/auth' }],
    });
    return {
      newChatStatus: ChatStatusesEnum.startCommandEntered,
    };
  };

  handleAuthCommandEntered: CommandHandler = async (_, chatId, payload) => {
    if (payload?.text && payload.text.split(' ').length === 2) {
      try {
        const [email, password] = payload.text.split(' ');

        const { id } = payload.from;

        await this.authService.signInTelegram({
          email,
          password,
          telegramUserId: id,
        });
      } catch {
        // console.log(e.message);
      }
    } else {
      await this.telegramApiService.sendTextMessageToUser({
        chatId,
        message: 'Невірний формат повідомлення, спробуйте ще раз:',
      });

      return {
        newChatStatus: ChatStatusesEnum.authCommandEntered,
      };
    }

    return {
      newChatStatus: ChatStatusesEnum.enteredAuthCredentials,
    };
  };

  handleEnteredAuthCredentials: CommandHandler = async () => {
    return {
      newChatStatus: ChatStatusesEnum.authCommandEntered,
    };
  };
}
