import { ISpiralDynamicsTestService } from './interfaces/test-service.interface';
import { ITestProvider } from './interfaces/test-provider.interface';
import { ISpiralCalculator } from './interfaces/spiral-calculator.interface';
import { FileSystemTestProvider } from './test-provider.service';
import { SpiralCalculator } from './spiral-calculator.service';

import { SpiralTest } from '../types/test.interface';
import { TestAnswers, UserAnswer, AnswerStatistics } from '../types/answers.interface';
import { TestResult, SpiralProfile, LevelDescription, ResultComparison } from '../types/results.interface';
import { ValidationResult, ValidationConfig, ValidationRule, ValidationError, ValidationErrorType, ValidationWarning, ValidationWarningLevel } from '../types/validation.interface';
import { SpiralLevel, SPIRAL_LEVELS_META } from '../types/spiral-levels.enum';

/**
 * Основной сервис для тестирования спиральной динамики
 */
export class SpiralDynamicsTestService implements ISpiralDynamicsTestService {
  private testProvider: ITestProvider;
  private calculator: ISpiralCalculator;
  private validationConfig: ValidationConfig;

  constructor(
    testProvider?: ITestProvider,
    calculator?: ISpiralCalculator,
    validationConfig?: Partial<ValidationConfig>
  ) {
    this.testProvider = testProvider || new FileSystemTestProvider();
    this.calculator = calculator || new SpiralCalculator();

    // Конфигурация валидации по умолчанию
    this.validationConfig = {
      strictMode: false,
      checkCompleteness: true,
      checkConsistency: true,
      minQualityThreshold: 0.7,
      customRules: [],
      ...validationConfig
    };
  }

  async getTest(testId: string): Promise<SpiralTest> {
    return await this.testProvider.loadTest(testId);
  }

  async loadTest(testId: string): Promise<SpiralTest> {
    return await this.testProvider.loadTest(testId);
  }

  async getAvailableTests(): Promise<string[]> {
    return await this.testProvider.getAvailableTests();
  }

  async validateAnswers(answers: TestAnswers, test?: SpiralTest): Promise<ValidationResult> {
    const testToUse = test || await this.testProvider.loadTest(answers.testId);

    // Валидация теста
    const testValidation = this.testProvider.validateTest(testToUse);
    if (!testValidation.isValid) {
      return testValidation;
    }

    // Валидация ответов
    return this.validateUserAnswers(answers.answers, testToUse);
  }

  private validateUserAnswers(answers: UserAnswer[], test: SpiralTest): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Создаем карты для быстрого поиска
    const questionMap = new Map(test.questions.map(q => [q.id, q]));
    const answeredQuestions = new Set(answers.map(a => a.questionId));

    // Проверяем каждый ответ
    answers.forEach((answer, index) => {
      const question = questionMap.get(answer.questionId);
      
      if (!question) {
        errors.push({
          type: ValidationErrorType.INVALID_VALUE,
          code: 'QUESTION_NOT_FOUND',
          message: `Question with ID '${answer.questionId}' not found in test`,
          fieldPath: `answers[${index}].questionId`,
          actual: answer.questionId
        });
        return;
      }

      const option = question.options.find(opt => opt.id === answer.selectedOptionId);
      if (!option) {
        errors.push({
          type: ValidationErrorType.INVALID_VALUE,
          code: 'OPTION_NOT_FOUND',
          message: `Option with ID '${answer.selectedOptionId}' not found for question '${answer.questionId}'`,
          fieldPath: `answers[${index}].selectedOptionId`,
          actual: answer.selectedOptionId
        });
      }
    });

