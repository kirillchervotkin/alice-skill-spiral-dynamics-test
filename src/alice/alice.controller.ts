import { Controller } from '@nestjs/common';
import {
  Intent,
  Data,
  SkillResponseBuilder,
  AliceResponse,
  Button,
  BigImageCardBuilder,
  ItemsListCardBuilder,
  ItemsListItemBuilder
} from '@kirillchervotkin/alice-nestjs-framework';
import { SpiralDynamicsService, Answer, TestResult } from '../spiral-dynamics/spiral-dynamics.service';
import { QuestionsService } from '../spiral-dynamics/questions.service';

interface SessionData {
  currentQuestion?: number;
  answers?: Answer[];
  results?: TestResult;
  state?: 'welcome' | 'testing' | 'results' | 'description' | 'paused';
}

@Controller()
export class AliceController {
  constructor(
    private readonly spiralService: SpiralDynamicsService,
    private readonly questionsService: QuestionsService
  ) {}

  // Базовый обработчик для всех запросов (когда интент не определен)
  @Intent()
  defaultHandler(): AliceResponse {
    return this.startWelcome();
  }

  // Обработчик помощи
  @Intent('YANDEX.HELP')
  help(): AliceResponse {
    return new SkillResponseBuilder(
      'Тест покажет, какие ценности сейчас важнее для тебя: выживание, традиции, власть, ' +
      'порядок, успех, гармония, гибкость или глобальное мышление. Просто отвечай честно. ' +
      'Готов начать?'
    )
      .setButtons([
        { title: "Да", hide: true },
        { title: "Нет", hide: true }
      ])
      .setData({ state: 'welcome' })
      .build();
  }

  // Начало теста
  @Intent('spiral.start')
  startTest(): AliceResponse {
    return this.startWelcome();
  }

  // Согласие начать тест
  @Intent('spiral.yes')
  @Intent('spiral.start_test')
  agreeToStart(): AliceResponse {
    return this.startFirstQuestion();
  }

  // Отказ от теста
  @Intent('spiral.no')
  exit(): AliceResponse {
    return new SkillResponseBuilder('Всегда рада помочь. Обращайтесь!')
      .setEndSession()
      .build();
  }

  // Ответы на вопросы
  @Intent('spiral.answer.yes')
  answerYes(@Data() data: SessionData): AliceResponse {
    return this.processAnswerWithScore(data, 2);
  }

  @Intent('spiral.answer.no')
  answerNo(@Data() data: SessionData): AliceResponse {
    return this.processAnswerWithScore(data, 0);
  }

  @Intent('spiral.answer.unsure')
  answerUnsure(@Data() data: SessionData): AliceResponse {
    return this.processAnswerWithScore(data, 1);
  }

  // Повтор вопроса
  @Intent('spiral.repeat')
  repeatQuestion(@Data() data: SessionData): AliceResponse {
    const { currentQuestion = 1 } = data;
    const question = this.questionsService.getQuestion(currentQuestion);
    
    if (!question) {
      return new SkillResponseBuilder('Ошибка: вопрос не найден. Начнем заново?')
        .setButtons([{ title: "Заново", hide: true }])
        .build();
    }
    
    return new SkillResponseBuilder(
      `Вопрос ${currentQuestion} из 24: ${question.text}`
    )
      .setButtons([
        { title: "Да", hide: true },
        { title: "Нет", hide: true },
        { title: "Не уверен", hide: true }
      ])
      .setData(data)
      .build();
  }

  // Пауза теста
  @Intent('spiral.pause')
  pauseTest(@Data() data: SessionData): AliceResponse {
    const { currentQuestion = 1, answers = [] } = data;

    return new SkillResponseBuilder(
      `Тест приостановлен на вопросе ${currentQuestion} из 24. ` +
      `Уже отвечено на ${answers.length} вопросов. ` +
      `Когда будешь готов продолжить, скажи "Продолжить".`
    )
      .setButtons([
        { title: "Продолжить", hide: true },
        { title: "Заново", hide: false },
        { title: "Выход", hide: false }
      ])
      .setData({
        ...data,
        state: 'paused'
      })
      .build();
  }

