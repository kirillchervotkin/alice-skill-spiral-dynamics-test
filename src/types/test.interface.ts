import { SpiralLevel } from './spiral-levels.enum';

/**
 * Вариант ответа на вопрос теста
 */
export interface TestOption {
  /** Уникальный идентификатор варианта ответа */
  id: string;
  
  /** Текст варианта ответа */
  text: string;
  
  /** Веса для каждого уровня спиральной динамики (0-1) */
  levelWeights: Record<SpiralLevel, number>;
  
  /** Дополнительное описание (опционально) */
  description?: string;
}

/**
 * Вопрос теста спиральной динамики
 */
export interface TestQuestion {
  /** Уникальный идентификатор вопроса */
  id: string;
  
  /** Текст вопроса */
  text: string;
  
  /** Категория вопроса (ценности, поведение, мотивация и т.д.) */
  category?: string;
  
  /** Варианты ответов */
  options: TestOption[];
  
  /** Вес вопроса в общем результате (по умолчанию 1.0) */
  weight?: number;
  
  /** Дополнительный контекст или описание */
  context?: string;
}

/**
 * Полный тест спиральной динамики
 */
export interface SpiralTest {
  /** Уникальный идентификатор теста */
  id: string;
  
  /** Название теста */
  name: string;
  
  /** Описание теста */
  description: string;
  
  /** Версия теста */
  version: string;
  
  /** Автор или источник теста */
  author?: string;
  
  /** Список вопросов */
  questions: TestQuestion[];
  
  /** Метаданные теста */
  metadata?: TestMetadata;
}

/**
 * Метаданные теста
 */
export interface TestMetadata {
  /** Примерное время прохождения в минутах */
  estimatedDuration?: number;

  /** Целевая аудитория */
  targetAudience?: string;

  /** Язык теста */
  language?: string;

  /** Дата создания */
  createdAt?: string;

  /** Дата последнего обновления */
  updatedAt?: string;

  /** Инструкции для прохождения теста */
  instructions?: string;
}

/**
 * Конфигурация для валидации теста
 */
export interface TestValidationConfig {
  /** Минимальное количество вопросов */
  minQuestions: number;
  
  /** Максимальное количество вопросов */
  maxQuestions: number;
  
  /** Минимальное количество вариантов ответа на вопрос */
  minOptionsPerQuestion: number;
  
  /** Максимальное количество вариантов ответа на вопрос */
  maxOptionsPerQuestion: number;
  
  /** Требовать ли веса для всех уровней */
  requireAllLevelWeights: boolean;
  
  /** Максимальная сумма весов для одного варианта ответа */
  maxWeightSum: number;
}
