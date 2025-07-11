import { ISpiralCalculator, CalculationConfig } from './interfaces/spiral-calculator.interface';
import { SpiralLevel, SPIRAL_LEVELS_META } from '../types/spiral-levels.enum';
import { SpiralTest } from '../types/test.interface';
import { UserAnswer } from '../types/answers.interface';
import { LevelScores, SpiralProfile } from '../types/results.interface';

/**
 * Реализация калькулятора спиральной динамики
 */
export class SpiralCalculator implements ISpiralCalculator {
  private config: CalculationConfig;

  constructor(config: Partial<CalculationConfig> = {}) {
    this.config = {
      confidenceThreshold: config.confidenceThreshold || 0.7,
      secondaryLevelThreshold: config.secondaryLevelThreshold || 0.15,
      consistencyWeight: config.consistencyWeight || 0.3,
      normalizationMethod: config.normalizationMethod || 'percentage',
      useQuestionWeights: config.useQuestionWeights ?? true,
      dominanceAlgorithm: config.dominanceAlgorithm || 'highest_score',
      minDominanceDifference: config.minDominanceDifference || 0.1
    };
  }

  calculateLevelScores(answers: UserAnswer[], test: SpiralTest): LevelScores {
    // Инициализируем баллы нулями
    const scores: LevelScores = {
      [SpiralLevel.BEIGE]: 0,
      [SpiralLevel.PURPLE]: 0,
      [SpiralLevel.RED]: 0,
      [SpiralLevel.BLUE]: 0,
      [SpiralLevel.ORANGE]: 0,
      [SpiralLevel.GREEN]: 0,
      [SpiralLevel.YELLOW]: 0,
      [SpiralLevel.TURQUOISE]: 0
    };

    // Создаем карту вопросов для быстрого поиска
    const questionMap = new Map(test.questions.map(q => [q.id, q]));

    // Обрабатываем каждый ответ
    answers.forEach(answer => {
      const question = questionMap.get(answer.questionId);
      if (!question) return;

      // Находим выбранный вариант ответа
      const selectedOption = question.options.find(opt => opt.id === answer.selectedOptionId);
      if (!selectedOption) return;

      // Получаем вес вопроса
      const questionWeight = this.config.useQuestionWeights ? (question.weight || 1.0) : 1.0;

      // Добавляем баллы для каждого уровня
      Object.entries(selectedOption.levelWeights).forEach(([level, weight]) => {
        if (level in scores) {
          scores[level as SpiralLevel] += weight * questionWeight;
        }
      });
    });

    return scores;
  }

  determineDominantLevel(scores: LevelScores): SpiralLevel {
    switch (this.config.dominanceAlgorithm) {
      case 'highest_score':
        return this.findHighestScoringLevel(scores);
      
      case 'weighted_average':
        return this.findWeightedDominantLevel(scores);
      
      case 'statistical':
        return this.findStatisticalDominantLevel(scores);
      
      default:
        return this.findHighestScoringLevel(scores);
    }
  }

  private findHighestScoringLevel(scores: LevelScores): SpiralLevel {
    let maxScore = -1;
    let dominantLevel = SpiralLevel.BEIGE;

    Object.entries(scores).forEach(([level, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantLevel = level as SpiralLevel;
      }
    });

    return dominantLevel;
  }

  private findWeightedDominantLevel(scores: LevelScores): SpiralLevel {
    // Учитываем порядок уровней - более высокие уровни получают небольшой бонус
    const weightedScores: Record<SpiralLevel, number> = {} as any;
    
    Object.entries(scores).forEach(([level, score]) => {
      const levelMeta = SPIRAL_LEVELS_META[level as SpiralLevel];
      const orderBonus = levelMeta.order * 0.01; // Небольшой бонус за более высокий уровень
      weightedScores[level as SpiralLevel] = score + orderBonus;
    });

    return this.findHighestScoringLevel(weightedScores);
  }

