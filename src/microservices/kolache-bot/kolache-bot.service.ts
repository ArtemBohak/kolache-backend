import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramApiService } from './telegram-api/telegram-api.service';
import { TelegramBotStateMachineService } from './telegram-bot-state-machine/telegram-bot-state-machine.service';
import { CallbackQuery, Message, Update } from '@grammyjs/types';

@Injectable()
export class KolacheBotService implements OnModuleInit, OnModuleDestroy {
  private polling = true;
  constructor(
    private telegramApiService: TelegramApiService,
    private configService: ConfigService,
    private stateMachineService: TelegramBotStateMachineService,
  ) {}

  async onModuleInit() {
    await this.telegramApiService.deleteWebhook();
    const isProduction = this.configService.get('IS_PRODUCTION') as string;
    if (isProduction === 'true') {
      this.polling = false;
      await this.telegramApiService.setWebhook();
    } else {
      this.polling = true;
      await this.startPolling();
    }
  }

  onModuleDestroy() {
    this.telegramApiService.deleteWebhook();
    this.polling = false;
  }

  private async startPolling() {
    const poll = async () => {
      if (!this.polling) return;

      try {
        const result = await this.telegramApiService.getPollingUpdates();
        await this.processUpdate(result?.result?.[0]);
      } catch (err) {
        console.error('Polling error:', err);
      }

      setTimeout(() => void poll(), 1000);
    };

    poll();
  }

  async processUpdate(update?: Update) {
    if (update) {
      if (update?.message) {
        await this.processMessage(update.message);
      } else if (update?.callback_query) {
        await this.processInlineKeyboard(update.callback_query);
      }
    }
  }

  private async processInlineKeyboard(message: CallbackQuery) {
    const chatId = message.message?.chat.id;
    if (chatId) {
      await this.stateMachineService.processAction({
        chatId,
        payload: message,
      });
    }
  }

  private async processMessage(message: Message & Update.NonChannel) {
    const chatId = message.chat.id;
    await this.stateMachineService.processAction({
      chatId,
      payload: message,
    });
  }
}
