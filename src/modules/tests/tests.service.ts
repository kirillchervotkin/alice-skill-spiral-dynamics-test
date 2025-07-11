import { Injectable } from '@nestjs/common';
import { ITestProvider } from '../../common/interfaces/test-provider.interface';
import { SpiralTest, TestMetadata, TestQuestion, TestOption } from '../../common/interfaces/test.interface';
import { ValidationResult, ValidationError, ValidationErrorType } from '../../common/interfaces/validation.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TestsService implements ITestProvider {
  
  async loadTest(testId: string): Promise<SpiralTest> {
    try {
      // Определяем путь к JSON файлу
      const testFilePath = this.getTestFilePath(testId);

      // Проверяем существование файла
      if (!fs.existsSync(testFilePath)) {
        throw new Error(`Test file not found: ${testId}`);
      }

      // Читаем и парсим JSON файл
      const testData = fs.readFileSync(testFilePath, 'utf8');
      const test: SpiralTest = JSON.parse(testData);

      // Валидируем структуру теста
      const validation = this.validateTest(test);
      if (!validation.isValid) {
        throw new Error(`Invalid test structure: ${validation.errors.join(', ')}`);
      }

      return test;
    } catch (error) {
      throw new Error(`Failed to load test ${testId}: ${error.message}`);
    }
  }

  private getTestFilePath(testId: string): string {
    // Путь к папке с тестами относительно корня проекта
    const testsDir = path.join(process.cwd(), 'data', 'tests');
    return path.join(testsDir, `${testId}.json`);
  }

  // Удалены старые методы создания тестов - теперь загружаем из JSON файлов

  // Удален дублирующийся private метод

  async getAvailableTests(): Promise<string[]> {
    try {
      const testsDir = path.join(process.cwd(), 'data', 'tests');

      // Проверяем существование папки
      if (!fs.existsSync(testsDir)) {
        return [];
      }

      // Читаем все JSON файлы в папке
      const files = fs.readdirSync(testsDir);
      const testIds = files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));

      return testIds;
    } catch (error) {
      console.error('Error reading tests directory:', error);
      return [];
    }
  }

  // Публичный метод validateTest - используем private метод
  validateTest(test: SpiralTest): ValidationResult {
    return this.validateTestPrivate(test);
  }

  private validateTestPrivate(test: SpiralTest): ValidationResult {
    const errors: ValidationError[] = [];

    if (!test.id) {
      errors.push({
        type: ValidationErrorType.MISSING_FIELD,
        code: 'MISSING_TEST_ID',
        message: 'Test ID is required',
        field: 'id'
      });
    }

    if (!test.name) {
      errors.push({
        type: ValidationErrorType.MISSING_FIELD,
        code: 'MISSING_TEST_NAME',
        message: 'Test name is required',
        field: 'name'
      });
    }

    if (!test.questions || test.questions.length === 0) {
      errors.push({
        type: ValidationErrorType.MISSING_FIELD,
        code: 'MISSING_QUESTIONS',
        message: 'Test must have questions',
        field: 'questions'
      });
    }

    // Проверяем структуру вопросов
    if (test.questions) {
      test.questions.forEach((question, index) => {
        if (!question.id) {
          errors.push({
            type: ValidationErrorType.MISSING_FIELD,
            code: 'MISSING_QUESTION_ID',
            message: `Question ${index + 1}: ID is required`,
            field: `questions[${index}].id`
          });
        }
        if (!question.text) {
          errors.push({
            type: ValidationErrorType.MISSING_FIELD,
            code: 'MISSING_QUESTION_TEXT',
            message: `Question ${index + 1}: Text is required`,
            field: `questions[${index}].text`
          });
        }
        if (!question.options || question.options.length === 0) {
          errors.push({
            type: ValidationErrorType.MISSING_FIELD,
            code: 'MISSING_QUESTION_OPTIONS',
            message: `Question ${index + 1}: Options are required`,
            field: `questions[${index}].options`
          });
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  async testExists(testId: string): Promise<boolean> {
    const testFilePath = this.getTestFilePath(testId);
    return fs.existsSync(testFilePath);
  }

  async getTestVersion(testId: string): Promise<string> {
    try {
      const test = await this.loadTest(testId);
      return test.version || '1.0.0';
    } catch (error) {
      return '1.0.0';
    }
  }

  async getTestMetadata(testId: string): Promise<TestMetadata> {
    try {
      const test = await this.loadTest(testId);
      return test.metadata || {
        estimatedDuration: 10,
        targetAudience: 'Взрослые',
        language: 'ru',
        createdAt: '2025-01-01',
        instructions: 'Отвечайте честно на каждый вопрос'
      };
    } catch (error) {
      return {
        estimatedDuration: 10,
        targetAudience: 'Взрослые',
        language: 'ru',
        createdAt: '2025-01-01',
        instructions: 'Отвечайте честно на каждый вопрос'
      };
    }
  }
}
