import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TelegramApiService } from '../telegram-api';

@Controller('poster-webhooks')
export class PosterWebhooksController {
  constructor(private telegramApiService: TelegramApiService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhooks(
    @Body() body: { object: string; action: string; data: any },
  ) {
    if (body.object === 'incoming_order' && body.action === 'added') {
      await this.telegramApiService.sendMessageToKolacheChannel(
        'Увага, нове онлайн замовлення, перевірте планшет',
      );
    }

    if (body.object === 'transaction' && body.action === 'changed') {
      const data = JSON.parse(body.data);
      console.log(data);
      await this.telegramApiService.sendTextMessageToUser({
        message: `Зміни в чеку на суму ${data?.transactions_history?.value_text}`,
        chatId: 532890534,
      });
    }
    return;
  }
}
