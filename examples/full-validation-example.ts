import { createSpiralDynamicsService } from '../src/index';
import { TestAnswers, UserAnswer } from '../src/types/answers.interface';
import { ValidationConfig, ValidationRule, ValidationError, ValidationErrorType } from '../src/types/validation.interface';
import { SpiralLevel } from '../src/types/spiral-levels.enum';

/**
 * Пример полной валидации с пользовательскими правилами
 */
async function fullValidationExample() {
  console.log('=== Полная валидация с пользовательскими правилами ===\n');

  // Создаем пользовательские правила валидации
  const customRules: ValidationRule[] = [
    {
      name: 'MinimumResponseTime',
      description: 'Проверяет, что пользователь тратил достаточно времени на ответы',
      validator: (answers: UserAnswer[]) => {
        const avgResponseTime = answers
          .filter(a => a.responseTime)
          .reduce((sum, a) => sum + (a.responseTime || 0), 0) / answers.length;
        
        if (avgResponseTime < 2) { // Меньше 2 секунд на вопрос
          return {
            type: ValidationErrorType.INCONSISTENT_DATA,
            code: 'TOO_FAST_RESPONSES',
            message: `Average response time is too fast (${avgResponseTime.toFixed(1)}s). This may indicate random clicking.`,
            field: 'responseTime',
            expected: 2,
            actual: avgResponseTime
          };
        }
        return null;
      },
      applicableFor: ['answers'],
      priority: 1
    },
    {
      name: 'BalancedAnswers',
      description: 'Проверяет, что ответы не слишком однообразные',
      validator: (answers: UserAnswer[], context: any) => {
        const test = context.test;
        if (!test) return null;

        // Подсчитываем распределение ответов
        const optionCounts: Record<string, number> = {};
        answers.forEach(answer => {
          const question = test.questions.find((q: any) => q.id === answer.questionId);
          if (question) {
            const optionIndex = question.options.findIndex((opt: any) => opt.id === answer.selectedOptionId);
            const optionKey = `option_${optionIndex}`;
            optionCounts[optionKey] = (optionCounts[optionKey] || 0) + 1;
          }
        });

        // Проверяем, не выбирает ли пользователь всегда один и тот же вариант
        const maxCount = Math.max(...Object.values(optionCounts));
        const totalAnswers = answers.length;
        
        if (maxCount / totalAnswers > 0.8) { // Более 80% одинаковых ответов
          return {
            type: ValidationErrorType.INCONSISTENT_DATA,
            code: 'MONOTONOUS_ANSWERS',
            message: `${((maxCount / totalAnswers) * 100).toFixed(1)}% of answers are the same option. This may indicate non-thoughtful responses.`,
            field: 'answers',
            context: { distribution: optionCounts }
          };
        }
        return null;
      },
      applicableFor: ['answers'],
      priority: 2
    }
  ];

  // Конфигурация валидации
  const validationConfig: ValidationConfig = {
    strictMode: false,
    checkCompleteness: true,
    checkConsistency: true,
    minQualityThreshold: 0.8,
    customRules
  };

  const service = createSpiralDynamicsService('./data/tests', undefined, validationConfig);

  try {
    // 1. Создаем тестовые ответы с проблемами
    console.log('1. Тестирование с проблемными ответами:');
    
    const problematicAnswers: TestAnswers = {
      testId: 'spiral-dynamics-24',
      answers: [
        // Быстрые ответы (менее 2 секунд)
        { questionId: 'q1', selectedOptionId: 'q1_yes', timestamp: new Date(), responseTime: 0.5 },
        { questionId: 'q2', selectedOptionId: 'q2_yes', timestamp: new Date(), responseTime: 0.3 },
        { questionId: 'q3', selectedOptionId: 'q3_yes', timestamp: new Date(), responseTime: 0.8 },
        { questionId: 'q4', selectedOptionId: 'q4_yes', timestamp: new Date(), responseTime: 0.6 },
        { questionId: 'q5', selectedOptionId: 'q5_yes', timestamp: new Date(), responseTime: 0.4 },
        // Всегда выбираем "Да" - монотонные ответы
        { questionId: 'q6', selectedOptionId: 'q6_yes', timestamp: new Date(), responseTime: 1.0 },
        { questionId: 'q7', selectedOptionId: 'q7_yes', timestamp: new Date(), responseTime: 0.9 },
        { questionId: 'q8', selectedOptionId: 'q8_yes', timestamp: new Date(), responseTime: 0.7 }
      ],
      userId: 'problematic-user',
      sessionId: 'problematic-session',
      startedAt: new Date(),
      completedAt: new Date()
    };

    const validation = await service.validateAnswers(problematicAnswers);
    
    console.log(`Валидация пройдена: ${validation.isValid}`);
    console.log(`Качество: ${(validation.qualityScore! * 100).toFixed(1)}%`);
    console.log(`Ошибок: ${validation.errors.length}`);
    console.log(`Предупреждений: ${validation.warnings.length}`);
    console.log();

    if (validation.errors.length > 0) {
      console.log('Ошибки валидации:');
      validation.errors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.code}] ${error.message}`);
      });
      console.log();
    }

    if (validation.warnings.length > 0) {
      console.log('Предупреждения:');
      validation.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. [${warning.level.toUpperCase()}] ${warning.message}`);
        if (warning.suggestion) {
          console.log(`   Рекомендация: ${warning.suggestion}`);
        }
      });
      console.log();
    }

    if (validation.summary) {
      console.log('Сводка валидации:');
      console.log(`- Всего проверок: ${validation.summary.totalChecks}`);
      console.log(`- Пройдено: ${validation.summary.passedChecks}`);
      console.log(`- Критических ошибок: ${validation.summary.criticalErrors}`);
      console.log(`- Серьезных предупреждений: ${validation.summary.highWarnings}`);
      console.log();
    }

    // 2. Тестирование с хорошими ответами
    console.log('2. Тестирование с качественными ответами:');
    
    const goodAnswers: TestAnswers = {
      testId: 'spiral-dynamics-24',
      answers: [
        { questionId: 'q1', selectedOptionId: 'q1_no', timestamp: new Date(), responseTime: 3.2 },
        { questionId: 'q2', selectedOptionId: 'q2_neutral', timestamp: new Date(), responseTime: 4.1 },
        { questionId: 'q3', selectedOptionId: 'q3_no', timestamp: new Date(), responseTime: 2.8 },
        { questionId: 'q4', selectedOptionId: 'q4_yes', timestamp: new Date(), responseTime: 3.5 },
        { questionId: 'q5', selectedOptionId: 'q5_neutral', timestamp: new Date(), responseTime: 2.9 },
        { questionId: 'q6', selectedOptionId: 'q6_yes', timestamp: new Date(), responseTime: 4.2 },
        { questionId: 'q7', selectedOptionId: 'q7_yes', timestamp: new Date(), responseTime: 3.8 },
        { questionId: 'q8', selectedOptionId: 'q8_neutral', timestamp: new Date(), responseTime: 3.1 },
        { questionId: 'q9', selectedOptionId: 'q9_no', timestamp: new Date(), responseTime: 2.7 },
        { questionId: 'q10', selectedOptionId: 'q10_no', timestamp: new Date(), responseTime: 3.4 },
        { questionId: 'q11', selectedOptionId: 'q11_no', timestamp: new Date(), responseTime: 2.9 },
        { questionId: 'q12', selectedOptionId: 'q12_neutral', timestamp: new Date(), responseTime: 3.6 },
        { questionId: 'q13', selectedOptionId: 'q13_yes', timestamp: new Date(), responseTime: 3.2 },
        { questionId: 'q14', selectedOptionId: 'q14_yes', timestamp: new Date(), responseTime: 4.0 },
        { questionId: 'q15', selectedOptionId: 'q15_neutral', timestamp: new Date(), responseTime: 3.3 },
        { questionId: 'q16', selectedOptionId: 'q16_yes', timestamp: new Date(), responseTime: 3.7 },
        { questionId: 'q17', selectedOptionId: 'q17_no', timestamp: new Date(), responseTime: 2.8 },
        { questionId: 'q18', selectedOptionId: 'q18_no', timestamp: new Date(), responseTime: 3.1 },
        { questionId: 'q19', selectedOptionId: 'q19_no', timestamp: new Date(), responseTime: 2.9 },
        { questionId: 'q20', selectedOptionId: 'q20_neutral', timestamp: new Date(), responseTime: 3.5 },
        { questionId: 'q21', selectedOptionId: 'q21_yes', timestamp: new Date(), responseTime: 3.8 },
        { questionId: 'q22', selectedOptionId: 'q22_yes', timestamp: new Date(), responseTime: 4.1 },
        { questionId: 'q23', selectedOptionId: 'q23_neutral', timestamp: new Date(), responseTime: 3.4 },
        { questionId: 'q24', selectedOptionId: 'q24_yes', timestamp: new Date(), responseTime: 3.9 }
      ],
      userId: 'good-user',
      sessionId: 'good-session',
      startedAt: new Date(),
      completedAt: new Date()
    };

    const goodValidation = await service.validateAnswers(goodAnswers);
    
    console.log(`Валидация пройдена: ${goodValidation.isValid}`);
    console.log(`Качество: ${(goodValidation.qualityScore! * 100).toFixed(1)}%`);
    console.log(`Ошибок: ${goodValidation.errors.length}`);
    console.log(`Предупреждений: ${goodValidation.warnings.length}`);
    console.log();

    // 3. Получение статистики ответов
    console.log('3. Статистика ответов:');
    const test = await service.getTest('spiral-dynamics-24');
    const stats = service.getAnswerStatistics(goodAnswers, test);
    
    console.log(`Всего вопросов: ${stats.totalQuestions}`);
    console.log(`Отвечено: ${stats.answeredQuestions}`);
    console.log(`Завершенность: ${stats.completionRate.toFixed(1)}%`);
    console.log(`Среднее время ответа: ${stats.averageResponseTime?.toFixed(1)}с`);
    console.log(`Самый быстрый ответ: ${stats.fastestResponse?.toFixed(1)}с`);
    console.log(`Самый медленный ответ: ${stats.slowestResponse?.toFixed(1)}с`);
    
    if (stats.categoryDistribution) {
      console.log('Распределение по категориям:');
      Object.entries(stats.categoryDistribution).forEach(([category, count]) => {
        console.log(`- ${category}: ${count} ответов`);
      });
    }

    console.log('\n=== Валидация завершена ===');

  } catch (error) {
    console.error('Ошибка при валидации:', error);
  }
}

// Запуск примера
if (require.main === module) {
  fullValidationExample();
}
