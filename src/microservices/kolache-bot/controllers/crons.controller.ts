import { Controller, Get } from '@nestjs/common';
import { KolacheBotService } from '../kolache-bot.service';

@Controller('crons')
export class CronsController {
  constructor(private kolacheBotService: KolacheBotService) {}

  @Get('garbage-collection-cron')
  async garbageCollectionCron() {
    await this.kolacheBotService.sendMessage('Вивезіть сміття');
    return;
  }

  @Get('money-count-notification-cron')
  async moneyCountNotificationCron() {
    await this.kolacheBotService.sendMessage(
      'Якщо сьогодні ви працюєте до 14:00, то порахуйте касу та скиньте Артему повідомлення в лс',
    );
    return;
  }
}
