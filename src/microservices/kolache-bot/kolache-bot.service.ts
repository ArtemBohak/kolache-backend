import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiService } from 'services/api/api.service';

@Injectable()
export class KolacheBotService {
  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
  ) {}

  async sendMessage(message: string) {
    const botToken = this.configService.get('TG_BOT_TOKEN') as string;
    const chatId = this.configService.get('TG_CHAT_ID') as string;
    const threadId = this.configService.get('TG_CHAT_THREAD_ID') as string;

    const response = await this.apiService.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        message_thread_id: threadId,
      },
    );
    return response;
  }
}