    // Проверяем полноту ответов (если включена в конфигурации)
    if (this.validationConfig.checkCompleteness) {
      const unansweredQuestions = test.questions.filter(q => !answeredQuestions.has(q.id));
      if (unansweredQuestions.length > 0) {
        const completionRate = (answers.length / test.questions.length) * 100;

        if (this.validationConfig.strictMode) {
          errors.push({
            type: ValidationErrorType.INSUFFICIENT_DATA,
            code: 'INCOMPLETE_ANSWERS',
            message: `${unansweredQuestions.length} questions were not answered`,
            field: 'answers',
            expected: test.questions.length,
            actual: answers.length
          });
        } else {
          warnings.push({
            level: completionRate < 50 ? ValidationWarningLevel.HIGH : ValidationWarningLevel.MEDIUM,
            code: 'MISSING_ANSWERS',
            message: `${unansweredQuestions.length} questions were not answered (${completionRate.toFixed(1)}% complete)`,
            field: 'answers',
            suggestion: 'Answer all questions for more accurate results',
            impact: 'May reduce accuracy of spiral dynamics assessment'
          });
        }
      }
    }

    // Проверяем дублирующиеся ответы
    const questionCounts = new Map<string, number>();
    answers.forEach(answer => {
      const count = questionCounts.get(answer.questionId) || 0;
      questionCounts.set(answer.questionId, count + 1);
    });

    questionCounts.forEach((count, questionId) => {
      if (count > 1) {
        errors.push({
          type: ValidationErrorType.DUPLICATE_VALUE,
          code: 'MULTIPLE_ANSWERS',
          message: `Question '${questionId}' was answered ${count} times`,
          field: 'answers',
          context: { questionId, count }
        });
      }
    });

    // Применяем пользовательские правила валидации
    if (this.validationConfig.customRules) {
      this.validationConfig.customRules.forEach(rule => {
        try {
          const ruleError = rule.validator(answers, { test, config: this.validationConfig });
          if (ruleError) {
            errors.push(ruleError);
          }
        } catch (error) {
          warnings.push({
            level: ValidationWarningLevel.LOW,
            code: 'CUSTOM_RULE_ERROR',
            message: `Custom rule '${rule.name}' failed: ${error}`,
            field: 'customRules',
            suggestion: 'Check custom validation rule implementation'
          });
        }
      });
    }

    // Проверка согласованности (если включена)
    if (this.validationConfig.checkConsistency && answers.length > 0) {
      const consistencyScore = this.calculateAnswerConsistency(answers, test);
      if (consistencyScore < 0.3) {
        warnings.push({
          level: ValidationWarningLevel.HIGH,
          code: 'LOW_CONSISTENCY',
          message: `Answer consistency is low (${(consistencyScore * 100).toFixed(1)}%)`,
          field: 'answers',
          suggestion: 'Review answers for contradictions',
          impact: 'May indicate random or inconsistent responses'
        });
      }
    }

    // Подсчет метрик качества
    const totalChecks = test.questions.length + (this.validationConfig.customRules?.length || 0);
    const passedChecks = totalChecks - errors.length - warnings.filter(w => w.level === ValidationWarningLevel.HIGH).length;
    const qualityScore = totalChecks > 0 ? passedChecks / totalChecks : 1;

    const isValid = errors.length === 0 && qualityScore >= this.validationConfig.minQualityThreshold;

