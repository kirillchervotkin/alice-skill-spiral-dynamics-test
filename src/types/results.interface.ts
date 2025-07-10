import { SpiralLevel } from './spiral-levels.enum';

/**
 * Баллы по каждому уровню спиральной динамики
 */
export interface LevelScores {
  [SpiralLevel.BEIGE]: number;
  [SpiralLevel.PURPLE]: number;
  [SpiralLevel.RED]: number;
  [SpiralLevel.BLUE]: number;
  [SpiralLevel.ORANGE]: number;
  [SpiralLevel.GREEN]: number;
  [SpiralLevel.YELLOW]: number;
  [SpiralLevel.TURQUOISE]: number;
}

/**
 * Описание уровня спиральной динамики
 */
export interface LevelDescription {
  /** Уровень */
  level: SpiralLevel;
  
  /** Название уровня */
  name: string;
  
  /** Краткое описание */
  description: string;
  
  /** Основные характеристики */
  characteristics: string[];
  
  /** Ключевые ценности */
  values: string[];
  
  /** Мотивации и стремления */
  motivations: string[];
  
  /** Рекомендации по развитию */
  developmentTips?: string[];
  
  /** Типичные профессии и роли */
  typicalRoles?: string[];
  
  /** Сильные стороны */
  strengths?: string[];
  
  /** Потенциальные слабости */
  weaknesses?: string[];

  /** Вызовы и трудности */
  challenges?: string[];

  /** Ключевые слова */
  keywords?: string[];

  /** Примеры */
  examples?: string[];
  
  /** Как взаимодействовать с людьми этого уровня */
  interactionTips?: string[];
}

/**
 * Анализ профиля спиральной динамики
 */
export interface SpiralProfile {
  /** Доминирующий уровень */
  dominantLevel: SpiralLevel;
  
  /** Балл доминирующего уровня */
  dominantScore: number;
  
  /** Вторичные значимые уровни (с баллами выше порога) */
  secondaryLevels: Array<{
    level: SpiralLevel;
    score: number;
    percentage: number;
  }>;
  
  /** Тип профиля (сфокусированный, сбалансированный, переходный) */
  profileType: 'focused' | 'balanced' | 'transitional';
  
  /** Направление развития */
  developmentDirection?: 'ascending' | 'descending' | 'stable';
}

/**
 * Результат тестирования спиральной динамики
 */
export interface TestResult {
  // === Основной результат ===
  /** Доминирующий уровень */
  dominantLevel: SpiralLevel;
  
  /** Балл доминирующего уровня */
  dominantLevelScore: number;
  
  // === Детальные баллы ===
  /** Баллы по всем уровням */
  levelScores: LevelScores;
  
  /** Нормализованные баллы (в процентах) */
  normalizedScores: LevelScores;
  
  // === Метрики качества ===
  /** Уверенность в результате (0-1) */
  confidence: number;
  
  /** Согласованность ответов (0-1) */
  consistency: number;
  
  /** Надежность результата (0-1) */
  reliability: number;
  
  // === Анализ профиля ===
  /** Профиль спиральной динамики */
  profile: SpiralProfile;

  /** Вторичные значимые уровни */
  secondaryLevels: SpiralLevel[];
  
  // === Описания и рекомендации ===
  /** Описания всех уровней */
  levelDescriptions: Record<SpiralLevel, LevelDescription>;
  
  /** Персонализированные рекомендации */
  recommendations: string[];
  
  /** Области для развития */
  developmentAreas: string[];
  
  // === Метаданные ===
  /** Идентификатор теста */
  testId: string;
  
  /** Время расчета результата */
  calculatedAt: Date;
  
  /** Общее количество вопросов в тесте */
  totalQuestions: number;
  
  /** Количество отвеченных вопросов */
  answeredQuestions: number;
  
  /** Версия алгоритма расчета */
  algorithmVersion: string;
  
  /** Дополнительные метаданные */
  metadata?: {
    /** Время прохождения теста */
    testDuration?: number;

    /** Средняя скорость ответов */
    averageResponseTime?: number;

    /** Распределение по категориям вопросов */
    categoryBreakdown?: Record<string, LevelScores>;

    /** Время расчета результата */
    calculatedAt?: Date;

    /** Версия системы */
    version?: string;
  };
}

/**
 * Сравнение результатов (для повторных тестирований)
 */
export interface ResultComparison {
  /** Предыдущий результат */
  previousResult: TestResult;
  
  /** Текущий результат */
  currentResult: TestResult;
  
  /** Изменения в доминирующем уровне */
  levelChange: {
    from: SpiralLevel;
    to: SpiralLevel;
    changed: boolean;
  } | 'stable' | 'ascending' | 'descending';
  
  /** Изменения в баллах */
  scoreChanges: Record<SpiralLevel, {
    previous: number;
    current: number;
    change: number;
    changePercentage: number;
  }>;
  
  /** Общая тенденция развития */
  developmentTrend: 'ascending' | 'descending' | 'stable' | 'fluctuating';

  /** Направление развития (алиас для developmentTrend) */
  developmentDirection: 'ascending' | 'descending' | 'stable';

  /** Области для улучшения */
  improvementAreas: string[];

  /** Рекомендации по развитию */
  recommendations: string[];

  /** Интерпретация изменений */
  interpretation: string[];
}
