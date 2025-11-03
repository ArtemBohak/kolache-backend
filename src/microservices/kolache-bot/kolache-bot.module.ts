import { Module } from '@nestjs/common';
import { CronsController } from './controllers/crons.controller';
import { KolacheBotService } from './kolache-bot.service';
import { PosterWebhooksController } from './controllers/poster-webhooks.controller';

@Module({
  controllers: [CronsController, PosterWebhooksController],
  imports: [],
  providers: [KolacheBotService],
})
export class KolacheBotModule {}
