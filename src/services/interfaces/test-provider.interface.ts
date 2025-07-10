import { SpiralTest, TestMetadata } from '../../types/test.interface';
import { ValidationResult } from '../../types/validation.interface';

/**
 * Интерфейс для загрузки и управления тестами
 */
export interface ITestProvider {
  /**
   * Загрузить тест по идентификатору
   * @param testId Идентификатор теста
   * @returns Промис с тестом
   */
  loadTest(testId: string): Promise<SpiralTest>;
  
  /**
   * Получить список доступных тестов
   * @returns Промис со списком идентификаторов тестов
   */
  getAvailableTests(): Promise<string[]>;
  
  /**
   * Получить метаданные теста без загрузки полного содержимого
   * @param testId Идентификатор теста
   * @returns Промис с метаданными
   */
  getTestMetadata(testId: string): Promise<SpiralTest['metadata']>;
  
  /**
   * Валидировать структуру теста
   * @param test Тест для валидации
   * @returns Результат валидации
   */
  validateTest(test: SpiralTest): ValidationResult;


  
  /**
   * Проверить существование теста
   * @param testId Идентификатор теста
   * @returns Промис с булевым значением
   */
  testExists(testId: string): Promise<boolean>;
  
  /**
   * Получить версию теста
   * @param testId Идентификатор теста
   * @returns Промис с версией теста
   */
  getTestVersion(testId: string): Promise<string>;

  /**
   * Получить метаданные теста
   * @param testId Идентификатор теста
   * @returns Промис с метаданными теста
   */
  getTestMetadata(testId: string): Promise<TestMetadata>;
}

/**
 * Конфигурация провайдера тестов
 */
export interface TestProviderConfig {
  /** Путь к директории с тестами */
  testsDirectory: string;
  
  /** Кэшировать ли загруженные тесты */
  enableCaching: boolean;
  
  /** Время жизни кэша в миллисекундах */
  cacheLifetime: number;
  
  /** Валидировать ли тесты при загрузке */
  validateOnLoad: boolean;
  
  /** Язык по умолчанию */
  defaultLanguage: string;
}
