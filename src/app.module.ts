import { Module } from '@nestjs/common';
import { AuthModule } from './microservices/core/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { GlobalAuthGuard } from './common/guards/global-auth.guard';
import { KolacheGameModule } from './microservices/kolache-game/kolache-game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './microservices/core/users/users.module';
import { ApiModule } from './microservices/core/services/api/api.module';
import { KolacheBotModule } from './microservices/kolache-bot/kolache-bot.module';
import { HealthCheckModule } from './microservices/core/health-check/health-check.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') as string,
        port: configService.get<number>('DB_PORT') as number,
        username: configService.get<string>('DB_USERNAME') as string,
        password: configService.get<string>('DB_PASSWORD') as string,
        database: configService.get<string>('DB_NAME') as string,
        entities: [],
        autoLoadEntities: true,
        invalidWhereValuesBehavior: {
          null: 'sql-null',
          undefined: 'ignore',
        },
        synchronize: false,
      }),
    }),
    AuthModule,
    UsersModule,
    ApiModule,
    KolacheGameModule,
    HealthCheckModule,
    KolacheBotModule,
    RouterModule.register([
      {
        path: 'kolache-game',
        module: KolacheGameModule,
      },
    ]),
    RouterModule.register([
      {
        path: 'kolache-bot',
        module: KolacheBotModule,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule {}
