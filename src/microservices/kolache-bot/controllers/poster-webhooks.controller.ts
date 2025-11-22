import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TelegramApiService } from '../telegram-api';

@Controller('poster-webhooks')
export class PosterWebhooksController {
  constructor(private telegramApiService: TelegramApiService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhooks(@Body() body: { object: string; action: string }) {
    if (body.object === 'incoming_order' && body.action === 'added') {
      await this.telegramApiService.sendMessageToKolacheChannel(
        'Увага, нове онлайн замовлення, перевірте планшет',
      );
    }
    return;
  }
}
