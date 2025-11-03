import { Module } from '@nestjs/common';
import { CronsController } from './controllers/crons.controller';
import { KolacheBotService } from './kolache-bot.service';

@Module({
  controllers: [CronsController],
  imports: [],
  providers: [KolacheBotService],
})
export class KolacheBotModule {}
