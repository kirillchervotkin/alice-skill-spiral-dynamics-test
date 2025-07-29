import { Controller } from '@nestjs/common';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

@Controller()
export class AliceRegexController {
  constructor() {}

  // Обработка чисел (например, "покажи вопрос 5")
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
  handleColorResult(_context: any, matches: RegExpMatchArray): AliceResponse {
    const color = matches[1].toLowerCase();
    
    return new SkillResponseBuilder(
      `Ваш результат по ${color} уровню...`
    ).build();
  }

  // Обработка временных фраз
  handleDelayedAction(_context: any, matches: RegExpMatchArray): AliceResponse {
    const time = matches[2];
    const unit = matches[3];
    
    return new SkillResponseBuilder(
      `Хорошо, напомню вам ${unit === 'минут' ? 'через' : 'через'} ${time} ${unit}`
    ).build();
  }

  // Обработка сравнений
  handleColorComparison(_context: any, matches: RegExpMatchArray): AliceResponse {
    const color1 = matches[2].toLowerCase();
    const color2 = matches[4].toLowerCase();
    
    return new SkillResponseBuilder(
      `Сравниваю ${color1} и ${color2} уровни...`
    ).build();
  }

  // Обработка эмоциональных состояний
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
  handleGeneralSpiral(_context: any, _matches: RegExpMatchArray): AliceResponse {
    return new SkillResponseBuilder(
      'Я вижу, вы интересуетесь спиральной динамикой. Что именно хотите узнать? ' +
      'Могу рассказать о любом уровне или провести тест.'
    ).build();
  }
}