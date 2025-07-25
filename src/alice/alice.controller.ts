import { Controller, Req } from '@nestjs/common';
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
  ) { }

  // Базовый обработчик для всех запросов (когда интент не определен)
  @Intent()
  defaultHandler(@Data() data: any, @Req() req: any): AliceResponse {
    console.log(`DEFAULT HANDLER: data=`, JSON.stringify(data, null, 2));

    const command = req?.body?.request?.command?.toLowerCase() || '';
    const intents = req?.body?.request?.nlu?.intents || {};

    // Проверяем команды "опиши [цвет]"
    if (command.includes('опиши')) {
      const { results } = data;

      // Определяем цвет из команды
      let requestedLevel = null;
      if (command.includes('красный')) requestedLevel = 'red';
      else if (command.includes('желтый')) requestedLevel = 'yellow';
      else if (command.includes('зеленый')) requestedLevel = 'green';
      else if (command.includes('синий')) requestedLevel = 'blue';
      else if (command.includes('оранжевый')) requestedLevel = 'orange';
      else if (command.includes('фиолетовый')) requestedLevel = 'purple';
      else if (command.includes('бежевый')) requestedLevel = 'beige';
      else if (command.includes('бирюзовый')) requestedLevel = 'turquoise';

      if (requestedLevel && results) {
        // Показываем описание конкретного цвета
        try {
          console.log(`🎨 Trying to describe level: ${requestedLevel}`);
          return this.describeSpecificLevel(requestedLevel, results, data);
        } catch (error) {
          console.error(`❌ Error in describeSpecificLevel:`, error);
          return new SkillResponseBuilder(
            `Ошибка при получении описания ${requestedLevel}. Попробуй "подробнее" для общего описания.`
          )
            .setButtons([
              { title: "Подробнее", hide: false },
              { title: "Повтори результаты", hide: false },
              { title: "Заново", hide: false }
            ])
            .setData(data)
            .build();
        }
      } else if (results) {
        // Показываем доминирующий уровень
        const topLevel = results.top3[0];
        const description = this.spiralService.getLevelDescription(topLevel.level);
        return new SkillResponseBuilder(
          `Подробнее о вашем доминирующем уровне:\n\n${topLevel.fullName}\n\n${description}\n\nВаш результат: ${topLevel.score} баллов`
        )
          .setButtons([
            { title: "Повтори результаты", hide: false },
            { title: "Заново", hide: false }
          ])
          .setData(data)
          .build();
      } else {
        return new SkillResponseBuilder('Сначала пройди тест, чтобы узнать свои результаты.')
          .setButtons([{ title: "Заново", hide: true }])
          .build();
      }
    }

    // Проверяем, есть ли интент spiral.describe
    if (intents['spiral.describe']) {
      return this.describeLevel(data);
    }

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

  // Согласие начать тест (только в приветствии)
  @Intent('YANDEX.CONFIRM')
  @Intent('spiral.yes')
  agreeToStart(@Data() data: any): AliceResponse {
    console.log(`🎯 AGREE TO START CALLED`);
    console.log(`📊 Session data:`, JSON.stringify(data, null, 2));

    const { state } = data;
    console.log(`🔄 Current state:`, state);

    // Если состояние не определено или welcome - начинаем тест
    // Это покрывает случай пустых данных сессии от Яндекс.Диалогов
    if (!state || state === 'welcome') {
      console.log(`✅ Starting first question`);
      return this.startFirstQuestion();
    }

    // В других состояниях это ошибка
    console.log(`❌ Wrong state for agreement: ${state}`);
    return this.handleError(data);
  }

  // Отказ от теста (только в приветствии)
  @Intent('spiral.no')
  @Intent('YANDEX.REJECT')
  exit(@Data() data: any): AliceResponse {
    console.log(`⏱️ SPIRAL.NO START`);
    console.log(`📊 Session data:`, JSON.stringify(data, null, 2));

    const { state, currentQuestion } = data;
    console.log(`🔄 State: ${state}, Current Question: ${currentQuestion}`);

    // Если в состоянии приветствия, завершаем навык
    if (state === 'welcome') {
      console.log(`✅ Welcome state - exiting skill`);
      return new SkillResponseBuilder('Всегда рада помочь. Обращайтесь!')
        .setEndSession()
        .build();
    }

    // Если во время тестирования, обрабатываем как ответ "нет"
    if (state === 'testing') {
      console.log(`✅ Testing state - processing NO answer`);
      return this.processAnswerWithScore(data, 0);
    }

    // Если состояние не определено, но есть данные теста, продолжаем тестирование
    if (!state && data.currentQuestion && data.answers) {
      console.log(`✅ No state but has test data - processing NO answer`);
      return this.processAnswerWithScore(data, 0);
    }

    // Если данные полностью пустые (первый запуск), считаем это отказом от теста
    if (!state && !data.currentQuestion && !data.answers) {
      console.log(`✅ Empty data - exiting skill`);
      return new SkillResponseBuilder('Всегда рада помочь. Обращайтесь!')
        .setEndSession()
        .build();
    }

    console.log(`❌ Unhandled case - showing error`);
    return this.handleError(data);
  }

  // Ответы на вопросы теста
  @Intent('spiral.answer.yes')
  answerYes(@Data() data: any): AliceResponse {
    console.log(`⏱️ ANSWER YES START`);
    console.log(`📊 Session data:`, JSON.stringify(data, null, 2));

    const { state, currentQuestion } = data;
    console.log(`🔄 State: ${state}, Current Question: ${currentQuestion}`);

    // Если в состоянии приветствия, переадресуем на согласие начать тест
    if (state === 'welcome') {
      console.log(`✅ Welcome state - starting test`);
      return this.agreeToStart(data);
    }

    // Только во время тестирования
    if (state === 'testing') {
      console.log(`✅ Testing state - processing answer`);
      return this.processAnswerWithScore(data, 2);
    }

    // Если состояние не определено, но есть данные теста, продолжаем тестирование
    if (!state && data.currentQuestion && data.answers) {
      console.log(`✅ No state but has test data - continuing test`);
      return this.processAnswerWithScore(data, 2);
    }

    // Если данные полностью пустые (первый запуск), считаем это согласием начать тест
    if (!state && !data.currentQuestion && !data.answers) {
      console.log(`✅ Empty data - starting test`);
      return this.agreeToStart(data);
    }

    console.log(`❌ Unhandled case - showing error`);
    return this.handleError(data);
  }

  @Intent('spiral.answer.no')
  answerNo(@Data() data: any): AliceResponse {
    console.log(`⏱️ ANSWER NO START`);
    console.log(`📊 Session data:`, JSON.stringify(data, null, 2));

    const { state, currentQuestion } = data;
    console.log(`🔄 State: ${state}, Current Question: ${currentQuestion}`);

    // Если в состоянии приветствия, переадресуем на отказ от теста
    if (state === 'welcome') {
      console.log(`✅ Welcome state - exiting skill`);
      return this.exit(data);
    }

    // Только во время тестирования
    if (state === 'testing') {
      console.log(`✅ Testing state - processing NO answer`);
      return this.processAnswerWithScore(data, 0);
    }

    // Если состояние не определено, но есть данные теста, продолжаем тестирование
    if (!state && data.currentQuestion && data.answers) {
      console.log(`✅ No state but has test data - processing NO answer`);
      return this.processAnswerWithScore(data, 0);
    }

    // Если данные полностью пустые (первый запуск), считаем это отказом от теста
    if (!state && !data.currentQuestion && !data.answers) {
      console.log(`✅ Empty data - exiting skill`);
      return this.exit(data);
    }

    console.log(`❌ Unhandled case - showing error`);
    return this.handleError(data);
  }

  @Intent('spiral.answer.unsure')
  answerUnsure(@Data() data: any): AliceResponse {
    console.log(`⏱️ ANSWER UNSURE START`);
    console.log(`📊 Session data:`, JSON.stringify(data, null, 2));

    const { state, currentQuestion } = data;
    console.log(`🔄 State: ${state}, Current Question: ${currentQuestion}`);

    // Только во время тестирования
    if (state === 'testing') {
      console.log(`✅ Testing state - processing UNSURE answer`);
      return this.processAnswerWithScore(data, 1);
    }

    // Если состояние не определено, но есть данные теста, продолжаем тестирование
    if (!state && data.currentQuestion && data.answers) {
      console.log(`✅ No state but has test data - processing UNSURE answer`);
      return this.processAnswerWithScore(data, 1);
    }

    console.log(`❌ Unhandled case - showing error`);
    return this.handleError(data);
  }

  // Повтор вопроса
  @Intent('spiral.repeat')
  repeatQuestion(@Data() data: any): AliceResponse {
    console.log(`⏱️ REPEAT START`);
    console.log(`📊 Session data:`, JSON.stringify(data, null, 2));

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
  pauseTest(@Data() data: any): AliceResponse {
    console.log(`⏱️ PAUSE START`);
    console.log(`📊 Session data:`, JSON.stringify(data, null, 2));

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
  continueTest(@Data() data: any): AliceResponse {
    console.log(`⏱️ CONTINUE START`);
    console.log(`📊 Session data:`, JSON.stringify(data, null, 2));

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
  @Intent('spiral.details') // Добавляем интент для кнопки "Подробнее"
  describeLevel(@Data() data: any): AliceResponse {
    console.log(`\n🚨🚨🚨 DESCRIBE LEVEL CALLED! 🚨🚨🚨`);
    console.log(`⏱️ DESCRIBE START`);
    console.log(`📊 Session data:`, JSON.stringify(data, null, 2));

    const { results } = data;

    // Определяем, какой уровень запрашивается из интента
    const requestedLevel = this.getRequestedLevelFromIntent(data);
    console.log(`🎨 Requested level: ${requestedLevel}`);

    if (requestedLevel) {
      console.log(`✅ Found specific level: ${requestedLevel}, calling describeSpecificLevel`);
      // Если запрашивается конкретный цвет, показываем его описание
      return this.describeSpecificLevel(requestedLevel, results, data);
    }

    console.log(`❌ No specific level found, showing dominant level`);
    console.log(`📋 Results:`, JSON.stringify(results, null, 2));

    // Если интент общий, показываем описание доминирующего уровня
    if (!results) {
      return new SkillResponseBuilder('Сначала пройди тест, чтобы узнать свои результаты.')
        .setButtons([{ title: "Заново", hide: true }])
        .build();
    }

    const topLevel = results.top3[0];
    const description = this.spiralService.getLevelDescription(topLevel.level);

    return new SkillResponseBuilder(
      `Подробнее о вашем доминирующем уровне:\n\n${topLevel.fullName}\n\n${description}\n\nВаш результат: ${topLevel.score} баллов`
    )
      .setButtons([
        { title: "Повтори результаты", hide: false },
        { title: "Заново", hide: false }
      ])
      .setData(data)
      .build();
  }

  // Повтор результатов
  @Intent('spiral.repeat_results')
  repeatResults(@Data() data: any): AliceResponse {
    console.log(`⏱️ REPEAT RESULTS START`);
    console.log(`📊 Session data:`, JSON.stringify(data, null, 2));

    const { results } = data;
    if (!results) {
      return new SkillResponseBuilder('Сначала пройди тест, чтобы узнать свои результаты.')
        .setButtons([{ title: "Заново", hide: true }])
        .build();
    }

    const voiceText = this.spiralService.formatResultsForVoice(results);

    return new SkillResponseBuilder(voiceText)
      .setButtons([
        { title: "Подробнее", hide: false },
        { title: "Заново", hide: false }
      ])
      .setData(data)
      .build();
  }

  // Отправка результатов
  @Intent('spiral.send')
  sendResults(@Data() data: any): AliceResponse {
    console.log(`⏱️ SEND START`);
    console.log(`📊 Session data:`, JSON.stringify(data, null, 2));

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
  handleError(@Data() data: any): AliceResponse {
    console.log(`⏱️ ERROR START`);
    console.log(`📊 Session data:`, JSON.stringify(data, null, 2));

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
    const { currentQuestion = 1, answers = [] } = data || {};

    console.log(`Processing answer: currentQuestion=${currentQuestion}, score=${score}, answersCount=${answers.length}`);

    // Сохраняем ответ
    const newAnswers = [...answers, { questionId: currentQuestion, score }];

    // Проверяем, закончились ли вопросы (это был 24-й вопрос)
    if (currentQuestion >= 24) {
      console.log('Test completed, showing results');
      return this.calculateAndShowResults(newAnswers);
    }

    // Следующий вопрос
    const nextQuestion = currentQuestion + 1;
    const question = this.questionsService.getQuestion(nextQuestion);

    if (!question) {
      console.log(`Question ${nextQuestion} not found`);
      return new SkillResponseBuilder('Ошибка: вопрос не найден. Завершаем тест.')
        .setEndSession()
        .build();
    }

    console.log(`Showing question ${nextQuestion}`);

    const responseData = {
      currentQuestion: nextQuestion,
      answers: newAnswers,
      state: 'testing'
    };

    return new SkillResponseBuilder(
      `Вопрос ${nextQuestion} из 24: ${question.text}`
    )
      .setButtons([
        { title: "Да", hide: true },
        { title: "Нет", hide: true },
        { title: "Не уверен", hide: true }
      ])
      .setData(responseData)
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
        { title: "Подробнее", hide: false },
        { title: "Повтори результаты", hide: false },
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
    // ID изображений из консоли Яндекс.Диалогов (реальные ID)
    const imageMap: Record<string, string> = {
      'turquoise': '997614/035c2c7bc56c9e209993',      // Бирюзовый - Глобальность
      'green': '213044/e580b554f5b7392becf8',          // Зеленый - Гармония и Равенство
      'orange': '1030494/e0bb2184b0de6b684de0',        // Оранжевый - Успех и Конкуренция
      'purple': '1533899/62bbc8d31b97a367737a',        // Фиолетовый - Магия и Племенной
      'yellow': '1533899/7fd88249cb352eff8683',        // Желтый - Гибкость и Системы
      'red': '1521359/5e49979b32cb8b93af7f',           // Красный - Власть и Сила
      'blue': '13200873/8e7d386a0dd846ed17e0',         // Синий - Порядок и Долг
      'beige': '1030494/022efd253558a2baea16'          // Бежевый - Выживание
    };

    return imageMap[level] || '1030494/022efd253558a2baea16';
  }

  /**
   * Определяет запрашиваемый уровень из команды пользователя
   */
  private getRequestedLevelFromIntent(data: any): string | null {
    // Проверяем текст команды на наличие названий цветов
    const command = data?.request?.command?.toLowerCase() || '';

    console.log(`🔍 Analyzing command: "${command}"`);

    if (command.includes('бежевый') || command.includes('beige')) {
      console.log(`✅ Found beige in command`);
      return 'beige';
    }
    if (command.includes('фиолетовый') || command.includes('purple')) {
      console.log(`✅ Found purple in command`);
      return 'purple';
    }
    if (command.includes('красный') || command.includes('red')) {
      console.log(`✅ Found red in command`);
      return 'red';
    }
    if (command.includes('синий') || command.includes('blue')) {
      console.log(`✅ Found blue in command`);
      return 'blue';
    }
    if (command.includes('оранжевый') || command.includes('orange')) {
      console.log(`✅ Found orange in command`);
      return 'orange';
    }
    if (command.includes('зеленый') || command.includes('green')) {
      console.log(`✅ Found green in command`);
      return 'green';
    }
    if (command.includes('желтый') || command.includes('yellow')) {
      console.log(`✅ Found yellow in command`);
      return 'yellow';
    }
    if (command.includes('бирюзовый') || command.includes('turquoise')) {
      console.log(`✅ Found turquoise in command`);
      return 'turquoise';
    }

    console.log(`❌ No color found in command`);
    return null;
  }

  /**
   * Показывает описание конкретного уровня
   */
  private describeSpecificLevel(level: string, results: TestResult | undefined, sessionData: any): AliceResponse {
    try {
      console.log(`🎨 describeSpecificLevel called with level: ${level}`);

      // Маппинг строк к enum SpiralLevel
      const levelMap: Record<string, string> = {
        'red': 'red',
        'blue': 'blue', 
        'orange': 'orange',
        'green': 'green',
        'yellow': 'yellow',
        'turquoise': 'turquoise',
        'purple': 'purple',
        'beige': 'beige'
      };

      const spiralLevel = levelMap[level];
      if (!spiralLevel) {
        console.error(`❌ Unknown level: ${level}`);
        return new SkillResponseBuilder(`Неизвестный уровень: ${level}`)
          .setButtons([{ title: "Заново", hide: false }])
          .setData(sessionData)
          .build();
      }

      // Безопасное получение описания
      let description = '';
      let levelMeta = '';

      try {
        description = this.spiralService.getLevelDescription(spiralLevel as any);
        console.log(`✅ Got description: ${description.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Error getting description:`, error);
        description = 'Описание временно недоступно.';
      }

      try {
        levelMeta = this.spiralService.getLevelFullName(spiralLevel as any);
        console.log(`✅ Got level meta: ${levelMeta}`);
      } catch (error) {
        console.error(`❌ Error getting level meta:`, error);
        levelMeta = `Уровень ${level}`;
      }

      // Если есть результаты теста, показываем балл пользователя для этого уровня
      let userScore = '';
      if (results && results.allScores) {
        const score = results.allScores[level as keyof typeof results.allScores] || 0;
        const interpretation = this.getScoreInterpretation(score);
        userScore = `\n\nВаш результат по этому уровню: ${score} баллов - ${interpretation}`;
        console.log(`✅ Got user score: ${score} баллов`);
      }

      const responseText = `${levelMeta}\n\n${description}${userScore}`;
      console.log(`✅ Final response text: ${responseText.substring(0, 100)}...`);

      return new SkillResponseBuilder(responseText)
        .setButtons([
          { title: "Повтори результаты", hide: false },
          { title: "Заново", hide: false },
          { title: "Выход", hide: false }
        ])
        .setData(sessionData)
        .build();

    } catch (error) {
      console.error(`❌ Critical error in describeSpecificLevel:`, error);
      return new SkillResponseBuilder(
        `Извини, произошла ошибка при получении описания уровня ${level}. Попробуй "подробнее" для общего описания.`
      )
        .setButtons([
          { title: "Подробнее", hide: false },
          { title: "Повтори результаты", hide: false },
          { title: "Заново", hide: false }
        ])
        .setData(sessionData)
        .build();
    }
  }

  /**
   * Интерпретация баллов для конкретного уровня
   */
  private getScoreInterpretation(score: number): string {
    if (score >= 5) {
      return 'Доминирующий уровень. Эти ценности наиболее ярко выражены в вашем текущем мировоззрении и поведении.';
    } else if (score >= 3) {
      return 'Вторичный уровень. Эти ценности присутствуют и влияют на вас, но не являются основными.';
    } else {
      return 'Слабо выражен. Эти ценности в данный момент мало актуальны для вас или сознательно отвергаются.';
    }
  }
}
