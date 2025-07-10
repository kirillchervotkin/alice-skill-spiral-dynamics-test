import { SpiralLevel } from '../../types/spiral-levels.enum';
import { SpiralTest } from '../../types/test.interface';
import { TestAnswers, AnswerStatistics } from '../../types/answers.interface';
import { TestResult, LevelDescription, ResultComparison } from '../../types/results.interface';
import { ValidationResult } from '../../types/validation.interface';

/**
 * Основной интерфейс сервиса тестирования спиральной динамики
 */
export interface ISpiralDynamicsTestService {
  // === Управление тестами ===
  
  /**
   * Загрузить тест по идентификатору
   * @param testId Идентификатор теста
   * @returns Промис с тестом
   */
  loadTest(testId: string): Promise<SpiralTest>;
  
  /**
   * Получить список доступных тестов
   * @returns Промис со списком тестов
   */
  getAvailableTests(): Promise<string[]>;
  
  // === Валидация ===
  
  /**
   * Валидировать ответы пользователя
   * @param answers Ответы пользователя
   * @param test Тест (опционально, будет загружен по testId из answers)
   * @returns Результат валидации
   */
  validateAnswers(answers: TestAnswers, test?: SpiralTest): Promise<ValidationResult>;
  
  /**
   * Проверить полноту ответов
   * @param answers Ответы пользователя
   * @param test Тест
   * @returns Статистика ответов
   */
  getAnswerStatistics(answers: TestAnswers, test: SpiralTest): AnswerStatistics;
  
  // === Расчет результатов ===
  
  /**
   * Рассчитать результат тестирования
   * @param answers Ответы пользователя
   * @param config Конфигурация расчета (опционально)
   * @returns Промис с результатом
   */
  calculateResult(answers: TestAnswers, config?: any): Promise<TestResult>;
  
  /**
   * Быстрый расчет только доминирующего уровня
   * @param answers Ответы пользователя
   * @returns Промис с доминирующим уровнем
   */
  calculateDominantLevel(answers: TestAnswers): Promise<SpiralLevel>;
  
  // === Описания уровней ===
  
  /**
   * Получить описание конкретного уровня
   * @param level Уровень спиральной динамики
   * @param language Язык описания (опционально)
   * @returns Описание уровня
   */
  getLevelDescription(level: SpiralLevel, language?: string): Promise<LevelDescription>;
  
  /**
   * Получить описания всех уровней
   * @param language Язык описаний (опционально)
   * @returns Описания всех уровней
   */
  getAllLevelDescriptions(language?: string): Promise<Record<SpiralLevel, LevelDescription>>;
  
  // === Сравнение результатов ===
  
  /**
   * Сравнить два результата тестирования
   * @param previousResult Предыдущий результат
   * @param currentResult Текущий результат
   * @returns Сравнение результатов
   */
  compareResults(previousResult: TestResult, currentResult: TestResult): ResultComparison;


  
  // === Рекомендации ===
  
  /**
   * Получить персонализированные рекомендации
   * @param result Результат тестирования
   * @returns Массив рекомендаций
   */
  getRecommendations(result: TestResult): Promise<string[]>;
  
  /**
   * Получить области для развития
   * @param result Результат тестирования
   * @returns Массив областей развития
   */
  getDevelopmentAreas(result: TestResult): Promise<string[]>;
}


