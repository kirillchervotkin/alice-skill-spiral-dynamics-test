import { ApiProperty } from '@nestjs/swagger';
import { SpiralLevel } from '../interfaces/spiral-levels.enum';

export class LevelScoresDto {
  @ApiProperty({ description: 'Балл уровня BEIGE' })
  beige: number;

  @ApiProperty({ description: 'Балл уровня PURPLE' })
  purple: number;

  @ApiProperty({ description: 'Балл уровня RED' })
  red: number;

  @ApiProperty({ description: 'Балл уровня BLUE' })
  blue: number;

  @ApiProperty({ description: 'Балл уровня ORANGE' })
  orange: number;

  @ApiProperty({ description: 'Балл уровня GREEN' })
  green: number;

  @ApiProperty({ description: 'Балл уровня YELLOW' })
  yellow: number;

  @ApiProperty({ description: 'Балл уровня TURQUOISE' })
  turquoise: number;
}

export class SecondaryLevelDto {
  @ApiProperty({ enum: SpiralLevel, description: 'Уровень' })
  level: SpiralLevel;

  @ApiProperty({ description: 'Балл уровня' })
  score: number;

  @ApiProperty({ description: 'Процент от доминирующего уровня' })
  percentage: number;
}

export class SpiralProfileDto {
  @ApiProperty({ enum: SpiralLevel, description: 'Доминирующий уровень' })
  dominantLevel: SpiralLevel;

  @ApiProperty({ description: 'Балл доминирующего уровня' })
  dominantScore: number;

  @ApiProperty({ type: [SecondaryLevelDto], description: 'Вторичные уровни' })
  secondaryLevels: SecondaryLevelDto[];

  @ApiProperty({ 
    enum: ['focused', 'balanced', 'transitional'], 
    description: 'Тип профиля' 
  })
  profileType: 'focused' | 'balanced' | 'transitional';

  @ApiProperty({ 
    enum: ['ascending', 'descending', 'stable'], 
    description: 'Направление развития',
    required: false 
  })
  developmentDirection?: 'ascending' | 'descending' | 'stable';
}

export class TestResultMetadataDto {
  @ApiProperty({ description: 'Время прохождения теста в миллисекундах', required: false })
  testDuration?: number;

  @ApiProperty({ description: 'Средняя скорость ответов в миллисекундах', required: false })
  averageResponseTime?: number;

  @ApiProperty({ description: 'Время расчета результата', required: false })
  calculatedAt?: Date;

  @ApiProperty({ description: 'Версия системы', required: false })
  version?: string;
}

export class TestResultResponseDto {
  @ApiProperty({ description: 'ID теста' })
  testId: string;

  @ApiProperty({ enum: SpiralLevel, description: 'Доминирующий уровень' })
  dominantLevel: SpiralLevel;

  @ApiProperty({ description: 'Балл доминирующего уровня' })
  dominantLevelScore: number;

  @ApiProperty({ type: LevelScoresDto, description: 'Баллы по всем уровням' })
  levelScores: LevelScoresDto;

  @ApiProperty({ type: LevelScoresDto, description: 'Нормализованные баллы' })
  normalizedScores: LevelScoresDto;

  @ApiProperty({ description: 'Уверенность в результате (0-1)' })
  confidence: number;

  @ApiProperty({ description: 'Согласованность ответов (0-1)' })
  consistency: number;

  @ApiProperty({ description: 'Надежность результата (0-1)' })
  reliability: number;

  @ApiProperty({ type: SpiralProfileDto, description: 'Профиль спиральной динамики' })
  profile: SpiralProfileDto;

  @ApiProperty({ type: [String], description: 'Персонализированные рекомендации' })
  recommendations: string[];

  @ApiProperty({ type: [String], description: 'Области для развития' })
  developmentAreas: string[];

  @ApiProperty({ description: 'Время расчета результата' })
  calculatedAt: Date;

  @ApiProperty({ description: 'Общее количество вопросов' })
  totalQuestions: number;

  @ApiProperty({ description: 'Количество отвеченных вопросов' })
  answeredQuestions: number;

  @ApiProperty({ description: 'Версия алгоритма расчета' })
  algorithmVersion: string;

  @ApiProperty({ type: TestResultMetadataDto, description: 'Дополнительные метаданные', required: false })
  metadata?: TestResultMetadataDto;
}