  // Продолжить тест после паузы
  @Intent('spiral.continue')
  continueTest(@Data() data: SessionData): AliceResponse {
    const { currentQuestion = 1, state } = data;

    if (state !== 'paused') {
      return new SkillResponseBuilder('Тест не был приостановлен. Хочешь начать заново?')
        .setButtons([{ title: "Заново", hide: true }])
        .build();
    }

    const question = this.questionsService.getQuestion(currentQuestion);

    if (!question) {
      return new SkillResponseBuilder('Ошибка: вопрос не найден. Начнем заново?')
        .setButtons([{ title: "Заново", hide: true }])
        .build();
    }

    return new SkillResponseBuilder(
      `Продолжаем! Вопрос ${currentQuestion} из 24: ${question.text}`
    )
      .setButtons([
        { title: "Да", hide: true },
        { title: "Нет", hide: true },
        { title: "Не уверен", hide: true },
        { title: "Пауза", hide: false }
      ])
      .setData({
        ...data,
        state: 'testing'
      })
      .build();
  }

  // Описание уровня
  @Intent('spiral.describe')
  describeLevel(@Data() data: SessionData): AliceResponse {
    const { results } = data;
    if (!results) {
      return new SkillResponseBuilder('Сначала пройди тест, чтобы узнать свои результаты.')
        .setButtons([{ title: "Заново", hide: true }])
        .build();
    }

    const topLevel = results.top3[0];
    const description = this.spiralService.getLevelDescription(topLevel.level);

    // Создаем карточку с большим изображением для описания уровня
    const levelCard = BigImageCardBuilder.create()
      .setImageId(this.getLevelImageId(topLevel.level))
      .setTitle(`${topLevel.fullName}`)
      .setDescription(`${description}\n\nВаш результат: ${topLevel.score} баллов`)
      .setButton({
        title: "Вернуться к результатам",
        hide: false
      })
      .build();

    return new SkillResponseBuilder(
      `Подробнее о вашем доминирующем уровне:`
    )
      .setCard(levelCard)
      .setButtons([
        { title: "Повтори результаты", hide: false },
        { title: "Заново", hide: false },
        { title: "Отправить", hide: false }
      ])
      .setData(data)
      .build();
  }

  // Повтор результатов
  @Intent('spiral.repeat_results')
  repeatResults(@Data() data: SessionData): AliceResponse {
    const { results } = data;
    if (!results) {
      return new SkillResponseBuilder('Сначала пройди тест, чтобы узнать свои результаты.')
        .setButtons([{ title: "Заново", hide: true }])
        .build();
    }

    const voiceText = this.spiralService.formatResultsForVoice(results);

    return new SkillResponseBuilder(voiceText)
      .setButtons([
        { title: `Опиши ${results.top3[0].name}`, hide: false },
        { title: "Заново", hide: false },
        { title: "Отправить", hide: false }
      ])
      .setData(data)
      .build();
  }

  // Отправка результатов
  @Intent('spiral.send')
  sendResults(@Data() data: SessionData): AliceResponse {
    const { results } = data;

    if (!results) {
      return new SkillResponseBuilder(
        'Сначала пройди тест, чтобы получить результаты для отправки.'
      )
        .setButtons([{ title: "Заново", hide: false }])
        .build();
    }

    return new SkillResponseBuilder(
      'К сожалению, функция отправки пока не реализована. ' +
      'Запиши свои результаты или сделай скриншот.'
    )
      .setButtons([
        { title: "Повтори результаты", hide: false },
        { title: "Заново", hide: false }
      ])
      .setData(data)
      .build();
  }

  // Начать заново
  @Intent('spiral.restart')
  restart(): AliceResponse {
    return this.startWelcome();
  }

