import { Module } from '@nestjs/common';
import { CronsController } from './controllers/crons.controller';

@Module({
  controllers: [CronsController],
  imports: [],
  providers: [],
})
export class KolacheBot {}
