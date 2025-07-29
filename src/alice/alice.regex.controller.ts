import { Controller, OnModuleInit } from '@nestjs/common';
import { RegexIntent } from '../decorators/regex-intent.decorator';
import { RegexIntentService } from '../services/regex-intent.service';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

@Controller()
export class AliceRegexController implements OnModuleInit {
  constructor(private readonly regexService: RegexIntentService) {}

  onModuleInit() {
    // Регистрируем все regex-обработчики при инициализации модуля
    this.registerRegexHandlers();
  }

  private registerRegexHandlers() {
    // Получаем все методы с декоратором @RegexIntent
    const prototype = Object.getPrototypeOf(this);
    const methodNames = Object.getOwnPropertyNames(prototype);

    for (const methodName of methodNames) {
      const method = prototype[methodName];
      if (typeof method === 'function') {
        const regexOptions = Reflect.getMetadata('regex_intent', method);
        if (regexOptions) {
          const pattern = typeof regexOptions.pattern === 'string' 
            ? new RegExp(regexOptions.pattern, 'i') 
            : regexOptions.pattern;
          
          this.regexService.registerHandler(this, methodName, pattern, regexOptions);
        }
      }
    }
  }

  // Обработка чисел (например, "покажи вопрос 5")
  @RegexIntent({
    pattern: /(?:вопрос|номер|показать)\s*(\d+)/i,
    priority: 10,
    description: 'Переход к конкретному вопросу по номеру'
  })
  handleQuestionNumber(_context: any, matches: RegExpMatchArray): AliceResponse {
    const questionNumber = parseInt(matches[1]);
    
    if (questionNumber < 1 || questionNumber > 24) {
      return new SkillResponseBuilder(
        `Номер вопроса должен быть от 1 до 24. Вы указали: ${questionNumber}`
      ).build();
    }

    return new SkillResponseBuilder(
      `Переходим к вопросу ${questionNumber}...`
    ).build();
  }



  // Обработка процентов и результатов
  @RegexIntent({
    pattern: /(?:мой|результат|процент|балл)\s*(?:по|для)?\s*(красный|синий|зеленый|желтый|оранжевый|фиолетовый|бирюзовый|бежевый)/i,
    priority: 9,
    description: 'Показ результата по конкретному цвету'
  })
  handleColorResult(_context: any, matches: RegExpMatchArray): AliceResponse {
    const color = matches[1].toLowerCase();
    
    return new SkillResponseBuilder(
      `Ваш результат по ${color} уровню...`
    ).build();
  }

  // Обработка временных фраз
  @RegexIntent({
    pattern: /(через|после|потом|позже)\s+(\d+)\s*(минут|часов|секунд)/i,
    priority: 5,
    description: 'Отложенные действия'
  })
  handleDelayedAction(_context: any, matches: RegExpMatchArray): AliceResponse {
    const time = matches[2];
    const unit = matches[3];
    
    return new SkillResponseBuilder(
      `Хорошо, напомню вам ${unit === 'минут' ? 'через' : 'через'} ${time} ${unit}`
    ).build();
  }

  // Обработка сравнений
  @RegexIntent({
    pattern: /(сравни|различия|разница)\s+(красный|синий|зеленый|желтый|оранжевый|фиолетовый|бирюзовый|бежевый)\s+(?:и|с)\s+(красный|синий|зеленый|желтый|оранжевый|фиолетовый|бирюзовый|бежевый)/i,
    priority: 7,
    description: 'Сравнение двух уровней'
  })
  handleColorComparison(_context: any, matches: RegExpMatchArray): AliceResponse {
    const color1 = matches[2].toLowerCase();
    const color2 = matches[4].toLowerCase();
    
    return new SkillResponseBuilder(
      `Сравниваю ${color1} и ${color2} уровни...`
    ).build();
  }

  // Обработка эмоциональных состояний
  @RegexIntent({
    pattern: /(я\s+)?(устал|устала|скучно|интересно|сложно|легко|понятно|непонятно)/i,
    priority: 6,
    description: 'Реакция на эмоциональное состояние пользователя'
  })
  handleEmotionalState(_context: any, matches: RegExpMatchArray): AliceResponse {
    const emotion = matches[2].toLowerCase();
    
    const responses: Record<string, string> = {
      'устал': 'Понимаю, что тест может быть утомительным. Хотите сделать паузу?',
      'устала': 'Понимаю, что тест может быть утомительным. Хотите сделать паузу?',
      'скучно': 'Постараюсь сделать тест интереснее! Продолжим?',
      'интересно': 'Отлично! Значит, продолжаем изучать ваши ценности.',
      'сложно': 'Не переживайте, отвечайте интуитивно. Правильных и неправильных ответов нет.',
      'легко': 'Замечательно! Вы хорошо понимаете свои ценности.',
      'понятно': 'Отлично! Продолжаем тест.',
      'непонятно': 'Давайте я объясню подробнее. В чем именно сложность?'
    };
    
    return new SkillResponseBuilder(
      responses[emotion] || 'Понимаю ваши чувства. Как продолжим?'
    ).build();
  }

  // Fallback для неопознанных фраз с ключевыми словами
  @RegexIntent({
    pattern: /(спиральная|динамика|ценности|уровень|тест|психология)/i,
    priority: 1,
    description: 'Общие фразы о спиральной динамике'
  })
  handleGeneralSpiral(_context: any, _matches: RegExpMatchArray): AliceResponse {
    return new SkillResponseBuilder(
      'Я вижу, вы интересуетесь спиральной динамикой. Что именно хотите узнать? ' +
      'Могу рассказать о любом уровне или провести тест.'
    ).build();
  }
}