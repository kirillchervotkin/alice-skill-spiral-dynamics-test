import { createSpiralDynamicsService } from '../src/index';
import { TestAnswers, UserAnswer } from '../src/types/answers.interface';
import { SpiralLevel } from '../src/types/spiral-levels.enum';

/**
 * Пример использования полного теста спиральной динамики (24 вопроса)
 */
async function fullTestExample() {
  console.log('=== Тест ценностей "Спиральная динамика" (24 вопроса) ===\n');

  const service = createSpiralDynamicsService('./data/tests');

  try {
    // 1. Загружаем полный тест
    const testId = 'spiral-dynamics-24';
    console.log('1. Загрузка теста...');
    const test = await service.getTest(testId);
    console.log(`Название: ${test.name}`);
    console.log(`Описание: ${test.description}`);
    console.log(`Количество вопросов: ${test.questions.length}`);
    console.log(`Инструкция: ${test.metadata?.instructions}`);
    console.log();

    // 2. Показываем примеры вопросов
    console.log('2. Примеры вопросов:');
    console.log(`Вопрос 1: ${test.questions[0].text}`);
    console.log(`Варианты: ${test.questions[0].options.map(o => o.text).join(' / ')}`);
    console.log();
    console.log(`Вопрос 12: ${test.questions[11].text}`);
    console.log(`Варианты: ${test.questions[11].options.map(o => o.text).join(' / ')}`);
    console.log();

    // 3. Создаем пример ответов (симуляция пользователя с GREEN профилем)
    console.log('3. Симуляция ответов пользователя (GREEN профиль):');
    const greenUserAnswers: UserAnswer[] = [
      // Бежевый уровень (вопросы 1, 9, 17) - низкие баллы
      { questionId: 'q1', selectedOptionId: 'q1_no', timestamp: new Date() },
      { questionId: 'q9', selectedOptionId: 'q9_no', timestamp: new Date() },
      { questionId: 'q17', selectedOptionId: 'q17_no', timestamp: new Date() },
      
      // Фиолетовый уровень (вопросы 2, 10, 18) - средние баллы
      { questionId: 'q2', selectedOptionId: 'q2_neutral', timestamp: new Date() },
      { questionId: 'q10', selectedOptionId: 'q10_no', timestamp: new Date() },
      { questionId: 'q18', selectedOptionId: 'q18_neutral', timestamp: new Date() },
      
      // Красный уровень (вопросы 3, 11, 19) - низкие баллы
      { questionId: 'q3', selectedOptionId: 'q3_no', timestamp: new Date() },
      { questionId: 'q11', selectedOptionId: 'q11_no', timestamp: new Date() },
      { questionId: 'q19', selectedOptionId: 'q19_no', timestamp: new Date() },
      
      // Синий уровень (вопросы 4, 12, 20) - средние баллы
      { questionId: 'q4', selectedOptionId: 'q4_neutral', timestamp: new Date() },
      { questionId: 'q12', selectedOptionId: 'q12_neutral', timestamp: new Date() },
      { questionId: 'q20', selectedOptionId: 'q20_no', timestamp: new Date() },
      
      // Оранжевый уровень (вопросы 5, 13, 21) - низкие баллы
      { questionId: 'q5', selectedOptionId: 'q5_no', timestamp: new Date() },
      { questionId: 'q13', selectedOptionId: 'q13_neutral', timestamp: new Date() },
      { questionId: 'q21', selectedOptionId: 'q21_neutral', timestamp: new Date() },
      
      // Зеленый уровень (вопросы 6, 14, 22) - высокие баллы!
      { questionId: 'q6', selectedOptionId: 'q6_yes', timestamp: new Date() },
      { questionId: 'q14', selectedOptionId: 'q14_yes', timestamp: new Date() },
      { questionId: 'q22', selectedOptionId: 'q22_yes', timestamp: new Date() },
      
      // Желтый уровень (вопросы 7, 15, 23) - средние баллы
      { questionId: 'q7', selectedOptionId: 'q7_neutral', timestamp: new Date() },
      { questionId: 'q15', selectedOptionId: 'q15_neutral', timestamp: new Date() },
      { questionId: 'q23', selectedOptionId: 'q23_neutral', timestamp: new Date() },
      
      // Бирюзовый уровень (вопросы 8, 16, 24) - высокие баллы
      { questionId: 'q8', selectedOptionId: 'q8_yes', timestamp: new Date() },
      { questionId: 'q16', selectedOptionId: 'q16_yes', timestamp: new Date() },
      { questionId: 'q24', selectedOptionId: 'q24_yes', timestamp: new Date() }
    ];

    const testAnswers: TestAnswers = {
      testId,
      answers: greenUserAnswers,
      userId: 'green-user',
      sessionId: 'green-session',
      startedAt: new Date(),
      completedAt: new Date(),
      metadata: {
        userAgent: 'Example Script',
        device: 'Desktop',
        language: 'ru'
      }
    };

    console.log(`Создано ${greenUserAnswers.length} ответов`);
    console.log();

    // 4. Валидация ответов
    console.log('4. Валидация ответов:');
    const validation = await service.validateAnswers(testAnswers);
    console.log(`Валидация пройдена: ${validation.isValid}`);
    if (validation.warnings.length > 0) {
      console.log('Предупреждения:', validation.warnings.length);
    }
    console.log();

    // 5. Расчет результата
    console.log('5. Расчет результата:');
    const result = await service.calculateResult(testAnswers);
    
    console.log(`Доминирующий уровень: ${result.dominantLevel.toUpperCase()}`);
    console.log(`Уверенность: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`Согласованность: ${(result.consistency * 100).toFixed(1)}%`);
    console.log(`Надежность: ${(result.reliability * 100).toFixed(1)}%`);
    console.log();

    // 6. ТОП-3 уровня (как в оригинальном алгоритме)
    console.log('6. ТОП-3 уровня ценностей:');
    const levelScores = Object.entries(result.levelScores)
      .map(([level, score]) => ({ level: level as SpiralLevel, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    levelScores.forEach((item, index) => {
      const levelMeta = require('../src/types/spiral-levels.enum').SPIRAL_LEVELS_META[item.level];
      console.log(`${index + 1} место: ${levelMeta.name} (${levelMeta.color}) - ${item.score} баллов`);
    });
    console.log();

    // 7. Интерпретация результатов
    console.log('7. Интерпретация результатов:');
    levelScores.forEach((item, index) => {
      let interpretation = '';
      if (item.score >= 5) {
        interpretation = 'Доминирующий уровень - ярко выражен';
      } else if (item.score >= 3) {
        interpretation = 'Вторичный уровень - присутствует';
      } else {
        interpretation = 'Слабо выражен';
      }
      console.log(`${index + 1}. ${item.level.toUpperCase()}: ${item.score} баллов - ${interpretation}`);
    });
    console.log();

    // 8. Рекомендации
    console.log('8. Рекомендации:');
    result.recommendations.forEach((recommendation, index) => {
      console.log(`${index + 1}. ${recommendation}`);
    });
    console.log();

    console.log('=== Тест завершен успешно ===');

  } catch (error) {
    console.error('Ошибка при выполнении теста:', error);
  }
}

/**
 * Пример с разными профилями
 */
async function differentProfilesExample() {
  console.log('\n=== Сравнение разных профилей ===\n');

  const service = createSpiralDynamicsService('./data/tests');
  const testId = 'spiral-dynamics-24';

  // BLUE профиль (порядок, правила, иерархия)
  const blueAnswers: TestAnswers = {
    testId,
    answers: [
      // Высокие баллы для BLUE (вопросы 4, 12, 20)
      { questionId: 'q4', selectedOptionId: 'q4_yes', timestamp: new Date() },
      { questionId: 'q12', selectedOptionId: 'q12_yes', timestamp: new Date() },
      { questionId: 'q20', selectedOptionId: 'q20_yes', timestamp: new Date() },
      // Остальные вопросы - нейтрально или отрицательно
      { questionId: 'q1', selectedOptionId: 'q1_neutral', timestamp: new Date() },
      { questionId: 'q2', selectedOptionId: 'q2_neutral', timestamp: new Date() },
      { questionId: 'q3', selectedOptionId: 'q3_no', timestamp: new Date() },
      { questionId: 'q5', selectedOptionId: 'q5_neutral', timestamp: new Date() },
      { questionId: 'q6', selectedOptionId: 'q6_neutral', timestamp: new Date() },
      { questionId: 'q7', selectedOptionId: 'q7_neutral', timestamp: new Date() },
      { questionId: 'q8', selectedOptionId: 'q8_neutral', timestamp: new Date() },
      { questionId: 'q9', selectedOptionId: 'q9_no', timestamp: new Date() },
      { questionId: 'q10', selectedOptionId: 'q10_neutral', timestamp: new Date() },
      { questionId: 'q11', selectedOptionId: 'q11_no', timestamp: new Date() },
      { questionId: 'q13', selectedOptionId: 'q13_neutral', timestamp: new Date() },
      { questionId: 'q14', selectedOptionId: 'q14_neutral', timestamp: new Date() },
      { questionId: 'q15', selectedOptionId: 'q15_no', timestamp: new Date() },
      { questionId: 'q16', selectedOptionId: 'q16_neutral', timestamp: new Date() },
      { questionId: 'q17', selectedOptionId: 'q17_no', timestamp: new Date() },
      { questionId: 'q18', selectedOptionId: 'q18_no', timestamp: new Date() },
      { questionId: 'q19', selectedOptionId: 'q19_no', timestamp: new Date() },
      { questionId: 'q21', selectedOptionId: 'q21_no', timestamp: new Date() },
      { questionId: 'q22', selectedOptionId: 'q22_neutral', timestamp: new Date() },
      { questionId: 'q23', selectedOptionId: 'q23_neutral', timestamp: new Date() },
      { questionId: 'q24', selectedOptionId: 'q24_neutral', timestamp: new Date() }
    ],
    userId: 'blue-user',
    sessionId: 'blue-session',
    startedAt: new Date(),
    completedAt: new Date()
  };

  try {
    console.log('Анализ BLUE профиля (Порядок/Долг):');
    const blueResult = await service.calculateResult(blueAnswers);
    console.log(`Доминирующий уровень: ${blueResult.dominantLevel.toUpperCase()}`);
    console.log(`Балл BLUE: ${blueResult.levelScores.blue}`);
    console.log(`Уверенность: ${(blueResult.confidence * 100).toFixed(1)}%`);
    console.log();

  } catch (error) {
    console.error('Ошибка при анализе профилей:', error);
  }
}

// Запуск примеров
if (require.main === module) {
  (async () => {
    await fullTestExample();
    await differentProfilesExample();
  })();
}
