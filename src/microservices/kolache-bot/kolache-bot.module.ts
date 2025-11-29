import { Module } from '@nestjs/common';
import { CronsController } from './controllers/crons.controller';
import { PosterWebhooksController } from './controllers/poster-webhooks.controller';
import { ProductsWasteController } from './controllers/products-waste.controller';
import { KolacheBotService } from './kolache-bot.service';
import { TelegramApiService } from './telegram-api/telegram-api.service';
import { ConfigService } from '@nestjs/config';
import { ApiService } from 'services/api/api.service';
import { TelegramBotStateMachineService } from './telegram-bot-state-machine/telegram-bot-state-machine.service';
import { BotFlowHandlersService } from './telegram-bot-state-machine/bot-flow-handlers.service';
import { UsersModule } from '../core/users/users.module';
import { AuthModule } from '../core/auth/auth.module';

@Module({
  controllers: [
    CronsController,
    PosterWebhooksController,
    ProductsWasteController,
  ],
  imports: [UsersModule, AuthModule],
  providers: [
    ConfigService,
    ApiService,
    KolacheBotService,
    TelegramBotStateMachineService,
    BotFlowHandlersService,
    {
      provide: TelegramApiService,
      useFactory: (apiService: ApiService, configService: ConfigService) => {
        const botToken = configService.get('TG_BOT_TOKEN') as string;
        return new TelegramApiService(apiService, configService, botToken);
      },
      inject: [ApiService, ConfigService],
    },
  ],
})
export class KolacheBotModule {}