  private findStatisticalDominantLevel(scores: LevelScores): SpiralLevel {
    const scoresArray = Object.values(scores);
    const mean = scoresArray.reduce((sum, score) => sum + score, 0) / scoresArray.length;
    const stdDev = Math.sqrt(
      scoresArray.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scoresArray.length
    );

    // Ищем уровень, который значительно превышает среднее
    let dominantLevel = SpiralLevel.BEIGE;
    let maxZScore = -Infinity;

    Object.entries(scores).forEach(([level, score]) => {
      const zScore = stdDev > 0 ? (score - mean) / stdDev : 0;
      if (zScore > maxZScore) {
        maxZScore = zScore;
        dominantLevel = level as SpiralLevel;
      }
    });

    return dominantLevel;
  }

  calculateConfidence(scores: LevelScores, answers: UserAnswer[], test: SpiralTest): number {
    const scoresArray = Object.values(scores);
    const totalScore = scoresArray.reduce((sum, score) => sum + score, 0);

    if (totalScore === 0) return 0;

    // Находим два самых высоких балла
    const sortedScores = scoresArray.sort((a, b) => b - a);
    const highest = sortedScores[0];
    const secondHighest = sortedScores[1] || 0;

    // Разница между первым и вторым местом
    const dominanceDifference = (highest - secondHighest) / totalScore;

    // Согласованность ответов
    const consistency = this.calculateConsistency(answers, test);

    // Полнота ответов
    const completeness = answers.length / test.questions.length;

    // Итоговая уверенность
    const confidence = (dominanceDifference * 0.4) + (consistency * 0.4) + (completeness * 0.2);

    return Math.min(1, Math.max(0, confidence));
  }

  calculateConsistency(answers: UserAnswer[], test: SpiralTest): number {
    if (answers.length < 2) return 1;

    const questionMap = new Map(test.questions.map(q => [q.id, q]));
    const levelTotals: Record<SpiralLevel, number> = {
      [SpiralLevel.BEIGE]: 0,
      [SpiralLevel.PURPLE]: 0,
      [SpiralLevel.RED]: 0,
      [SpiralLevel.BLUE]: 0,
      [SpiralLevel.ORANGE]: 0,
      [SpiralLevel.GREEN]: 0,
      [SpiralLevel.YELLOW]: 0,
      [SpiralLevel.TURQUOISE]: 0
    };

    let totalAnswers = 0;

    // Подсчитываем веса по каждому ответу
    answers.forEach(answer => {
      const question = questionMap.get(answer.questionId);
      if (!question) return;

      const selectedOption = question.options.find(opt => opt.id === answer.selectedOptionId);
      if (!selectedOption) return;

      Object.entries(selectedOption.levelWeights).forEach(([level, weight]) => {
        if (level in levelTotals) {
          levelTotals[level as SpiralLevel] += weight;
        }
      });

      totalAnswers++;
    });

    if (totalAnswers === 0) return 0;

    // Вычисляем стандартное отклонение
    const averageWeight = Object.values(levelTotals).reduce((sum, total) => sum + total, 0) / Object.keys(levelTotals).length;
    const variance = Object.values(levelTotals).reduce((sum, total) => sum + Math.pow(total - averageWeight, 2), 0) / Object.keys(levelTotals).length;
    const stdDev = Math.sqrt(variance);

    // Согласованность обратно пропорциональна разбросу
    const maxPossibleStdDev = averageWeight; // Максимальный разброс
    const consistency = maxPossibleStdDev > 0 ? 1 - (stdDev / maxPossibleStdDev) : 1;

    return Math.min(1, Math.max(0, consistency));
  }

  getSecondaryLevels(scores: LevelScores, threshold: number = this.config.secondaryLevelThreshold): SpiralLevel[] {
    const normalizedScores = this.normalizeScores(scores);
    const dominantLevel = this.determineDominantLevel(scores);

    return Object.entries(normalizedScores)
      .filter(([level, score]) =>
        level !== dominantLevel &&
        score >= threshold
      )
      .sort(([, a], [, b]) => b - a)
      .map(([level]) => level as SpiralLevel);
  }

