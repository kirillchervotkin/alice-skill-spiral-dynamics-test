import { Injectable } from '@nestjs/common';
import { ISpiralCalculator } from '../../common/interfaces/spiral-calculator.interface';
import { 
  TestAnswers, 
  UserAnswer 
} from '../../common/interfaces/answers.interface';
import { 
  LevelScores, 
  SpiralProfile 
} from '../../common/interfaces/results.interface';
import { SpiralTest } from '../../common/interfaces/test.interface';
import { SpiralLevel } from '../../common/interfaces/spiral-levels.enum';

@Injectable()
export class SpiralCalculatorService implements ISpiralCalculator {
  
  calculateLevelScores(answers: UserAnswer[], test: SpiralTest): LevelScores {
    const scores: LevelScores = {
      [SpiralLevel.BEIGE]: 0,
      [SpiralLevel.PURPLE]: 0,
      [SpiralLevel.RED]: 0,
      [SpiralLevel.BLUE]: 0,
      [SpiralLevel.ORANGE]: 0,
      [SpiralLevel.GREEN]: 0,
      [SpiralLevel.YELLOW]: 0,
      [SpiralLevel.TURQUOISE]: 0,
    };

    // Точный алгоритм согласно спецификации
    for (const answer of answers) {
      const question = test.questions.find(q => q.id === answer.questionId);
      const option = question?.options.find(o => o.id === answer.selectedOptionId);

      if (option?.levelWeights) {
        Object.entries(option.levelWeights).forEach(([level, weight]) => {
          scores[level as SpiralLevel] += weight;
        });
      }
    }

    return scores;
  }

  async calculateScores(answers: TestAnswers): Promise<LevelScores> {
    // Загружаем тест для получения весов
    const testsService = new (await import('../tests/tests.service')).TestsService();
    const test = await testsService.loadTest(answers.testId);

    // Используем точный алгоритм с весами из теста
    return this.calculateLevelScores(answers.answers, test);
  }

  async calculateNormalizedScores(scores: LevelScores): Promise<LevelScores> {
    // TODO: Нормализация баллов (0-1 или проценты)
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return scores;

    const normalized: LevelScores = {} as LevelScores;
    Object.entries(scores).forEach(([level, score]) => {
      normalized[level as SpiralLevel] = score / maxScore;
    });

    return normalized;
  }

  normalizeScores(scores: LevelScores): LevelScores {
    // Синхронная версия нормализации
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return scores;

    const normalized: LevelScores = {} as LevelScores;
    Object.entries(scores).forEach(([level, score]) => {
      normalized[level as SpiralLevel] = score / maxScore;
    });

    return normalized;
  }

  determineDominantLevel(scores: LevelScores): SpiralLevel {
    let maxLevel = SpiralLevel.BEIGE;
    let maxScore = scores[maxLevel];

    Object.entries(scores).forEach(([level, score]) => {
      if (score > maxScore) {
        maxLevel = level as SpiralLevel;
        maxScore = score;
      }
    });

    return maxLevel;
  }

  calculateConfidence(scores: LevelScores, answers: UserAnswer[], test: SpiralTest): number {
    const sortedScores = Object.values(scores).sort((a, b) => b - a);
    const maxScore = sortedScores[0];
    const secondScore = sortedScores[1] || 0;

    // Уверенность зависит от разрыва между первым и вторым местом
    if (maxScore === 0) return 0.1;

    const gap = (maxScore - secondScore) / maxScore;
    const answerCompleteness = answers.length / 24; // Ожидаем 24 вопроса

    return Math.min(0.95, gap * 0.7 + answerCompleteness * 0.3);
  }

  calculateConsistency(answers: UserAnswer[], test: SpiralTest): number {
    if (answers.length === 0) return 0;

    // Проверяем время ответов на согласованность
    const responseTimes = answers
      .map(a => a.responseTime)
      .filter(t => t !== undefined) as number[];

    if (responseTimes.length === 0) return 0.8;

    const avgTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const variance = responseTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / responseTimes.length;
    const stdDev = Math.sqrt(variance);

    // Чем меньше разброс времени ответов, тем выше согласованность
    const consistency = Math.max(0.1, 1 - (stdDev / avgTime));
    return Math.min(0.95, consistency);
  }

  getSecondaryLevels(scores: LevelScores, threshold: number = 0.15): SpiralLevel[] {
    const dominantLevel = this.determineDominantLevel(scores);
    const dominantScore = scores[dominantLevel];
    
    return Object.entries(scores)
      .filter(([level, score]) => 
        level !== dominantLevel && 
        score >= dominantScore * threshold
      )
      .sort(([, a], [, b]) => b - a)
      .map(([level]) => level as SpiralLevel);
  }

  calculateReliability(scores: LevelScores, answers: UserAnswer[], test: SpiralTest): number {
    const completeness = answers.length / 24; // Полнота ответов
    const confidence = this.calculateConfidence(scores, answers, test);
    const consistency = this.calculateConsistency(answers, test);

    // Надежность = среднее от полноты, уверенности и согласованности
    return (completeness + confidence + consistency) / 3;
  }

  async generateProfile(scores: LevelScores, dominantLevel: SpiralLevel): Promise<SpiralProfile> {
    const dominantScore = scores[dominantLevel];
    const secondaryLevels = this.getSecondaryLevels(scores);
    const profileType = this.determineProfileType(scores);
    const developmentDirection = this.determineDevelopmentDirection(scores, dominantLevel);

    return {
      dominantLevel,
      dominantScore,
      secondaryLevels: secondaryLevels.map(level => ({
        level,
        score: scores[level],
        percentage: dominantScore > 0 ? Math.round((scores[level] / dominantScore) * 100) : 0
      })),
      profileType,
      developmentDirection
    };
  }

  private determineDevelopmentDirection(scores: LevelScores, dominantLevel: SpiralLevel): 'ascending' | 'descending' | 'stable' {
    const levels = [
      SpiralLevel.BEIGE, SpiralLevel.PURPLE, SpiralLevel.RED, SpiralLevel.BLUE,
      SpiralLevel.ORANGE, SpiralLevel.GREEN, SpiralLevel.YELLOW, SpiralLevel.TURQUOISE
    ];

    const dominantIndex = levels.indexOf(dominantLevel);
    const higherLevelsScore = levels.slice(dominantIndex + 1).reduce((sum, level) => sum + scores[level], 0);
    const lowerLevelsScore = levels.slice(0, dominantIndex).reduce((sum, level) => sum + scores[level], 0);

    if (higherLevelsScore > lowerLevelsScore * 1.5) return 'ascending';
    if (lowerLevelsScore > higherLevelsScore * 1.5) return 'descending';
    return 'stable';
  }

  createSpiralProfile(scores: LevelScores, dominantLevel: SpiralLevel): SpiralProfile {
    // Синхронная версия создания профиля
    const dominantScore = scores[dominantLevel];
    const secondaryLevels = this.getSecondaryLevels(scores);
    
    return {
      dominantLevel,
      dominantScore,
      secondaryLevels: secondaryLevels.map(level => ({
        level,
        score: scores[level],
        percentage: Math.round((scores[level] / dominantScore) * 100)
      })),
      profileType: this.determineProfileType(scores),
      developmentDirection: 'stable'
    };
  }

  private determineProfileType(scores: LevelScores): 'focused' | 'balanced' | 'transitional' {
    const values = Object.values(scores);
    const max = Math.max(...values);
    const secondMax = Math.max(...values.filter(v => v !== max));
    
    if (max > secondMax * 2) return 'focused';
    if (max < secondMax * 1.5) return 'balanced';
    return 'transitional';
  }
}
