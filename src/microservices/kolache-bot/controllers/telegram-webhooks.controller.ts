import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { KolacheBotService } from '../kolache-bot.service';
import { Update } from '@grammyjs/types';

@Controller('telegram-webhooks')
export class TelegramWebhooksController {
  constructor(private kolacheBotService: KolacheBotService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleTelegramWebhooks(@Body() body: { result: Update[] }) {
    await this.kolacheBotService.processUpdate(body.result?.[0]);
  }
}
