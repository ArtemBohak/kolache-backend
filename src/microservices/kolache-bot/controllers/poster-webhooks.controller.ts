import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { KolacheBotService } from '../kolache-bot.service';

@Controller('poster-webhooks')
export class PosterWebhooksController {
  constructor(private kolacheBotService: KolacheBotService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhooks(@Body() body: { object: string; action: string }) {
    if (body.object === 'incoming_order' && body.action === 'added') {
      await this.kolacheBotService.sendMessage(
        'Увага, нове онлайн замовлення, перевірте планшет',
      );
    }
    return;
  }
}
