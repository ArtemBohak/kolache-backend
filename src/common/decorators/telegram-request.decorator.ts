import { SetMetadata } from '@nestjs/common';

export const TELEGRAM_REQUEST = 'TELEGRAM_REQUEST';
export const TelegramRequest = () => SetMetadata(TELEGRAM_REQUEST, true);
