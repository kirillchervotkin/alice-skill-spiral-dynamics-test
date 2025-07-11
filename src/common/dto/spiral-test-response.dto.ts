import { ApiProperty } from '@nestjs/swagger';

export class TestOptionDto {
  @ApiProperty({ description: 'Уникальный идентификатор варианта ответа' })
  id: string;

  @ApiProperty({ description: 'Текст варианта ответа' })
  text: string;

  @ApiProperty({ description: 'Дополнительное описание', required: false })
  description?: string;
}

export class TestQuestionDto {
  @ApiProperty({ description: 'Уникальный идентификатор вопроса' })
  id: string;

  @ApiProperty({ description: 'Текст вопроса' })
  text: string;

  @ApiProperty({ description: 'Категория вопроса', required: false })
  category?: string;

  @ApiProperty({ type: [TestOptionDto], description: 'Варианты ответов' })
  options: TestOptionDto[];

  @ApiProperty({ description: 'Дополнительное описание вопроса', required: false })
  description?: string;
}

export class TestMetadataDto {
  @ApiProperty({ description: 'Предполагаемое время прохождения в минутах', required: false })
  estimatedDuration?: number;

  @ApiProperty({ description: 'Целевая аудитория', required: false })
  targetAudience?: string;

  @ApiProperty({ description: 'Язык теста', required: false })
  language?: string;

  @ApiProperty({ description: 'Дата создания', required: false })
  createdAt?: string;

  @ApiProperty({ description: 'Инструкции для прохождения теста', required: false })
  instructions?: string;
}

export class SpiralTestResponseDto {
  @ApiProperty({ description: 'Уникальный идентификатор теста' })
  id: string;

  @ApiProperty({ description: 'Название теста' })
  name: string;

  @ApiProperty({ description: 'Описание теста' })
  description: string;

  @ApiProperty({ description: 'Версия теста' })
  version: string;

  @ApiProperty({ type: [TestQuestionDto], description: 'Вопросы теста' })
  questions: TestQuestionDto[];

  @ApiProperty({ type: TestMetadataDto, description: 'Метаданные теста', required: false })
  metadata?: TestMetadataDto;
}
