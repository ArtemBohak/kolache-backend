import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiService } from 'services/api/api.service';
import { SendInlineKeyboardDTO } from './dto/message-to-kolache-channel-dto';
import { SendTextMessageToUserDTO } from './dto/send-text-message-to-user-dto';

type TelegramUpdate = {
  update_id: number;
  message?: any;
  callback_query?: any;
};

type GetPollingUpdatesResponse = {
  result: TelegramUpdate[];
};

@Injectable()
export class TelegramApiService {
  private botUrl: string;
  private lastUpdateId = 0;
  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
    botToken: string,
  ) {
    this.botUrl = `https://api.telegram.org/bot${botToken}`;
  }

  async deleteWebhook() {
    const response = await this.apiService.get(`${this.botUrl}/deleteWebhook`);
    console.log('Telegram webhook deleted', response);
  }

  async setWebhook() {
    const hostName = this.configService.get('HOST_NAME') as string;
    await this.apiService.get(`${this.botUrl}/setWebhook`, {
      url: `${hostName}/api/kolache-bot/telegram-webhooks`,
    });
  }

  async getPollingUpdates() {
    const response = await this.apiService.get<GetPollingUpdatesResponse>(
      `${this.botUrl}/getUpdates`,
      {
        timeout: 1,
        limit: 1,
        offset: this.lastUpdateId,
      },
    );

    if (response && response?.result?.[0]) {
      const message = response?.result?.[0];
      this.lastUpdateId = message.update_id + 1;
    }

    return response;
  }

  async sendMessageToKolacheChannel(message: string) {
    const isProd = this.configService.get('IS_PRODUCTION') as string;

    const laKolacheChatId = this.configService.get('TG_CHAT_ID') as string;
    const laKolacheThreadId =
      isProd === 'true'
        ? (this.configService.get('TG_CHAT_THREAD_ID') as string)
        : (this.configService.get('TG_CHAT_TESTING_THREAD_ID') as string);

    const chatBody = {
      chat_id: laKolacheChatId,
      text: message,
      parse_mode: 'Markdown',
      message_thread_id: laKolacheThreadId,
    };

    const response = await this.apiService.post(
      `${this.botUrl}/sendMessage`,
      chatBody,
    );
    return response;
  }

  async sendTextMessageToUser({ message, chatId }: SendTextMessageToUserDTO) {
    const response = await this.apiService.post(`${this.botUrl}/sendMessage`, {
      text: message,
      chat_id: chatId,
    });

    return response;
  }

  async sendInlineKeyboardToUser({
    chatId,
    keyboardCommands,
    message = 'Оберіть команду:',
  }: SendInlineKeyboardDTO) {
    const response = await this.apiService.post(`${this.botUrl}/sendMessage`, {
      text: message,
      chat_id: chatId,
      reply_markup: {
        inline_keyboard: [keyboardCommands],
      },
    });
    return response;
  }
}