  normalizeScores(scores: LevelScores): LevelScores {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    if (totalScore === 0) {
      return { ...scores };
    }

    const normalized: LevelScores = {} as LevelScores;

    switch (this.config.normalizationMethod) {
      case 'percentage':
        Object.entries(scores).forEach(([level, score]) => {
          normalized[level as SpiralLevel] = score / totalScore;
        });
        break;

      case 'zscore':
        const mean = totalScore / Object.keys(scores).length;
        const variance = Object.values(scores).reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / Object.keys(scores).length;
        const stdDev = Math.sqrt(variance);

        Object.entries(scores).forEach(([level, score]) => {
          normalized[level as SpiralLevel] = stdDev > 0 ? (score - mean) / stdDev : 0;
        });
        break;

      case 'minmax':
        const minScore = Math.min(...Object.values(scores));
        const maxScore = Math.max(...Object.values(scores));
        const range = maxScore - minScore;

        Object.entries(scores).forEach(([level, score]) => {
          normalized[level as SpiralLevel] = range > 0 ? (score - minScore) / range : 0;
        });
        break;

      default:
        return { ...scores };
    }

    return normalized;
  }

  createSpiralProfile(scores: LevelScores, config?: CalculationConfig): SpiralProfile {
    const usedConfig = config || this.config;
    const normalizedScores = this.normalizeScores(scores);
    const dominantLevel = this.determineDominantLevel(scores);
    const dominantScore = scores[dominantLevel];

    // Определяем вторичные уровни
    const secondaryLevels = this.getSecondaryLevels(scores, usedConfig.secondaryLevelThreshold)
      .map(level => ({
        level,
        score: scores[level],
        percentage: normalizedScores[level] * 100
      }));

    // Определяем тип профиля
    let profileType: 'focused' | 'balanced' | 'transitional';
    const topThreeScores = Object.values(normalizedScores).sort((a, b) => b - a).slice(0, 3);
    const dominantPercentage = normalizedScores[dominantLevel];

    if (dominantPercentage > 0.5) {
      profileType = 'focused';
    } else if (topThreeScores[0] - topThreeScores[2] < 0.2) {
      profileType = 'balanced';
    } else {
      profileType = 'transitional';
    }

    // Определяем направление развития
    let developmentDirection: 'ascending' | 'descending' | 'stable' | undefined;
    const dominantOrder = SPIRAL_LEVELS_META[dominantLevel].order;
    const secondaryOrders = secondaryLevels.map(sl => SPIRAL_LEVELS_META[sl.level].order);

    if (secondaryOrders.length > 0) {
      const avgSecondaryOrder = secondaryOrders.reduce((sum, order) => sum + order, 0) / secondaryOrders.length;
      if (avgSecondaryOrder > dominantOrder) {
        developmentDirection = 'ascending';
      } else if (avgSecondaryOrder < dominantOrder) {
        developmentDirection = 'descending';
      } else {
        developmentDirection = 'stable';
      }
    }

    return {
      dominantLevel,
      dominantScore,
      secondaryLevels,
      profileType,
      developmentDirection
    };
  }

  calculateReliability(scores: LevelScores, answers: UserAnswer[], test: SpiralTest): number {
    const confidence = this.calculateConfidence(scores, answers, test);
    const consistency = this.calculateConsistency(answers, test);
    const completeness = answers.length / test.questions.length;

    // Проверяем разброс баллов
    const normalizedScores = this.normalizeScores(scores);
    const scoresArray = Object.values(normalizedScores);
    const mean = scoresArray.reduce((sum, score) => sum + score, 0) / scoresArray.length;
    const variance = scoresArray.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scoresArray.length;
    const stabilityScore = 1 - Math.min(1, variance * 2); // Чем меньше разброс, тем выше стабильность

    // Итоговая надежность
    const reliability = (confidence * 0.4) + (consistency * 0.3) + (completeness * 0.2) + (stabilityScore * 0.1);

    return Math.min(1, Math.max(0, reliability));
  }
}
