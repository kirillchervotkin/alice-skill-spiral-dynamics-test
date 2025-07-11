import * as fs from 'fs/promises';
import * as path from 'path';
import { ITestProvider, TestProviderConfig } from './interfaces/test-provider.interface';
import { SpiralTest, TestValidationConfig } from '../types/test.interface';
import { ValidationResult, ValidationError, ValidationErrorType, ValidationWarning, ValidationWarningLevel } from '../types/validation.interface';
import { SpiralLevel } from '../types/spiral-levels.enum';

/**
 * Реализация провайдера тестов для загрузки из файловой системы
 */
export class FileSystemTestProvider implements ITestProvider {
  private testCache: Map<string, SpiralTest> = new Map();
  private config: TestProviderConfig;

  constructor(config: Partial<TestProviderConfig> = {}) {
    this.config = {
      testsDirectory: config.testsDirectory || './data/tests',
      enableCaching: config.enableCaching ?? true,
      cacheLifetime: config.cacheLifetime || 300000, // 5 минут
      validateOnLoad: config.validateOnLoad ?? true,
      defaultLanguage: config.defaultLanguage || 'ru'
    };
  }

  async loadTest(testId: string): Promise<SpiralTest> {
    // Проверяем кэш
    if (this.config.enableCaching && this.testCache.has(testId)) {
      return this.testCache.get(testId)!;
    }

    try {
      const testPath = path.join(this.config.testsDirectory, `${testId}.json`);
      const testData = await fs.readFile(testPath, 'utf-8');
      const test: SpiralTest = JSON.parse(testData);

      // Валидация при загрузке
      if (this.config.validateOnLoad) {
        const validation = this.validateTest(test);
        if (!validation.isValid) {
          throw new Error(`Test validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
        }
      }

      // Кэшируем тест
      if (this.config.enableCaching) {
        this.testCache.set(testId, test);
        
        // Очищаем кэш через заданное время
        setTimeout(() => {
          this.testCache.delete(testId);
        }, this.config.cacheLifetime);
      }

      return test;
    } catch (error) {
      throw new Error(`Failed to load test '${testId}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAvailableTests(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.config.testsDirectory);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => path.basename(file, '.json'));
    } catch (error) {
      throw new Error(`Failed to read tests directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTestMetadata(testId: string): Promise<SpiralTest['metadata']> {
    const test = await this.loadTest(testId);
    return test.metadata;
  }

  validateTest(test: SpiralTest): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const config: TestValidationConfig = {
      minQuestions: 5,
      maxQuestions: 100,
      minOptionsPerQuestion: 2,
      maxOptionsPerQuestion: 6,
      requireAllLevelWeights: true,
      maxWeightSum: 2.0
    };

    // Проверка основных полей
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

    if (!test.questions || !Array.isArray(test.questions)) {
      errors.push({
        type: ValidationErrorType.MISSING_FIELD,
        code: 'MISSING_QUESTIONS',
        message: 'Test questions are required',
        field: 'questions'
      });
      return { isValid: false, errors, warnings: [] };
    }

    // Проверка количества вопросов
    if (test.questions.length < config.minQuestions) {
      errors.push({
        type: ValidationErrorType.INSUFFICIENT_DATA,
        code: 'TOO_FEW_QUESTIONS',
        message: `Test must have at least ${config.minQuestions} questions`,
        field: 'questions',
        expected: config.minQuestions,
        actual: test.questions.length
      });
    }

    if (test.questions.length > config.maxQuestions) {
      errors.push({
        type: ValidationErrorType.OUT_OF_RANGE,
        code: 'TOO_MANY_QUESTIONS',
        message: `Test cannot have more than ${config.maxQuestions} questions`,
        field: 'questions',
        expected: config.maxQuestions,
        actual: test.questions.length
      });
    }

    // Предупреждения для количества вопросов
    if (test.questions.length < 10) {
      warnings.push({
        level: ValidationWarningLevel.MEDIUM,
        code: 'FEW_QUESTIONS',
        message: `Test has only ${test.questions.length} questions. Consider adding more for better accuracy`,
        field: 'questions',
        suggestion: 'Add more questions to improve test reliability',
        impact: 'May reduce accuracy of results'
      });
    }

    if (test.questions.length > 50) {
      warnings.push({
        level: ValidationWarningLevel.LOW,
        code: 'MANY_QUESTIONS',
        message: `Test has ${test.questions.length} questions. This might be too long for users`,
        field: 'questions',
        suggestion: 'Consider reducing number of questions for better user experience',
        impact: 'May increase user fatigue and dropout rate'
      });
    }

    // Проверка каждого вопроса
    test.questions.forEach((question, questionIndex) => {
      const questionPath = `questions[${questionIndex}]`;

      if (!question.id) {
        errors.push({
          type: ValidationErrorType.MISSING_FIELD,
          code: 'MISSING_QUESTION_ID',
          message: 'Question ID is required',
          fieldPath: `${questionPath}.id`
        });
      }

      if (!question.text) {
        errors.push({
          type: ValidationErrorType.MISSING_FIELD,
          code: 'MISSING_QUESTION_TEXT',
          message: 'Question text is required',
          fieldPath: `${questionPath}.text`
        });
      }

      if (!question.options || !Array.isArray(question.options)) {
        errors.push({
          type: ValidationErrorType.MISSING_FIELD,
          code: 'MISSING_QUESTION_OPTIONS',
          message: 'Question options are required',
          fieldPath: `${questionPath}.options`
        });
        return;
      }

      // Проверка количества вариантов ответа
      if (question.options.length < config.minOptionsPerQuestion) {
        errors.push({
          type: ValidationErrorType.INSUFFICIENT_DATA,
          code: 'TOO_FEW_OPTIONS',
          message: `Question must have at least ${config.minOptionsPerQuestion} options`,
          fieldPath: `${questionPath}.options`,
          expected: config.minOptionsPerQuestion,
          actual: question.options.length
        });
      }

      // Проверка каждого варианта ответа
      question.options.forEach((option, optionIndex) => {
        const optionPath = `${questionPath}.options[${optionIndex}]`;

        if (!option.id) {
          errors.push({
            type: ValidationErrorType.MISSING_FIELD,
            code: 'MISSING_OPTION_ID',
            message: 'Option ID is required',
            fieldPath: `${optionPath}.id`
          });
        }

        if (!option.text) {
          errors.push({
            type: ValidationErrorType.MISSING_FIELD,
            code: 'MISSING_OPTION_TEXT',
            message: 'Option text is required',
            fieldPath: `${optionPath}.text`
          });
        }

        if (!option.levelWeights) {
          errors.push({
            type: ValidationErrorType.MISSING_FIELD,
            code: 'MISSING_LEVEL_WEIGHTS',
            message: 'Option level weights are required',
            fieldPath: `${optionPath}.levelWeights`
          });
          return;
        }

        // Проверка весов для всех уровней
        if (config.requireAllLevelWeights) {
          Object.values(SpiralLevel).forEach(level => {
            if (!(level in option.levelWeights)) {
              errors.push({
                type: ValidationErrorType.MISSING_FIELD,
                code: 'MISSING_LEVEL_WEIGHT',
                message: `Weight for level '${level}' is missing`,
                fieldPath: `${optionPath}.levelWeights.${level}`
              });
            }
          });
        }

        // Проверка суммы весов
        const weightSum = Object.values(option.levelWeights).reduce((sum, weight) => sum + weight, 0);
        if (weightSum > config.maxWeightSum) {
          errors.push({
            type: ValidationErrorType.OUT_OF_RANGE,
            code: 'WEIGHT_SUM_TOO_HIGH',
            message: `Sum of weights cannot exceed ${config.maxWeightSum}`,
            fieldPath: `${optionPath}.levelWeights`,
            expected: config.maxWeightSum,
            actual: weightSum
          });
        }

        // Предупреждения для весов
        if (weightSum === 0) {
          warnings.push({
            level: ValidationWarningLevel.HIGH,
            code: 'ZERO_WEIGHT_SUM',
            message: `Option has zero weight sum - will not contribute to results`,
            field: `${optionPath}.levelWeights`,
            suggestion: 'Add weights for relevant spiral levels',
            impact: 'This option will not affect test results'
          });
        }

        if (weightSum < 0.5) {
          warnings.push({
            level: ValidationWarningLevel.MEDIUM,
            code: 'LOW_WEIGHT_SUM',
            message: `Option has very low weight sum (${weightSum.toFixed(2)})`,
            field: `${optionPath}.levelWeights`,
            suggestion: 'Consider increasing weights for better discrimination',
            impact: 'May reduce test sensitivity'
          });
        }

        // Проверка на доминирующий вес
        const maxWeight = Math.max(...Object.values(option.levelWeights));
        const dominantLevels = Object.entries(option.levelWeights).filter(([, weight]) => weight === maxWeight);

        if (dominantLevels.length > 3) {
          warnings.push({
            level: ValidationWarningLevel.MEDIUM,
            code: 'TOO_MANY_DOMINANT_LEVELS',
            message: `Option has ${dominantLevels.length} levels with equal max weight`,
            field: `${optionPath}.levelWeights`,
            suggestion: 'Consider making weights more discriminative',
            impact: 'May reduce test precision'
          });
        }
      });
    });

    // Подсчет качественных метрик
    const totalChecks = test.questions.length * 5; // Примерное количество проверок
    const passedChecks = totalChecks - errors.length - warnings.length;
    const qualityScore = passedChecks / totalChecks;

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      qualityScore,
      summary: {
        totalChecks,
        passedChecks,
        criticalErrors: errors.filter(e => e.type === ValidationErrorType.MISSING_FIELD).length,
        highWarnings: warnings.filter(w => w.level === ValidationWarningLevel.HIGH).length
      },
      validatedAt: new Date(),
      validatorVersion: '1.0.0'
    };
  }

  async testExists(testId: string): Promise<boolean> {
    try {
      const testPath = path.join(this.config.testsDirectory, `${testId}.json`);
      await fs.access(testPath);
      return true;
    } catch {
      return false;
    }
  }

  async getTestVersion(testId: string): Promise<string> {
    const test = await this.loadTest(testId);
    return test.version || '1.0.0';
  }
}
