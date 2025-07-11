import { Injectable } from '@nestjs/common';
import { ISpiralDynamicsTestService } from '../../common/interfaces/test-service.interface';
import { TestAnswers } from '../../common/interfaces/answers.interface';
import { TestResult, LevelDescription, ResultComparison, LevelScores } from '../../common/interfaces/results.interface';
import { SpiralTest } from '../../common/interfaces/test.interface';
import { ValidationResult } from '../../common/interfaces/validation.interface';
import { SpiralLevel } from '../../common/interfaces/spiral-levels.enum';
import { SpiralCalculatorService } from './spiral-calculator.service';
import { TestsService } from '../tests/tests.service';
import { ValidationService } from '../validation/validation.service';



@Injectable()
export class SpiralDynamicsService implements ISpiralDynamicsTestService {
  constructor(
    private readonly calculatorService: SpiralCalculatorService,
    private readonly testsService: TestsService,
    private readonly validationService: ValidationService,
  ) {}

  async loadTest(testId: string): Promise<SpiralTest> {
    return this.testsService.loadTest(testId);
  }

  async getAvailableTests(): Promise<string[]> {
    return this.testsService.getAvailableTests();
  }

  async validateAnswers(answers: TestAnswers): Promise<ValidationResult> {
    return this.validationService.validateAnswers(answers);
  }

  async calculateResult(answers: TestAnswers): Promise<TestResult> {
    // Валидация ответов
    const validation = await this.validateAnswers(answers);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Загружаем тест
    const test = await this.loadTest(answers.testId);

    // Расчет баллов
    const levelScores = await this.calculatorService.calculateScores(answers);
    const normalizedScores = await this.calculatorService.calculateNormalizedScores(levelScores);
    const dominantLevel = this.calculatorService.determineDominantLevel(levelScores);

    // Метрики качества
    const confidence = this.calculatorService.calculateConfidence(levelScores, answers.answers, test);
    const consistency = this.calculatorService.calculateConsistency(answers.answers, test);
    const reliability = this.calculatorService.calculateReliability(levelScores, answers.answers, test);
    
    // Профиль
    const profile = await this.calculatorService.generateProfile(levelScores, dominantLevel);
    
    // Описания уровней
    const levelDescriptions = await this.getAllLevelDescriptions();

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
      recommendations: [],
      developmentAreas: [],
      calculatedAt: new Date(),
      totalQuestions: answers.answers.length,
      answeredQuestions: answers.answers.length,
      algorithmVersion: '1.0.0',
      metadata: {
        testDuration: this.calculateTestDuration(answers),
        averageResponseTime: this.calculateAverageResponseTime(answers),
        calculatedAt: new Date(),
        version: '1.0.0',
      },
    };

    // Получаем рекомендации и области развития на основе результата
    result.recommendations = await this.getRecommendations(result);
    result.developmentAreas = await this.getDevelopmentAreas(result);

