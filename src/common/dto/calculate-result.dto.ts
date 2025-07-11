import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { TestAnswers, UserAnswer } from '../interfaces/answers.interface';

// Экспорт Response DTO
export * from './test-result-response.dto';
export * from './level-description-response.dto';
export * from './spiral-test-response.dto';

export class UserAnswerDto implements UserAnswer {
  @ApiProperty({ description: 'ID вопроса' })
  @IsNotEmpty()
  @IsString()
  questionId: string;

  @ApiProperty({ description: 'ID выбранного варианта ответа' })
  @IsNotEmpty()
  @IsString()
  selectedOptionId: string;

  @ApiProperty({ description: 'Время ответа', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp?: Date;

  @ApiProperty({ description: 'Время ответа в миллисекундах', required: false })
  @IsOptional()
  responseTime?: number;
}

export class CalculateResultDto implements TestAnswers {
  @ApiProperty({ description: 'ID теста' })
  @IsNotEmpty()
  @IsString()
  testId: string;

  @ApiProperty({ description: 'ID пользователя', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'Массив ответов пользователя', type: [UserAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserAnswerDto)
  answers: UserAnswerDto[];

  @ApiProperty({ description: 'Время начала теста', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startedAt?: Date;

  @ApiProperty({ description: 'Время завершения теста', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;
}
