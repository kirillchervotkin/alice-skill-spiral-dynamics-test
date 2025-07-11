import { createSpiralDynamicsService } from '../src/index';
import { TestAnswers, UserAnswer } from '../src/types/answers.interface';
import { SpiralLevel } from '../src/types/spiral-levels.enum';

/**
 * Пример базового использования сервиса спиральной динамики
 */
async function basicUsageExample() {
  console.log('=== Пример использования сервиса спиральной динамики ===\n');

  // Создаем сервис
  const service = createSpiralDynamicsService('./data/tests');

  try {
    // 1. Получаем список доступных тестов
    console.log('1. Получение списка доступных тестов:');
    const availableTests = await service.getAvailableTests();
    console.log('Доступные тесты:', availableTests);
    console.log();

    // 2. Загружаем тест
    const testId = 'graves-standard';
    console.log(`2. Загрузка теста "${testId}":`);
    const test = await service.getTest(testId);
    console.log(`Название: ${test.name}`);
    console.log(`Описание: ${test.description}`);
    console.log(`Количество вопросов: ${test.questions.length}`);
    console.log();

    // 3. Показываем первый вопрос как пример
    console.log('3. Пример вопроса:');
    const firstQuestion = test.questions[0];
    console.log(`Вопрос: ${firstQuestion.text}`);
    console.log('Варианты ответов:');
    firstQuestion.options.forEach((option, index) => {
      console.log(`  ${index + 1}. ${option.text}`);
    });
    console.log();

    // 4. Создаем пример ответов пользователя
    console.log('4. Создание примера ответов:');
    const userAnswers: UserAnswer[] = [
      {
        questionId: 'q1',
        selectedOptionId: 'q1_c', // Командная работа и гармония
        timestamp: new Date()
      },
      {
        questionId: 'q2',
        selectedOptionId: 'q2_d', // Советуюсь с командой и ищу консенсус
        timestamp: new Date()
      },
      {
        questionId: 'q3',
        selectedOptionId: 'q3_d', // Смысл и цель жизни
        timestamp: new Date()
      },
      {
        questionId: 'q4',
        selectedOptionId: 'q4_c', // Приветствую, если они помогают людям
        timestamp: new Date()
      },
      {
        questionId: 'q5',
        selectedOptionId: 'q5_c', // Демократический и участвующий
        timestamp: new Date()
      }
    ];

    const testAnswers: TestAnswers = {
      testId,
      answers: userAnswers,
      userId: 'example-user',
      sessionId: 'example-session',
      startedAt: new Date(),
      completedAt: new Date(),
      metadata: {
        userAgent: 'Example Script',
        device: 'Desktop',
        language: 'ru'
      }
    };

    console.log(`Создано ${userAnswers.length} ответов`);
    console.log();

    // 5. Валидация ответов
    console.log('5. Валидация ответов:');
    const validation = await service.validateAnswers(testAnswers);
    console.log(`Валидация пройдена: ${validation.isValid}`);
    if (validation.warnings.length > 0) {
      console.log('Предупреждения:', validation.warnings);
    }
    console.log();

    // 6. Расчет результата
    console.log('6. Расчет результата:');
    const result = await service.calculateResult(testAnswers);
    
    console.log(`Доминирующий уровень: ${result.dominantLevel.toUpperCase()}`);
    console.log(`Уверенность: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`Согласованность: ${(result.consistency * 100).toFixed(1)}%`);
    console.log(`Надежность: ${(result.reliability * 100).toFixed(1)}%`);
    console.log();

    // 7. Показываем баллы по уровням
    console.log('7. Баллы по уровням:');
    Object.entries(result.normalizedScores).forEach(([level, score]) => {
      const percentage = (score * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(score * 20));
      console.log(`${level.toUpperCase().padEnd(10)}: ${percentage.padStart(5)}% ${bar}`);
    });
    console.log();

    // 8. Профиль пользователя
    console.log('8. Профиль пользователя:');
    console.log(`Тип профиля: ${result.profile.profileType}`);
    if (result.profile.developmentDirection) {
      console.log(`Направление развития: ${result.profile.developmentDirection}`);
    }
    if (result.profile.secondaryLevels.length > 0) {
      console.log(`Вторичные уровни: ${result.profile.secondaryLevels.map(l => l.level).join(', ').toUpperCase()}`);
    }
    console.log();

    // 9. Рекомендации
    console.log('9. Рекомендации:');
    result.recommendations.forEach((recommendation, index) => {
      console.log(`${index + 1}. ${recommendation}`);
    });
    console.log();

    console.log('=== Пример завершен успешно ===');

  } catch (error) {
    console.error('Ошибка при выполнении примера:', error);
  }
}

/**
 * Пример работы с различными типами ответов
 */
async function differentAnswersExample() {
  console.log('\n=== Пример с различными типами ответов ===\n');

  const service = createSpiralDynamicsService('./data/tests');
  const testId = 'graves-standard';

  // Пример 1: Ответы, указывающие на BLUE уровень
  const blueAnswers: TestAnswers = {
    testId,
    answers: [
      { questionId: 'q1', selectedOptionId: 'q1_a', timestamp: new Date() }, // Стабильность и правила
      { questionId: 'q2', selectedOptionId: 'q2_a', timestamp: new Date() }, // Следую правилам
      { questionId: 'q3', selectedOptionId: 'q3_d', timestamp: new Date() }, // Смысл и цель
      { questionId: 'q4', selectedOptionId: 'q4_a', timestamp: new Date() }, // Избегаю изменений
      { questionId: 'q5', selectedOptionId: 'q5_a', timestamp: new Date() }  // Авторитарный стиль
    ],
    userId: 'blue-user',
    sessionId: 'blue-session',
    startedAt: new Date(),
    completedAt: new Date(),
    metadata: {
      userAgent: 'Example Script',
      device: 'Desktop'
    }
  };

  // Пример 2: Ответы, указывающие на ORANGE уровень
  const orangeAnswers: TestAnswers = {
    testId,
    answers: [
      { questionId: 'q1', selectedOptionId: 'q1_d', timestamp: new Date() }, // Личные достижения
      { questionId: 'q2', selectedOptionId: 'q2_c', timestamp: new Date() }, // Анализ данных
      { questionId: 'q3', selectedOptionId: 'q3_c', timestamp: new Date() }, // Власть и контроль
      { questionId: 'q4', selectedOptionId: 'q4_b', timestamp: new Date() }, // Изменения если выгодны
      { questionId: 'q5', selectedOptionId: 'q5_b', timestamp: new Date() }  // Результат-ориентированный
    ],
    userId: 'orange-user',
    sessionId: 'orange-session',
    startedAt: new Date(),
    completedAt: new Date(),
    metadata: {
      userAgent: 'Example Script',
      device: 'Desktop'
    }
  };

  try {
    // Анализируем BLUE профиль
    console.log('Анализ BLUE профиля:');
    const blueResult = await service.calculateResult(blueAnswers);
    console.log(`Доминирующий уровень: ${blueResult.dominantLevel.toUpperCase()}`);
    console.log(`Уверенность: ${(blueResult.confidence * 100).toFixed(1)}%`);
    console.log(`Тип профиля: ${blueResult.profile.profileType}`);
    console.log();

    // Анализируем ORANGE профиль
    console.log('Анализ ORANGE профиля:');
    const orangeResult = await service.calculateResult(orangeAnswers);
    console.log(`Доминирующий уровень: ${orangeResult.dominantLevel.toUpperCase()}`);
    console.log(`Уверенность: ${(orangeResult.confidence * 100).toFixed(1)}%`);
    console.log(`Тип профиля: ${orangeResult.profile.profileType}`);
    console.log();

  } catch (error) {
    console.error('Ошибка при анализе различных профилей:', error);
  }
}

// Запуск примеров
if (require.main === module) {
  (async () => {
    await basicUsageExample();
    await differentAnswersExample();
  })();
}
