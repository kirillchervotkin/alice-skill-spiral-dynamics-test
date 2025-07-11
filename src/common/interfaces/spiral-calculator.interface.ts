import { SpiralLevel } from '../../types/spiral-levels.enum';
import { SpiralTest } from '../../types/test.interface';
import { UserAnswer } from '../../types/answers.interface';
import { LevelScores, SpiralProfile } from '../../types/results.interface';

/**
 * Интерфейс для расчета результатов спиральной динамики
 */
export interface ISpiralCalculator {
  /**
   * Рассчитать баллы по каждому уровню на основе ответов
   * @param answers Ответы пользователя
   * @param test Тест
   * @returns Баллы по уровням
   */
  calculateLevelScores(answers: UserAnswer[], test: SpiralTest): LevelScores;
  
  /**
   * Определить доминирующий уровень
   * @param scores Баллы по уровням
   * @returns Доминирующий уровень
   */
  determineDominantLevel(scores: LevelScores): SpiralLevel;
  
  /**
   * Рассчитать уверенность в результате
   * @param scores Баллы по уровням
   * @param answers Ответы пользователя
   * @param test Тест
   * @returns Уверенность (0-1)
   */
  calculateConfidence(scores: LevelScores, answers: UserAnswer[], test: SpiralTest): number;
  
  /**
   * Рассчитать согласованность ответов
   * @param answers Ответы пользователя
   * @param test Тест
   * @returns Согласованность (0-1)
   */
  calculateConsistency(answers: UserAnswer[], test: SpiralTest): number;
  
  /**
   * Получить вторичные значимые уровни
   * @param scores Баллы по уровням
   * @param threshold Минимальный порог для включения в список
   * @returns Массив вторичных уровней
   */
  getSecondaryLevels(scores: LevelScores, threshold?: number): SpiralLevel[];
  
  /**
   * Нормализовать баллы (привести к процентам)
   * @param scores Исходные баллы
   * @returns Нормализованные баллы
   */
  normalizeScores(scores: LevelScores): LevelScores;
  
  /**
   * Создать профиль спиральной динамики
   * @param scores Баллы по уровням
   * @param dominantLevel Доминирующий уровень
   * @returns Профиль спиральной динамики
   */
  createSpiralProfile(scores: LevelScores, dominantLevel: SpiralLevel): SpiralProfile;
  
  /**
   * Рассчитать надежность результата
   * @param scores Баллы по уровням
   * @param answers Ответы пользователя
   * @param test Тест
   * @returns Надежность (0-1)
   */
  calculateReliability(scores: LevelScores, answers: UserAnswer[], test: SpiralTest): number;
}

/**
 * Конфигурация для расчетов
 */
export interface CalculationConfig {
  /** Минимальная уверенность для валидного результата */
  confidenceThreshold: number;
  
  /** Порог для определения вторичных уровней */
  secondaryLevelThreshold: number;
  
  /** Вес согласованности в общей оценке */
  consistencyWeight: number;
  
  /** Метод нормализации баллов */
  normalizationMethod: 'percentage' | 'zscore' | 'minmax';
  
  /** Учитывать ли веса вопросов */
  useQuestionWeights: boolean;
  
  /** Алгоритм определения доминирующего уровня */
  dominanceAlgorithm: 'highest_score' | 'weighted_average' | 'statistical';
  
  /** Минимальная разница для четкого доминирования */
  minDominanceDifference: number;
}