    return {
      isValid,
      errors,
      warnings,
      qualityScore,
      summary: {
        totalChecks,
        passedChecks,
        criticalErrors: errors.filter(e => e.type === ValidationErrorType.MISSING_FIELD || e.type === ValidationErrorType.INSUFFICIENT_DATA).length,
        highWarnings: warnings.filter(w => w.level === ValidationWarningLevel.HIGH).length
      },
      validatedAt: new Date(),
      validatorVersion: '1.0.0'
    };
  }

  private calculateAnswerConsistency(answers: UserAnswer[], test: SpiralTest): number {
    // Простой алгоритм проверки согласованности
    // Проверяем, есть ли противоречивые ответы на похожие вопросы

    const levelScores = this.calculator.calculateLevelScores(answers, test);
    const maxScore = Math.max(...Object.values(levelScores));
    const minScore = Math.min(...Object.values(levelScores));

    // Если все баллы одинаковые - низкая согласованность (случайные ответы)
    if (maxScore === minScore) {
      return 0.1;
    }

    // Рассчитываем разброс баллов (чем больше разброс, тем выше согласованность)
    const scoreVariance = Object.values(levelScores).reduce((sum, score) => {
      const mean = Object.values(levelScores).reduce((s, sc) => s + sc, 0) / Object.values(levelScores).length;
      return sum + Math.pow(score - mean, 2);
    }, 0) / Object.values(levelScores).length;

    // Нормализуем в диапазон 0-1
    return Math.min(1, scoreVariance / 10);
  }

  async calculateResult(answers: TestAnswers): Promise<TestResult> {
    // Валидация ответов
    const validation = await this.validateAnswers(answers);
    if (!validation.isValid) {
      throw new Error(`Invalid answers: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    const test = await this.testProvider.loadTest(answers.testId);
    
    // Вычисляем баллы по уровням
    const levelScores = this.calculator.calculateLevelScores(answers.answers, test);
    
    // Определяем доминирующий уровень
    const dominantLevel = this.calculator.determineDominantLevel(levelScores);
    
    // Вычисляем метрики
    const confidence = this.calculator.calculateConfidence(levelScores, answers.answers, test);
    const consistency = this.calculator.calculateConsistency(answers.answers, test);
    const reliability = this.calculator.calculateReliability(levelScores, answers.answers, test);
    
    // Создаем профиль
    const profile = this.calculator.createSpiralProfile(levelScores);
    
    // Получаем вторичные уровни (используются в профиле)
    this.calculator.getSecondaryLevels(levelScores);
    
    // Нормализуем баллы
    const normalizedScores = this.calculator.normalizeScores(levelScores);

    // Создаем рекомендации
    const recommendations = this.generateRecommendations(dominantLevel, profile, confidence);

    const result: TestResult = {
      testId: answers.testId,
      dominantLevel,
      dominantLevelScore: levelScores[dominantLevel],
      levelScores,
      normalizedScores,
      confidence,
      consistency,
      reliability,
      profile,
      levelDescriptions: await this.getAllLevelDescriptions(),
      recommendations,
      developmentAreas: await this.getDevelopmentAreas({
        testId: answers.testId,
        dominantLevel,
        confidence,
        consistency,
        reliability,
        profile
      } as TestResult),
      calculatedAt: new Date(),
      totalQuestions: test.questions.length,
      answeredQuestions: answers.answers.length,
      algorithmVersion: '1.0.0',
      metadata: {
        testDuration: 0, // Будет заполнено позже
        averageResponseTime: 0
      }
    };

    return result;
  }

  private generateRecommendations(
    dominantLevel: SpiralLevel, 
    profile: SpiralProfile, 
    confidence: number
  ): string[] {
    const recommendations: string[] = [];

    // Базовые рекомендации по доминирующему уровню
    switch (dominantLevel) {
      case SpiralLevel.BEIGE:
        recommendations.push(
          "Сосредоточьтесь на обеспечении базовых потребностей и безопасности",
          "Развивайте навыки выживания и самообеспечения",
          "Постепенно расширяйте социальные связи"
        );
        break;
      
      case SpiralLevel.PURPLE:
        recommendations.push(
          "Укрепляйте связи с семьей и близким сообществом",
          "Изучайте традиции и ритуалы своей культуры",
          "Развивайте интуицию и эмоциональный интеллект"
        );
        break;
      
      case SpiralLevel.RED:
        recommendations.push(
          "Направляйте энергию на конструктивные цели",
          "Развивайте лидерские качества и уверенность в себе",
          "Учитесь контролировать импульсы и планировать"
        );
        break;
      
      case SpiralLevel.BLUE:
        recommendations.push(
          "Следуйте четким правилам и принципам",
          "Развивайте дисциплину и самоконтроль",
          "Находите смысл в служении высшим целям"
        );
        break;
      
      case SpiralLevel.ORANGE:
        recommendations.push(
          "Ставьте амбициозные цели и достигайте их",
          "Развивайте предпринимательские навыки",
          "Изучайте новые технологии и методы"
        );
        break;
      
      case SpiralLevel.GREEN:
        recommendations.push(
          "Развивайте эмпатию и навыки сотрудничества",
          "Участвуйте в социальных и экологических проектах",
          "Стремитесь к консенсусу и гармонии в отношениях"
        );
        break;
      
      case SpiralLevel.YELLOW:
        recommendations.push(
          "Интегрируйте различные подходы и перспективы",
          "Развивайте системное мышление",
          "Адаптируйтесь к сложности и неопределенности"
        );
        break;
      
      case SpiralLevel.TURQUOISE:
        recommendations.push(
          "Работайте над глобальными вызовами человечества",
          "Развивайте холистическое мировоззрение",
          "Интегрируйте духовность и науку"
        );
        break;
    }

    // Рекомендации по типу профиля
    switch (profile.profileType) {
      case 'focused':
        recommendations.push("Ваш профиль сфокусирован - развивайте сильные стороны доминирующего уровня");
        break;
      case 'balanced':
        recommendations.push("Ваш профиль сбалансирован - используйте разнообразие подходов");
        break;
      case 'transitional':
        recommendations.push("Вы находитесь в переходном состоянии - изучите возможности роста");
        break;
    }

    // Рекомендации по уверенности
    if (confidence < 0.5) {
      recommendations.push(
        "Результат имеет низкую уверенность - рассмотрите возможность повторного тестирования",
        "Обратитесь к специалисту для более глубокого анализа"
      );
    }

    return recommendations;
  }

  async getTestMetadata(testId: string): Promise<SpiralTest['metadata']> {
    return await this.testProvider.getTestMetadata(testId);
  }

  async testExists(testId: string): Promise<boolean> {
    return await this.testProvider.testExists(testId);
  }

  getAnswerStatistics(answers: TestAnswers, test: SpiralTest): AnswerStatistics {
    const totalQuestions = test.questions.length;
    const answeredQuestions = answers.answers.length;
    const completionRate = (answeredQuestions / totalQuestions) * 100;

    // Подсчет времени ответов (в секундах)
    const responseTimes = answers.answers
      .map(answer => answer.responseTime)
      .filter((time): time is number => time !== undefined);

    // Подсчет распределения по категориям
    const categoryDistribution: Record<string, number> = {};
    answers.answers.forEach(answer => {
      const question = test.questions.find(q => q.id === answer.questionId);
      if (question?.category) {
        categoryDistribution[question.category] = (categoryDistribution[question.category] || 0) + 1;
      }
    });

    return {
      totalQuestions,
      answeredQuestions,
      completionRate,
      averageResponseTime: responseTimes.length > 0
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
        : undefined,
      fastestResponse: responseTimes.length > 0 ? Math.min(...responseTimes) : undefined,
      slowestResponse: responseTimes.length > 0 ? Math.max(...responseTimes) : undefined,
      categoryDistribution
    };
  }

  async calculateDominantLevel(answers: TestAnswers): Promise<SpiralLevel> {
    const test = await this.testProvider.loadTest(answers.testId);
    const levelScores = this.calculator.calculateLevelScores(answers.answers, test);
    return this.calculator.determineDominantLevel(levelScores);
  }

  async getLevelDescription(level: SpiralLevel, _language?: string): Promise<LevelDescription> {
    // language параметр зарезервирован для будущей локализации

    // Полные описания уровней спиральной динамики
    const descriptions: Record<SpiralLevel, Omit<LevelDescription, 'level'>> = {
      [SpiralLevel.BEIGE]: {
        name: 'Выживание',
        description: 'Фокус на выживании: еда, безопасность, здоровье, действия по инстинкту.',
        characteristics: [
          'Инстинктивное поведение',
          'Фокус на базовых потребностях',
          'Автоматические реакции',
          'Минимальное самосознание'
        ],
        values: ['Выживание', 'Безопасность', 'Еда', 'Кров', 'Здоровье'],
        motivations: ['Удовлетворение базовых потребностей', 'Избегание опасности', 'Поиск комфорта'],
        strengths: ['Инстинкт самосохранения', 'Адаптивность к экстремальным условиям'],
        weaknesses: ['Ограниченное планирование', 'Реактивность'],
        developmentTips: ['Обеспечить базовую безопасность', 'Развивать осознанность'],
        typicalRoles: ['Выживающие в экстремальных условиях', 'Люди в кризисных ситуациях'],
        interactionTips: ['Обеспечить безопасность', 'Говорить простым языком', 'Фокус на немедленных потребностях']
      },
      [SpiralLevel.PURPLE]: {
        name: 'Племенной',
        description: 'Сила традиций: ритуалы, духи предков, мистика, верность "своим".',
        characteristics: [
          'Племенное мышление',
          'Ритуальное поведение',
          'Мистическое мировоззрение',
          'Коллективная идентичность'
        ],
        values: ['Традиции', 'Ритуалы', 'Принадлежность к группе', 'Духовность', 'Предки'],
        motivations: ['Сохранение традиций', 'Групповая гармония', 'Духовная связь'],
        strengths: ['Сильные социальные связи', 'Культурная преемственность', 'Эмоциональная поддержка'],
        weaknesses: ['Сопротивление изменениям', 'Ограниченность групповыми рамками'],
        developmentTips: ['Уважать традиции', 'Постепенно вводить новшества', 'Работать через лидеров группы'],
        typicalRoles: ['Хранители традиций', 'Духовные лидеры', 'Члены тесных сообществ'],
        interactionTips: ['Показать уважение к традициям', 'Работать через группу', 'Использовать ритуалы']
      },
      [SpiralLevel.RED]: {
        name: 'Силовой',
        description: 'Мир-джунгли: сила, власть, импульсы, победа любой ценой, "беру что хочу".',
        characteristics: [
          'Импульсивность',
          'Стремление к власти',
          'Эгоцентризм',
          'Агрессивность'
        ],
        values: ['Сила', 'Власть', 'Доминирование', 'Свобода', 'Немедленное удовлетворение'],
        motivations: ['Получение власти', 'Самоутверждение', 'Избегание подчинения'],
        strengths: ['Решительность', 'Способность к быстрым действиям', 'Лидерские качества'],
        weaknesses: ['Импульсивность', 'Игнорирование последствий', 'Конфликтность'],
        developmentTips: ['Направить энергию конструктивно', 'Развивать самоконтроль', 'Учить планированию'],
        typicalRoles: ['Предприниматели-новаторы', 'Военные лидеры', 'Революционеры'],
        interactionTips: ['Быть прямым и честным', 'Показать силу', 'Предложить вызов']
      },
      [SpiralLevel.BLUE]: {
        name: 'Порядок',
        description: 'Основа — порядок: правила, иерархия, долг, абсолютная истина, стабильность.',
        characteristics: [
          'Дисциплинированность',
          'Следование правилам',
          'Иерархическое мышление',
          'Моральность'
        ],
        values: ['Порядок', 'Дисциплина', 'Долг', 'Правила', 'Стабильность', 'Мораль'],
        motivations: ['Поддержание порядка', 'Выполнение долга', 'Служение высшей цели'],
        strengths: ['Надежность', 'Организованность', 'Моральные принципы', 'Стабильность'],
        weaknesses: ['Ригидность', 'Сопротивление изменениям', 'Догматизм'],
        developmentTips: ['Ценить стабильность', 'Работать в рамках правил', 'Показать долгосрочную пользу'],
        typicalRoles: ['Государственные служащие', 'Военные', 'Религиозные деятели', 'Администраторы'],
        interactionTips: ['Следовать процедурам', 'Показать авторитет', 'Апеллировать к долгу']
      },
      [SpiralLevel.ORANGE]: {
        name: 'Достижения',
        description: 'Двигатель прогресса: стратегия, успех, конкуренция, инновации, личные достижения.',
        characteristics: [
          'Ориентация на результат',
          'Конкурентность',
          'Инновационность',
          'Стратегическое мышление'
        ],
        values: ['Успех', 'Достижения', 'Эффективность', 'Инновации', 'Конкуренция', 'Материальное благополучие'],
        motivations: ['Достижение успеха', 'Превосходство над конкурентами', 'Материальное процветание'],
        strengths: ['Целеустремленность', 'Инновационность', 'Эффективность', 'Адаптивность'],
        weaknesses: ['Чрезмерная конкурентность', 'Игнорирование человеческого фактора', 'Краткосрочное мышление'],
        developmentTips: ['Ставить амбициозные цели', 'Поощрять инновации', 'Создавать конкурентную среду'],
        typicalRoles: ['Предприниматели', 'Менеджеры', 'Ученые', 'Инженеры'],
        interactionTips: ['Показать возможности роста', 'Предложить вызов', 'Фокус на результатах']
      },
      [SpiralLevel.GREEN]: {
        name: 'Гармония',
        description: 'Ценность гармонии: равенство, эмпатия, сообщество, консенсус, забота о людях.',
        characteristics: [
          'Эмпатичность',
          'Стремление к равенству',
          'Коллективное принятие решений',
          'Экологическое сознание'
        ],
        values: ['Равенство', 'Гармония', 'Сообщество', 'Эмпатия', 'Экология', 'Справедливость'],
        motivations: ['Создание гармонии', 'Помощь другим', 'Защита окружающей среды'],
        strengths: ['Эмпатия', 'Способность к сотрудничеству', 'Социальная ответственность'],
        weaknesses: ['Избегание конфликтов', 'Медленное принятие решений', 'Идеализм'],
        developmentTips: ['Создавать инклюзивную среду', 'Поощрять сотрудничество', 'Учитывать мнение всех'],
        typicalRoles: ['Социальные работники', 'Экологи', 'Учителя', 'Психологи'],
        interactionTips: ['Показать заботу о людях', 'Создать атмосферу принятия', 'Избегать давления']
      },
      [SpiralLevel.YELLOW]: {
        name: 'Гибкость',
        description: 'Гибкость систем: адаптивность, функциональность, интеграция знаний, видение связей.',
        characteristics: [
          'Системное мышление',
          'Гибкость',
          'Интегративность',
          'Функциональный подход'
        ],
        values: ['Функциональность', 'Адаптивность', 'Системность', 'Интеграция', 'Знания'],
        motivations: ['Понимание сложных систем', 'Интеграция различных подходов', 'Функциональные решения'],
        strengths: ['Системное мышление', 'Гибкость', 'Способность к интеграции', 'Объективность'],
        weaknesses: ['Сложность для понимания другими', 'Отстраненность', 'Перфекционизм'],
        developmentTips: ['Поощрять системный анализ', 'Предоставлять автономию', 'Ценить сложность'],
        typicalRoles: ['Системные аналитики', 'Консультанты', 'Исследователи', 'Архитекторы решений'],
        interactionTips: ['Предоставить данные', 'Обсуждать системы', 'Ценить компетентность']
      },
      [SpiralLevel.TURQUOISE]: {
        name: 'Целостность',
        description: 'Целостность мира: глобальное сознание, холизм, духовность, единство жизни, эволюция.',
        characteristics: [
          'Холистическое мышление',
          'Глобальное сознание',
          'Духовность',
          'Экологическое единство'
        ],
        values: ['Целостность', 'Единство', 'Глобальное сознание', 'Духовность', 'Эволюция'],
        motivations: ['Глобальная гармония', 'Духовное развитие', 'Эволюция сознания'],
        strengths: ['Холистическое видение', 'Духовная мудрость', 'Глобальная перспектива'],
        weaknesses: ['Сложность практической реализации', 'Отрыв от повседневности'],
        developmentTips: ['Поддерживать глобальные инициативы', 'Развивать духовность', 'Интегрировать все уровни'],
        typicalRoles: ['Духовные учителя', 'Глобальные мыслители', 'Экологические активисты'],
        interactionTips: ['Говорить о глобальных вопросах', 'Ценить духовность', 'Поддерживать целостность']
      }
    };

    const desc = descriptions[level];
    return {
      level,
      name: desc.name,
      description: desc.description,
      characteristics: desc.characteristics,
      values: desc.values,
      motivations: desc.motivations,
      developmentTips: desc.developmentTips,
      typicalRoles: desc.typicalRoles,
      strengths: desc.strengths,
      weaknesses: desc.weaknesses,
      interactionTips: desc.interactionTips
    };
  }

  async getAllLevelDescriptions(language?: string): Promise<Record<SpiralLevel, LevelDescription>> {
    const descriptions: Record<SpiralLevel, LevelDescription> = {} as any;

    for (const level of Object.values(SpiralLevel)) {
      descriptions[level] = await this.getLevelDescription(level, language);
    }

    return descriptions;
  }

  compareResults(previousResult: TestResult, currentResult: TestResult): ResultComparison {
    // Анализ изменения доминирующего уровня
    const levelChange = {
      from: previousResult.dominantLevel,
      to: currentResult.dominantLevel,
      changed: previousResult.dominantLevel !== currentResult.dominantLevel
    };

    // Анализ изменений в баллах
    const scoreChanges: Record<SpiralLevel, {
      previous: number;
      current: number;
      change: number;
      changePercentage: number;
    }> = {} as any;

    Object.values(SpiralLevel).forEach(level => {
      const prevScore = previousResult.levelScores[level];
      const currScore = currentResult.levelScores[level];
      const change = currScore - prevScore;
      const changePercentage = prevScore > 0 ? (change / prevScore) * 100 : 0;

      scoreChanges[level] = {
        previous: prevScore,
        current: currScore,
        change,
        changePercentage
      };
    });

    // Определение общей тенденции развития
    const levelOrder = [
      SpiralLevel.BEIGE, SpiralLevel.PURPLE, SpiralLevel.RED, SpiralLevel.BLUE,
      SpiralLevel.ORANGE, SpiralLevel.GREEN, SpiralLevel.YELLOW, SpiralLevel.TURQUOISE
    ];

    const prevIndex = levelOrder.indexOf(previousResult.dominantLevel);
    const currIndex = levelOrder.indexOf(currentResult.dominantLevel);

    let developmentTrend: 'ascending' | 'descending' | 'stable' | 'fluctuating';

    if (currIndex > prevIndex) {
      developmentTrend = 'ascending';
    } else if (currIndex < prevIndex) {
      developmentTrend = 'descending';
    } else {
      // Проверяем общие изменения в баллах
      const totalChange = Object.values(scoreChanges).reduce((sum, change) => sum + Math.abs(change.change), 0);
      developmentTrend = totalChange > 2 ? 'fluctuating' : 'stable';
    }

    // Интерпретация изменений
    const interpretation: string[] = [];

    if (levelChange.changed) {
      const direction = currIndex > prevIndex ? 'более высокий' : 'более низкий';
      interpretation.push(`Переход с уровня ${SPIRAL_LEVELS_META[levelChange.from].name} на ${direction} уровень ${SPIRAL_LEVELS_META[levelChange.to].name}`);
    } else {
      interpretation.push(`Доминирующий уровень остался прежним: ${SPIRAL_LEVELS_META[levelChange.to].name}`);
    }

    const significantChanges = Object.entries(scoreChanges)
      .filter(([, change]) => Math.abs(change.changePercentage) > 20)
      .map(([level, change]) => {
        const direction = change.change > 0 ? 'увеличился' : 'уменьшился';
        return `Балл уровня ${SPIRAL_LEVELS_META[level as SpiralLevel].name} ${direction} на ${Math.abs(change.changePercentage).toFixed(1)}%`;
      });

    interpretation.push(...significantChanges);

    if (interpretation.length === 1) {
      interpretation.push('Значительных изменений в профиле не обнаружено');
    }

    return {
      previousResult,
      currentResult,
      levelChange,
      scoreChanges,
      developmentTrend,
      interpretation
    };
  }

  async getRecommendations(result: TestResult): Promise<string[]> {
    return this.generateRecommendations(result.dominantLevel, result.profile, result.confidence);
  }

  async getDevelopmentAreas(result: TestResult): Promise<string[]> {
    const areas: string[] = [];

    if (result.confidence < 0.7) {
      areas.push('Повышение самосознания и понимания своих ценностей');
    }

    if (result.consistency < 0.6) {
      areas.push('Развитие последовательности в поведении и решениях');
    }

    // Добавляем области на основе доминирующего уровня
    const levelMeta = SPIRAL_LEVELS_META[result.dominantLevel];
    if (levelMeta.order < 6) {
      areas.push('Развитие системного мышления');
      areas.push('Расширение перспективы и гибкости');
    }

    return areas;
  }
}
