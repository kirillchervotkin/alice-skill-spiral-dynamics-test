/**
 * Ответ пользователя на один вопрос
 */
export interface UserAnswer {
  /** Идентификатор вопроса */
  questionId: string;
  
  /** Идентификатор выбранного варианта ответа */
  selectedOptionId: string;
  
  /** Время ответа на вопрос */
  timestamp?: Date;
  
  /** Время, потраченное на ответ (в секундах) */
  responseTime?: number;
}

/**
 * Полный набор ответов пользователя на тест
 */
export interface TestAnswers {
  /** Идентификатор теста */
  testId: string;
  
  /** Идентификатор пользователя (опционально) */
  userId?: string;
  
  /** Идентификатор сессии */
  sessionId?: string;
  
  /** Массив ответов на вопросы */
  answers: UserAnswer[];
  
  /** Время начала тестирования */
  startedAt?: Date;
  
  /** Время завершения тестирования */
  completedAt?: Date;
  
  /** Общее время прохождения теста (в секундах) */
  totalDuration?: number;
  
  /** Дополнительные метаданные */
  metadata?: {
    /** Устройство, с которого проходился тест */
    device?: string;
    
    /** Браузер или приложение */
    userAgent?: string;
    
    /** Язык интерфейса */
    language?: string;
    
    /** Часовой пояс */
    timezone?: string;
  };
}

/**
 * Статистика ответов пользователя
 */
export interface AnswerStatistics {
  /** Общее количество вопросов в тесте */
  totalQuestions: number;
  
  /** Количество отвеченных вопросов */
  answeredQuestions: number;
  
  /** Процент завершенности */
  completionRate: number;
  
  /** Среднее время ответа на вопрос (в секундах) */
  averageResponseTime?: number;
  
  /** Самый быстрый ответ (в секундах) */
  fastestResponse?: number;
  
  /** Самый медленный ответ (в секундах) */
  slowestResponse?: number;
  
  /** Распределение ответов по категориям вопросов */
  categoryDistribution?: Record<string, number>;

  /** Паттерн ответов */
  responsePattern?: Record<string, any>;

  /** Метрики качества */
  qualityMetrics?: {
    consistency: number;
    reliability: number;
  };
}