  // Выход из навыка
  @Intent('spiral.exit')
  exitSkill(): AliceResponse {
    return new SkillResponseBuilder('До свидания! Возвращайся, когда захочешь узнать больше о своих ценностях.')
      .setEndSession()
      .build();
  }

  // Обработка ошибок распознавания во время теста
  @Intent('spiral.error')
  handleError(@Data() data: SessionData): AliceResponse {
    const { currentQuestion = 1, state } = data;

    if (state === 'testing') {
      const question = this.questionsService.getQuestion(currentQuestion);
      return new SkillResponseBuilder(
        'Извини, не поняла ответ. Скажи ДА, НЕТ или НЕ УВЕРЕН. ' +
        `Скажи Повтори, чтобы прослушать вопрос заново.\n\n` +
        `Вопрос ${currentQuestion} из 24: ${question?.text || 'Ошибка загрузки вопроса'}`
      )
        .setButtons([
          { title: "Да", hide: true },
          { title: "Нет", hide: true },
          { title: "Не уверен", hide: true },
          { title: "Повтори", hide: false }
        ])
        .setData(data)
        .build();
    }

    return new SkillResponseBuilder(
      'Извини, не поняла. Попробуй сказать по-другому или скажи "Помощь".'
    )
      .setButtons([{ title: "Помощь", hide: false }])
      .setData(data)
      .build();
  }

  // Приватные методы
  private startWelcome(): AliceResponse {
    const helpButton: Button = { title: "Помощь", hide: false };
    const startButton: Button = { title: "Да", hide: true };
    const noButton: Button = { title: "Нет", hide: true };
    
    return new SkillResponseBuilder(
      'Привет! Я помогу тебе определить твой ведущий уровень ценностей по модели Спиральной динамики. ' +
      'Ответы помогу понять, из каких ценностей ты выбираешь действовать здесь и сейчас.\n\n' +
      'Ответь на 24 утверждения: Да (согласен), Нет (не согласен) или Не уверен (нейтрален). ' +
      'Отвечай интуитивно, первое, что приходит в голову. Готов начать?'
    )
      .setButtons([startButton, noButton, helpButton])
      .setData({ state: 'welcome' })
      .build();
  }

  private startFirstQuestion(): AliceResponse {
    const question = this.questionsService.getQuestion(1);
    
    if (!question) {
      return new SkillResponseBuilder('Ошибка: не удалось загрузить первый вопрос.')
        .setEndSession()
        .build();
    }
    
    return new SkillResponseBuilder(
      `Отлично! Начнём!\n\nВопрос 1 из 24: ${question.text}`
    )
      .setButtons([
        { title: "Да", hide: true },
        { title: "Нет", hide: true },
        { title: "Не уверен", hide: true }
      ])
      .setData({ 
        currentQuestion: 1, 
        answers: [],
        state: 'testing'
      })
      .build();
  }

  private processAnswerWithScore(data: SessionData, score: number): AliceResponse {
    const { currentQuestion = 1, answers = [] } = data;
    
    // Сохраняем ответ
    const newAnswers = [...answers, { questionId: currentQuestion, score }];
    
    // Проверяем, закончились ли вопросы
    if (currentQuestion >= 24) {
      return this.calculateAndShowResults(newAnswers);
    }
    
    // Следующий вопрос
    const nextQuestion = currentQuestion + 1;
    const question = this.questionsService.getQuestion(nextQuestion);
    
    if (!question) {
      return new SkillResponseBuilder('Ошибка: вопрос не найден. Завершаем тест.')
        .setEndSession()
        .build();
    }
    
    return new SkillResponseBuilder(
      `Вопрос ${nextQuestion} из 24: ${question.text}`
    )
      .setButtons([
        { title: "Да", hide: true },
        { title: "Нет", hide: true },
        { title: "Не уверен", hide: true }
      ])
      .setData({ 
        currentQuestion: nextQuestion, 
        answers: newAnswers,
        state: 'testing'
      })
      .build();
  }

