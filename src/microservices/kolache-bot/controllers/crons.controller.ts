import { Controller, Get } from '@nestjs/common';
import { TelegramApiService } from '../telegram-api';

@Controller('crons')
export class CronsController {
  constructor(private telegramApiService: TelegramApiService) {}

  @Get('garbage-collection-cron')
  async garbageCollectionCron() {
    await this.telegramApiService.sendMessageToKolacheChannel(
      'Вивезіть сміття',
    );
    return;
  }

  @Get('money-count-notification-cron')
  async moneyCountNotificationCron() {
    await this.telegramApiService.sendMessageToKolacheChannel(
      'Якщо сьогодні ви працюєте до 14:00, то порахуйте касу та скиньте Артему повідомлення в лс',
    );
    return;
  }

  @Get('stocktaking-notification-first-tuesday-cron')
  async stocktakingNotificationFirstTuesdayCron() {
    await this.telegramApiService.sendMessageToKolacheChannel(`
Інвентаризація ВТ-1.
Проведіть інвентаризацію по даному списку до 12:00 та надішліть Артему:
Айріш гарячий шоколад
Бельгійський гарячий шоколад
Білий гарячий шоколад
Марципан гарячий шоколад
Рожевий гарячий шоколад
Солона карамель гарячий шоколад
Спайсі гарячий шоколад
Український гарячий шоколад
Мілкшейк порошок (усі окремо порахувати)
Какао для напою
ананасовий сік
апельсиновий сік
кокосова вода
Вода Без газів (для клієнтів)
Вода мінеральна (для клієнтів)
Екзотік фанта
Кола (жб 330мл/500мл)
Кола 0.5л
Кола 0.5л Cherry
Кола ваніль
Напій Chupa Chups
Сік Cappy 200мл
Спрайт
Фанта
Швепс 330мл
`);
    return;
  }

  @Get('stocktaking-notification-first-thursday-cron')
  async stocktakingNotificationFirstThursdayCron() {
    await this.telegramApiService.sendMessageToKolacheChannel(`
Інвентаризація ЧТ-1.
Проведіть інвентаризацію по даному списку до 12:00 та надішліть Артему:
Чай Зелений Гуань Інь
Чай Зелений Оолонг
Чай Травʼяний Альпійський луг
Чай Чорний Дарджилінг
Чай преміум
б/к кава
Кава в зернах
Цукор в стіках
Вершки аерозольні
Коржик
Печиво з передбаченням
Шоколатьє
Горішок зі згущеним молоком
Горішок фісташка з вишнею
Горішок дорблю
Горішок з полуницею
Блонді лимонний
Блонді фісташковий
`);
    return;
  }

  @Get('stocktaking-notification-second-tuesday-cron')
  async stocktakingNotificationSecondTuesdaydayCron() {
    await this.telegramApiService.sendMessageToKolacheChannel(`
Інвентаризація ВТ-2.
Проведіть інвентаризацію по даному списку до 12:00 та надішліть Артему:
Банановий Крем
Заварний крем
Вишневий крем
Карамель паста
Крем рафаело
Крем-сир
манго концентрат
Нутелла
Фісташка крем
яблучний крем
тірамісу крем
бабл-гам
Горіхи
Какао
кокосова стружка
Кориця
Катаїфі тісто
Нонпарель (всіх кольорів та форм)
Орео
Молоко Бариста
Бананове молоко
Безлактозне молоко
Кокосове молоко
Мигдальне молоко
ванільне молоко
Борошно
Цукор
Цукор ванільний
Дріжжі
Вершки рідкі
Маргарин
Масло
Молоко згущене
Олія
`);
    return;
  }

  @Get('stocktaking-notification-second-thursday-cron')
  async stocktakingNotificationSecondThursdayCron() {
    await this.telegramApiService.sendMessageToKolacheChannel(`
Інвентаризація ЧТ-2.
Проведіть інвентаризацію по даному списку до 12:00 та надішліть Артему:
Пряний гарбуз сироп
Пюре Грейпфрут
Пюре малина
пюре маракуя
Пюре персик
пюре чорниця
сироп апельсин
сироп бузина
сироп вишня
сироп карамель
сироп клауді лимон
сироп кокос
сироп лаванда
Сироп лимон
Сироп манго
Сироп мед
сироп мохіто
сироп полуниця
сироп солона карамель
Сироп троянда
сироп чорниця
сироп шок печиво
Апельсин
Лимон
м'ята
банан
біла глазур
Вишня бабл
Кавун бабл
Малина бабл
Манго бабл
Чорниця бабл
лохина
Брелок
Стакан з іграшкою
Мінералка (та що для лимонадів)
Маршмелоу
Матча зелена
Матча синя
Матча рожева
Мед
Розрихлитель
Салат
сир чедер
сублімована вишня
чорна глазур
Шинка
яйце
`);
    return;
  }
}
