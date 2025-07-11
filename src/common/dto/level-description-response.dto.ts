import { ApiProperty } from '@nestjs/swagger';
import { SpiralLevel } from '../interfaces/spiral-levels.enum';

export class LevelDescriptionResponseDto {
  @ApiProperty({ enum: SpiralLevel, description: 'Уровень спиральной динамики' })
  level: SpiralLevel;

  @ApiProperty({ description: 'Название уровня' })
  name: string;

  @ApiProperty({ description: 'Краткое описание' })
  description: string;

  @ApiProperty({ type: [String], description: 'Основные ценности' })
  coreValues: string[];

  @ApiProperty({ type: [String], description: 'Характерные черты поведения' })
  behaviors: string[];

  @ApiProperty({ type: [String], description: 'Мотивационные факторы' })
  motivations: string[];

  @ApiProperty({ type: [String], description: 'Сильные стороны' })
  strengths: string[];

  @ApiProperty({ type: [String], description: 'Потенциальные слабости' })
  weaknesses: string[];

  @ApiProperty({ description: 'Примерный процент населения с этим уровнем', required: false })
  populationPercentage?: number;

  @ApiProperty({ description: 'Исторический период возникновения', required: false })
  historicalPeriod?: string;
}