  private calculateAndShowResults(answers: Answer[]): AliceResponse {
    const results = this.spiralService.calculateResults(answers);
    const voiceText = this.spiralService.formatResultsForVoice(results);

    // Создаем карточку с результатами
    const resultsCard = this.createResultsCard(results);

    return new SkillResponseBuilder(
      `Спасибо за ответы! Считаю твои результаты...\n\n${voiceText}`
    )
      .setCard(resultsCard)
      .setButtons([
        { title: `Опиши ${results.top3[0].name}`, hide: false },
        { title: "Повтори результаты", hide: false },
        { title: "Отправить", hide: false },
        { title: "Заново", hide: false },
        { title: "Выход", hide: false }
      ])
      .setData({
        results,
        state: 'results'
      })
      .build();
  }

  /**
   * Создает карточку со списком результатов ТОП-3 уровней
   */
  private createResultsCard(results: TestResult) {
    // Создаем элементы для ТОП-3 уровней
    const items = results.top3.map((levelResult, index) => {
      return ItemsListItemBuilder.create()
        .setImageId(this.getLevelImageId(levelResult.level))
        .setTitle(`${index + 1}. ${levelResult.fullName}`)
        .setDescription(`${levelResult.score} баллов - ${levelResult.interpretation}`)
        .setButton({
          title: `Подробнее о ${levelResult.name}`,
          hide: false
        })
        .build();
    });

    return ItemsListCardBuilder.create()
      .setHeader("🎯 Ваши ТОП-3 уровня ценностей")
      .addItem(items[0])
      .addItem(items[1])
      .addItem(items[2])
      .setFooter(
        "Результаты показывают ваши доминирующие ценности",
        { title: "Получить полный отчет", hide: false }
      )
      .build();
  }

  /**
   * Возвращает ID изображения для уровня спиральной динамики
   *
   * ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
   * 1. Загрузите изображения из папки assets/images/ в консоль Яндекс.Диалогов
   * 2. Скопируйте полученные image_id для каждого файла:
   *    - beige_16.9.png → замените 'BEIGE_IMAGE_ID'
   *    - purple_16.9.png → замените 'PURPLE_IMAGE_ID'
   *    - red_16.9.png → замените 'RED_IMAGE_ID'
   *    - blue_16.9.png → замените 'BLUE_IMAGE_ID'
   *    - orange_16.9.png → замените 'ORANGE_IMAGE_ID'
   *    - green_16.9.png → замените 'GREEN_IMAGE_ID'
   *    - yellow_16.9.png → замените 'YELLOW_IMAGE_ID'
   *    - turquoise_16.9.png → замените 'TURQUOISE_IMAGE_ID'
   */
  private getLevelImageId(level: string): string {
    const imageMap: Record<string, string> = {
      'beige': 'BEIGE_IMAGE_ID',        // Замените на реальный ID из Яндекс.Диалогов
      'purple': 'PURPLE_IMAGE_ID',      // Замените на реальный ID из Яндекс.Диалогов
      'red': 'RED_IMAGE_ID',            // Замените на реальный ID из Яндекс.Диалогов
      'blue': 'BLUE_IMAGE_ID',          // Замените на реальный ID из Яндекс.Диалогов
      'orange': 'ORANGE_IMAGE_ID',      // Замените на реальный ID из Яндекс.Диалогов
      'green': 'GREEN_IMAGE_ID',        // Замените на реальный ID из Яндекс.Диалогов
      'yellow': 'YELLOW_IMAGE_ID',      // Замените на реальный ID из Яндекс.Диалогов
      'turquoise': 'TURQUOISE_IMAGE_ID' // Замените на реальный ID из Яндекс.Диалогов
    };

    return imageMap[level] || 'DEFAULT_IMAGE_ID';
  }
}
