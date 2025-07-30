import { Controller } from '@nestjs/common';
import { Intent, Data, SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

@Controller()
export class AliceRegexController {
  constructor() {}

  // Проверка паттернов и вызов соответствующих обработчиков  
  @Intent()
  checkAndHandlePatterns(@Data() data: any): AliceResponse | null {
    const text = data?.request?.original_utterance || data?.request?.command || '';
    console.log(`🔍 Regex controller checking patterns for: "${text}"`);
    
    // Единый паттерн для всех команд помощи (исключая "что ты умеешь" - это системный интент, "о навыке" - отдельный интент)
    const helpPattern = /(помощь|как\s+пользоваться|инструкция|справка)/i;
    const helpMatch = text.match(helpPattern);
    
    if (helpMatch) {
      console.log(`✅ Regex help pattern matched: "${helpMatch[0]}"`);
      return this.handleUnifiedHelp(data, helpMatch);
    }
    
    return null;
  }

  // Единый обработчик помощи (как в yandexHelp)
  handleUnifiedHelp(_context: any, matches: RegExpMatchArray): AliceResponse {
    console.log(`🎯 UNIFIED HELP HANDLER TRIGGERED: "${matches[0]}"`);
    
    try {
      const command = matches[0].toLowerCase();
      
      // Для всех команд помощи - краткий ответ
      console.log(`🎯 General help - returning brief response`);
      return new SkillResponseBuilder(
        'Привет! Я помогу определить ваши ценности. ' +
        'Скажите "о навыке" для подробной информации или "начать тест" чтобы сразу начать.'
      )
        .setButtons([
          { title: "О навыке", hide: true },
          { title: "Начать тест", hide: true }
        ])
        .build();
        
    } catch (error) {
      console.error(`❌ Error in regex handleUnifiedHelp:`, error);
      return new SkillResponseBuilder('Извините, произошла ошибка. Скажите "начать тест" для начала.')
        .setButtons([
          { title: "Начать тест", hide: true }
        ])
        .build();
    }
  }

  // Обработчик помощи (общие вопросы) - УСТАРЕЛ
  handleHelp(_context: any, matches: RegExpMatchArray): AliceResponse {
    console.log(`🎯 HELP HANDLER TRIGGERED: "${matches[0]}"`);
    
    return new SkillResponseBuilder(
      'Привет! Я помогу разобраться с навыком. ' +
      'Чтобы узнать подробности о навыке, скажите "о навыке". ' +
      'Чтобы начать тест, скажите "начать тест".'
    )
      .setButtons([
        { title: "О навыке", hide: true },
        { title: "Начать тест", hide: true }
      ])
      .build();
  }

  // Обработчик информации о навыке
  handleAbout(_context: any, matches: RegExpMatchArray): AliceResponse {
    console.log(`🎯 ABOUT HANDLER TRIGGERED: "${matches[0]}"`);
    
    try {
      const response = new SkillResponseBuilder(
        'Я навык для определения ценностей по модели Спиральной динамики. ' +
        'Провожу тест из 24 вопросов, показываю ваши ТОП-3 уровня ценностей, ' +
        'даю подробное описание каждого уровня и объясняю результаты с баллами. ' +
        'Готовы начать тест?'
      )
        .setButtons([
          { title: "Начать тест", hide: true },
          { title: "Нет, спасибо", hide: true }
        ])
        .build();
      
      console.log(`✅ RegexController about response built successfully`);
      return response;
    } catch (error) {
      console.error(`❌ Error in handleAbout:`, error);
      return new SkillResponseBuilder(
        'Извините, произошла ошибка. Попробуйте сказать "начать тест".'
      ).build();
    }
  }

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