    return result;
  }

  /**
   * Получить ТОП-3 уровня согласно спецификации
   */
  getTop3Levels(scores: LevelScores): Array<{level: SpiralLevel, name: string, score: number, interpretation: string}> {
    const sortedLevels = Object.entries(scores)
      .map(([level, score]) => ({
        level: level as SpiralLevel,
        score: score as number
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return sortedLevels.map(item => {
      const description = this.getLevelNameByLevel(item.level);
      const interpretation = this.getScoreInterpretation(item.score);

      return {
        level: item.level,
        name: description,
        score: item.score,
        interpretation
      };
    });
  }

  private getLevelNameByLevel(level: SpiralLevel): string {
    const names = {
      [SpiralLevel.BEIGE]: 'Выживание (Бежевый)',
      [SpiralLevel.PURPLE]: 'Магия/Племенной (Фиолетовый)',
      [SpiralLevel.RED]: 'Власть/Сила (Красный)',
      [SpiralLevel.BLUE]: 'Порядок/Долг (Синий)',
      [SpiralLevel.ORANGE]: 'Успех/Конкуренция (Оранжевый)',
      [SpiralLevel.GREEN]: 'Гармония/Равенство (Зеленый)',
      [SpiralLevel.YELLOW]: 'Гибкость/Система (Желтый)',
      [SpiralLevel.TURQUOISE]: 'Глобальность (Бирюзовый)'
    };
    return names[level];
  }

  private getScoreInterpretation(score: number): string {
    if (score >= 5) {
      return 'Доминирующий уровень. Эти ценности наиболее ярко выражены в вашем текущем мировоззрении и поведении. Определяет вашу центральную операционную систему.';
    } else if (score >= 3) {
      return 'Вторичный уровень. Эти ценности присутствуют и влияют на вас, но не являются основными. Могут проявляться в определенных сферах жизни или ситуациях.';
    } else {
      return 'Слабо выражен. Эти ценности в данный момент мало актуальны для вас или сознательно отвергаются.';
    }
  }

  /**
   * Получить результаты в формате для озвучки Алисой
   */
  getFormattedResults(scores: LevelScores): {announcement: string, top3: string[], fullTable: string[]} {
    const top3 = this.getTop3Levels(scores);

    const announcement = "Твои ТОП – 3 уровня ценностей сейчас:";

    const top3Formatted = [
      `Первое место: ${this.getShortLevelName(top3[0].level)} (${this.getColorName(top3[0].level)}) - ${top3[0].score} баллов`,
      `Второе место: ${this.getShortLevelName(top3[1].level)} (${this.getColorName(top3[1].level)}) - ${top3[1].score} баллов`,
      `Третье место: ${this.getShortLevelName(top3[2].level)} (${this.getColorName(top3[2].level)}) - ${top3[2].score} баллов`
    ];

    const fullTable = this.generateFullTable(scores);

    return {
      announcement,
      top3: top3Formatted,
      fullTable
    };
  }

  /**
   * Получить полную таблицу баллов
   */
  getFullTable(scores: LevelScores): {table: string[], summary: string} {
    const table = this.generateFullTable(scores);
    const summary = `Полная таблица баллов по всем 8 уровням спиральной динамики. Максимальный балл для каждого уровня: 6.`;

    return { table, summary };
  }

  private generateFullTable(scores: LevelScores): string[] {
    const allLevels = Object.entries(scores)
      .map(([level, score]) => ({
        level: level as SpiralLevel,
        score: score as number
      }))
      .sort((a, b) => b.score - a.score);

    return allLevels.map((item, index) =>
      `${index + 1}. ${this.getShortLevelName(item.level)} (${this.getColorName(item.level)}) - ${item.score} баллов`
    );
  }

  private getShortLevelName(level: SpiralLevel): string {
    const names = {
      [SpiralLevel.BEIGE]: 'Выживание',
      [SpiralLevel.PURPLE]: 'Магия/Племенной',
      [SpiralLevel.RED]: 'Власть/Сила',
      [SpiralLevel.BLUE]: 'Порядок/Долг',
      [SpiralLevel.ORANGE]: 'Успех/Конкуренция',
      [SpiralLevel.GREEN]: 'Гармония/Равенство',
      [SpiralLevel.YELLOW]: 'Гибкость/Система',
      [SpiralLevel.TURQUOISE]: 'Глобальность'
    };
    return names[level];
  }

  private getColorName(level: SpiralLevel): string {
    const colors = {
      [SpiralLevel.BEIGE]: 'Бежевый',
      [SpiralLevel.PURPLE]: 'Фиолетовый',
      [SpiralLevel.RED]: 'Красный',
      [SpiralLevel.BLUE]: 'Синий',
      [SpiralLevel.ORANGE]: 'Оранжевый',
      [SpiralLevel.GREEN]: 'Зеленый',
      [SpiralLevel.YELLOW]: 'Желтый',
      [SpiralLevel.TURQUOISE]: 'Бирюзовый'
    };
    return colors[level];
  }









  async testExists(testId: string): Promise<boolean> {
    return this.testsService.testExists(testId);
  }

  async getLevelDescription(level: SpiralLevel): Promise<LevelDescription> {
    const descriptions = await this.getAllLevelDescriptions();
    return descriptions[level];
  }

  async getAllLevelDescriptions(): Promise<Record<SpiralLevel, LevelDescription>> {
    // Базовые описания уровней спиральной динамики
    return {
      [SpiralLevel.BEIGE]: {
        level: SpiralLevel.BEIGE,
        name: 'Выживание (Бежевый)',
        description: 'Фокус на выживании: еда, безопасность, здоровье, действия по инстинкту.',
        characteristics: ['Действия по инстинкту', 'Фокус на базовых потребностях', 'Реакция "здесь и сейчас"'],
        values: ['Физическая безопасность', 'Еда и кров', 'Здоровье'],
        motivations: ['Удовлетворение базовых потребностей', 'Выживание', 'Безопасность'],
        developmentTips: ['Развивайте навыки планирования', 'Изучайте социальное взаимодействие']
      },
      [SpiralLevel.PURPLE]: {
        level: SpiralLevel.PURPLE,
        name: 'Магия/Племенной (Фиолетовый)',
        description: 'Сила традиций: ритуалы, духи предков, мистика, верность "своим".',
        characteristics: ['Следование ритуалам', 'Связь с предками', 'Мистическое мышление'],
        values: ['Традиции', 'Ритуалы', 'Духи предков', 'Племенная принадлежность'],
        motivations: ['Принадлежность к группе', 'Духовная защита', 'Сохранение традиций'],
        developmentTips: ['Развивайте критическое мышление', 'Изучайте различные культуры']
      },
      [SpiralLevel.RED]: {
        level: SpiralLevel.RED,
        name: 'Власть/Сила (Красный)',
        description: 'Мир-джунгли: сила, власть, импульсы, победа любой ценой, "беру что хочу".',
        characteristics: ['Импульсивность', 'Стремление к власти', 'Доминирование'],
        values: ['Сила', 'Власть', 'Доминирование', 'Победа'],
        motivations: ['Власть над другими', 'Немедленное удовлетворение', 'Уважение через силу'],
        developmentTips: ['Развивайте самоконтроль', 'Учитесь работать в команде']
      },
      [SpiralLevel.BLUE]: {
        level: SpiralLevel.BLUE,
        name: 'Порядок/Долг (Синий)',
        description: 'Основа — порядок: правила, иерархия, долг, абсолютная истина, стабильность.',
        characteristics: ['Следование правилам', 'Иерархия', 'Дисциплина'],
        values: ['Порядок', 'Долг', 'Правила', 'Абсолютная истина'],
        motivations: ['Стабильность', 'Справедливость', 'Смысл жизни'],
        developmentTips: ['Развивайте гибкость мышления', 'Учитесь принимать разные точки зрения']
      },
      [SpiralLevel.ORANGE]: {
        level: SpiralLevel.ORANGE,
        name: 'Успех/Конкуренция (Оранжевый)',
        description: 'Двигатель прогресса: стратегия, успех, конкуренция, инновации, личные достижения.',
        characteristics: ['Стратегическое мышление', 'Инновации', 'Конкуренция'],
        values: ['Успех', 'Достижения', 'Прогресс', 'Личная свобода'],
        motivations: ['Материальный успех', 'Признание', 'Самореализация'],
        developmentTips: ['Развивайте эмпатию', 'Находите баланс работы и жизни']
      },
      [SpiralLevel.GREEN]: {
        level: SpiralLevel.GREEN,
        name: 'Гармония/Равенство (Зеленый)',
        description: 'Ценность гармонии: равенство, эмпатия, сообщество, консенсус, забота о людях.',
        characteristics: ['Сотрудничество', 'Эмпатия', 'Консенсус'],
        values: ['Равенство', 'Гармония', 'Сообщество', 'Справедливость'],
        motivations: ['Гармония в отношениях', 'Социальная справедливость', 'Забота о людях'],
        developmentTips: ['Развивайте навыки принятия решений', 'Учитесь конструктивно разрешать конфликты']
      },
      [SpiralLevel.YELLOW]: {
        level: SpiralLevel.YELLOW,
        name: 'Гибкость/Система (Желтый)',
        description: 'Гибкость систем: адаптивность, функциональность, интеграция знаний, видение связей.',
        characteristics: ['Адаптивность', 'Системный анализ', 'Интеграция знаний'],
        values: ['Гибкость', 'Функциональность', 'Системность', 'Интеграция'],
        motivations: ['Понимание сложности', 'Эффективность систем', 'Видение связей'],
        developmentTips: ['Развивайте навыки коммуникации', 'Находите единомышленников']
      },
      [SpiralLevel.TURQUOISE]: {
        level: SpiralLevel.TURQUOISE,
        name: 'Глобальность (Бирюзовый)',
        description: 'Целостность мира: глобальное сознание, холизм, духовность, единство жизни, эволюция.',
        characteristics: ['Глобальное сознание', 'Холистическое мышление', 'Духовность'],
        values: ['Глобальность', 'Холизм', 'Единство жизни', 'Эволюция'],
        motivations: ['Глобальная гармония', 'Единство человечества', 'Эволюция сознания'],
        developmentTips: ['Развивайте практические навыки', 'Учитесь работать с разными уровнями']
      }
    };
  }

  compareResults(previousResult: TestResult, currentResult: TestResult): ResultComparison {
    // TODO: Реализовать сравнение результатов
    throw new Error('Method not implemented');
  }

  async getRecommendations(result: TestResult): Promise<string[]> {
    const recommendations: Record<SpiralLevel, string[]> = {
      [SpiralLevel.BEIGE]: [
        'Обеспечьте базовые потребности в безопасности и комфорте',
        'Развивайте навыки планирования и предвидения',
        'Изучайте основы социального взаимодействия'
      ],
      [SpiralLevel.PURPLE]: [
        'Уважайте традиции, но будьте открыты новому опыту',
        'Развивайте критическое мышление наряду с интуицией',
        'Изучайте различные культуры и верования'
      ],
      [SpiralLevel.RED]: [
        'Развивайте самоконтроль и планирование',
        'Учитесь работать в команде и учитывать интересы других',
        'Направляйте энергию на конструктивные цели'
      ],
      [SpiralLevel.BLUE]: [
        'Развивайте гибкость мышления и адаптивность',
        'Учитесь принимать различные точки зрения',
        'Балансируйте правила с творческим подходом'
      ],
      [SpiralLevel.ORANGE]: [
        'Развивайте эмпатию и социальную ответственность',
        'Учитесь ценить процесс, а не только результат',
        'Находите баланс между работой и личной жизнью'
      ],
      [SpiralLevel.GREEN]: [
        'Развивайте навыки принятия решений',
        'Учитесь конструктивно разрешать конфликты',
        'Балансируйте идеализм с практичностью'
      ],
      [SpiralLevel.YELLOW]: [
        'Развивайте навыки коммуникации сложных идей',
        'Учитесь применять системное мышление на практике',
        'Находите единомышленников для обмена идеями'
      ],
      [SpiralLevel.TURQUOISE]: [
        'Развивайте практические навыки воплощения глобальных идей',
        'Учитесь работать с людьми разных уровней развития',
        'Находите баланс между духовностью и материальным миром'
      ]
    };

    return recommendations[result.dominantLevel] || ['Продолжайте развиваться и изучать себя'];
  }

  async getDevelopmentAreas(result: TestResult): Promise<string[]> {
    const developmentAreas: Record<SpiralLevel, string[]> = {
      [SpiralLevel.BEIGE]: [
        'Планирование и предвидение',
        'Социальные навыки',
        'Абстрактное мышление'
      ],
      [SpiralLevel.PURPLE]: [
        'Критическое мышление',
        'Индивидуальность',
        'Научный подход'
      ],
      [SpiralLevel.RED]: [
        'Самоконтроль',
        'Долгосрочное планирование',
        'Эмпатия'
      ],
      [SpiralLevel.BLUE]: [
        'Гибкость мышления',
        'Толерантность к неопределенности',
        'Креативность'
      ],
      [SpiralLevel.ORANGE]: [
        'Социальная ответственность',
        'Эмоциональный интеллект',
        'Экологическое сознание'
      ],
      [SpiralLevel.GREEN]: [
        'Принятие решений',
        'Конфликт-менеджмент',
        'Практичность'
      ],
      [SpiralLevel.YELLOW]: [
        'Коммуникация',
        'Практическое применение',
        'Лидерство'
      ],
      [SpiralLevel.TURQUOISE]: [
        'Практическая реализация',
        'Работа с разными уровнями',
        'Заземление идей'
      ]
    };

    return developmentAreas[result.dominantLevel] || ['Самопознание', 'Личностный рост'];
  }

  getAnswerStatistics(answers: TestAnswers, test: SpiralTest) {
    // TODO: Реализовать расчет статистики
    return {
      totalQuestions: test.questions.length,
      answeredQuestions: answers.answers.length,
      completionRate: answers.answers.length / test.questions.length,
      averageResponseTime: this.calculateAverageResponseTime(answers)
    };
  }

  async getStatistics(answers: TestAnswers) {
    // TODO: Реализовать расчет статистики
    throw new Error('Method not implemented');
  }

  async calculateDominantLevel(answers: TestAnswers): Promise<SpiralLevel> {
    const scores = await this.calculatorService.calculateScores(answers);
    return this.calculatorService.determineDominantLevel(scores);
  }

  private calculateTestDuration(answers: TestAnswers): number {
    if (!answers.startedAt || !answers.completedAt) return 0;
    return answers.completedAt.getTime() - answers.startedAt.getTime();
  }

  private calculateAverageResponseTime(answers: TestAnswers): number {
    const responseTimes = answers.answers
      .map(a => a.responseTime)
      .filter(t => t !== undefined) as number[];
    
    if (responseTimes.length === 0) return 0;
    return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  }
}
