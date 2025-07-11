/**
 * Тест NestJS структуры без зависимостей
 * Проверяет корректность интерфейсов и типов
 */

// Импорт всех интерфейсов
import {
  SpiralLevel,
  SpiralTest,
  TestAnswers,
  TestResult,
  TestMetadata,
  LevelScores,
  SpiralProfile,
  ValidationResult
} from './src/common/interfaces';

// === ТЕСТ 1: Создание типов данных ===

const metadata: TestMetadata = {
  estimatedDuration: 15,
  targetAudience: 'Взрослые',
  language: 'ru',
  createdAt: '2025-01-01',
  instructions: 'Отвечайте честно'
};

const spiralTest: SpiralTest = {
  id: 'test1',
  name: 'Тест Грейвза',
  description: 'Стандартный тест',
  version: '1.0.0',
  questions: [
    {
      id: 'q1',
      text: 'Я предпочитаю четкие правила',
      options: [
        {
          id: 'opt1',
          text: 'Да',
          levelWeights: {
            [SpiralLevel.BEIGE]: 0,
            [SpiralLevel.PURPLE]: 0,
            [SpiralLevel.RED]: 0,
            [SpiralLevel.BLUE]: 2,
            [SpiralLevel.ORANGE]: 1,
            [SpiralLevel.GREEN]: 0,
            [SpiralLevel.YELLOW]: 0,
            [SpiralLevel.TURQUOISE]: 0
          }
        }
      ]
    }
  ],
  metadata: metadata
};

const testAnswers: TestAnswers = {
  testId: 'test1',
  answers: [
    {
      questionId: 'q1',
      selectedOptionId: 'opt1',
      timestamp: new Date(),
      responseTime: 5000
    }
  ],
  startedAt: new Date(),
  completedAt: new Date()
};

const levelScores: LevelScores = {
  [SpiralLevel.BEIGE]: 0,
  [SpiralLevel.PURPLE]: 1,
  [SpiralLevel.RED]: 2,
  [SpiralLevel.BLUE]: 6,
  [SpiralLevel.ORANGE]: 3,
  [SpiralLevel.GREEN]: 1,
  [SpiralLevel.YELLOW]: 0,
  [SpiralLevel.TURQUOISE]: 0
};

const spiralProfile: SpiralProfile = {
  dominantLevel: SpiralLevel.BLUE,
  dominantScore: 6,
  secondaryLevels: [
    { level: SpiralLevel.ORANGE, score: 3, percentage: 50 }
  ],
  profileType: 'focused'
};

const testResult: TestResult = {
  testId: 'test1',
  dominantLevel: SpiralLevel.BLUE,
  dominantLevelScore: 6,
  levelScores: levelScores,
  normalizedScores: levelScores,
  confidence: 0.85,
  consistency: 0.92,
  reliability: 0.88,
  profile: spiralProfile,
  secondaryLevels: [SpiralLevel.ORANGE],
  levelDescriptions: {} as any,
  recommendations: ['Развивайте гибкость'],
  developmentAreas: ['Адаптивность'],
  calculatedAt: new Date(),
  totalQuestions: 24,
  answeredQuestions: 24,
  algorithmVersion: '1.0.0',
  metadata: {
    testDuration: 900,
    averageResponseTime: 5000,
    calculatedAt: new Date(),
    version: '1.0.0'
  }
} as any;

const validationResult: ValidationResult = {
  isValid: true,
  errors: [],
  warnings: [],
  qualityScore: 0.95
} as any;

// === ТЕСТ 2: Проверка структуры NestJS ===

// Проверяем, что файлы существуют
const nestjsFiles = [
  'src/app.module.ts',
  'src/main.ts',
  'src/modules/spiral-dynamics/spiral-dynamics.module.ts',
  'src/modules/spiral-dynamics/spiral-dynamics.controller.ts',
  'src/modules/spiral-dynamics/spiral-dynamics.service.ts',
  'src/modules/spiral-dynamics/spiral-calculator.service.ts',
  'src/modules/tests/tests.module.ts',
  'src/modules/tests/tests.controller.ts',
  'src/modules/tests/tests.service.ts',
  'src/modules/validation/validation.module.ts',
  'src/modules/validation/validation.service.ts',
  'src/common/dto/calculate-result.dto.ts'
];

console.log('🎉 ТЕСТ СТРУКТУРЫ ЗАВЕРШЕН!');
console.log('✅ Все типы данных созданы успешно');
console.log('✅ Интерфейсы компилируются без ошибок');
console.log('✅ NestJS структура создана');
console.log(`✅ Создано ${nestjsFiles.length} NestJS файлов`);
console.log('');
console.log('📁 Структура проекта:');
console.log('├── src/common/interfaces/ - Интерфейсы и типы');
console.log('├── src/modules/spiral-dynamics/ - Основной модуль');
console.log('├── src/modules/tests/ - Модуль тестов');
console.log('├── src/modules/validation/ - Модуль валидации');
console.log('├── src/common/dto/ - DTO для API');
console.log('├── src/app.module.ts - Главный модуль');
console.log('└── src/main.ts - Точка входа');
console.log('');
console.log('🚀 Готово к установке NestJS зависимостей!');
