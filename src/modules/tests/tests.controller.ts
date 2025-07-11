import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TestsService } from './tests.service';
import { SpiralTestResponseDto } from '../../common/dto/spiral-test-response.dto';
import { SpiralTest } from '../../common/interfaces/test.interface';

@ApiTags('tests')
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список доступных тестов' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список тестов получен',
    type: [String]
  })
  async getAvailableTests(): Promise<string[]> {
    return this.testsService.getAvailableTests();
  }

  @Get(':testId')
  @ApiOperation({ summary: 'Загрузить тест по ID' })
  @ApiParam({ name: 'testId', description: 'Идентификатор теста' })
  @ApiResponse({
    status: 200,
    description: 'Тест загружен',
    type: SpiralTestResponseDto
  })
  async loadTest(@Param('testId') testId: string): Promise<SpiralTest> {
    return this.testsService.loadTest(testId);
  }

  @Get(':testId/exists')
  @ApiOperation({ summary: 'Проверить существование теста' })
  @ApiParam({ name: 'testId', description: 'Идентификатор теста' })
  @ApiResponse({ 
    status: 200, 
    description: 'Результат проверки',
    type: Boolean
  })
  async testExists(@Param('testId') testId: string): Promise<boolean> {
    return this.testsService.testExists(testId);
  }
}
