import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SpiralDynamicsService } from './spiral-dynamics.service';
import { CalculateResultDto } from '../../common/dto/calculate-result.dto';
import { TestResultResponseDto } from '../../common/dto/test-result-response.dto';
import { LevelDescriptionResponseDto } from '../../common/dto/level-description-response.dto';
import { TestResult } from '../../common/interfaces/results.interface';
import { LevelDescription } from '../../common/interfaces/results.interface';
import { SpiralLevel } from '../../common/interfaces/spiral-levels.enum';

@ApiTags('spiral-dynamics')
@Controller('spiral-dynamics')
export class SpiralDynamicsController {
  constructor(private readonly spiralDynamicsService: SpiralDynamicsService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Рассчитать результат тестирования спиральной динамики' })
  @ApiResponse({
    status: 200,
    description: 'Результат успешно рассчитан',
    type: TestResultResponseDto
  })
  async calculateResult(@Body() calculateResultDto: CalculateResultDto): Promise<TestResult> {
    return this.spiralDynamicsService.calculateResult(calculateResultDto);
  }

  @Get('levels/:level/description')
  @ApiOperation({ summary: 'Получить описание уровня спиральной динамики' })
  @ApiParam({ name: 'level', enum: SpiralLevel })
  @ApiResponse({
    status: 200,
    description: 'Описание уровня получено',
    type: LevelDescriptionResponseDto
  })
  async getLevelDescription(@Param('level') level: SpiralLevel): Promise<LevelDescription> {
    return this.spiralDynamicsService.getLevelDescription(level);
  }

  @Get('levels/descriptions')
  @ApiOperation({ summary: 'Получить описания всех уровней' })
  @ApiResponse({ 
    status: 200, 
    description: 'Описания всех уровней получены'
  })
  async getAllLevelDescriptions(): Promise<Record<SpiralLevel, LevelDescription>> {
    return this.spiralDynamicsService.getAllLevelDescriptions();
  }

  @Post('calculate-top3')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Рассчитать ТОП-3 уровня ценностей' })
  @ApiResponse({
    status: 200,
    description: 'ТОП-3 уровня рассчитаны',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          level: { type: 'string', enum: Object.values(SpiralLevel) },
          name: { type: 'string' },
          score: { type: 'number' },
          interpretation: { type: 'string' }
        }
      }
    }
  })
  async calculateTop3(@Body() calculateResultDto: CalculateResultDto) {
    const result = await this.spiralDynamicsService.calculateResult(calculateResultDto);
    return this.spiralDynamicsService.getTop3Levels(result.levelScores);
  }

  @Post('calculate-formatted')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Рассчитать результаты в формате для озвучки Алисой' })
  @ApiResponse({
    status: 200,
    description: 'Результаты в формате для голосового помощника',
    schema: {
      type: 'object',
      properties: {
        announcement: { type: 'string' },
        top3: { type: 'array', items: { type: 'string' } },
        fullTable: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  async calculateFormatted(@Body() calculateResultDto: CalculateResultDto) {
    const result = await this.spiralDynamicsService.calculateResult(calculateResultDto);
    return this.spiralDynamicsService.getFormattedResults(result.levelScores);
  }

  @Post('get-full-table')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить полную таблицу баллов по всем уровням' })
  @ApiResponse({
    status: 200,
    description: 'Полная таблица баллов',
    schema: {
      type: 'object',
      properties: {
        table: { type: 'array', items: { type: 'string' } },
        summary: { type: 'string' }
      }
    }
  })
  async getFullTable(@Body() calculateResultDto: CalculateResultDto) {
    const result = await this.spiralDynamicsService.calculateResult(calculateResultDto);
    return this.spiralDynamicsService.getFullTable(result.levelScores);
  }


}
