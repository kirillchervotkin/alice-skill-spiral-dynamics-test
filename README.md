# TypeScript интерфейсы для тестирования спиральной динамики

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Полный набор TypeScript интерфейсов для создания системы тестирования спиральной динамики Грейвза.

## Что включено

- **Типы данных** для всех 8 уровней спиральной динамики
- **Интерфейсы сервисов** для управления тестами и расчетов
- **Структуры данных** для тестов, ответов и результатов
- **Система валидации** для контроля качества данных

## Быстрый старт

### Установка
```bash
git clone <repository-url>
cd spiral-dynamic
npm install
```

### Импорт типов
```typescript
import {
  SpiralLevel,
  SpiralTest,
  TestAnswers,
  TestResult
} from './src/types';

import {
  ISpiralDynamicsTestService,
  ISpiralCalculator
} from './src/services/interfaces';
```

### Базовое использование
```typescript
// Реализация основного сервиса
class TestService implements ISpiralDynamicsTestService {
  async calculateResult(answers: TestAnswers): Promise<TestResult> {
    // Ваша логика расчета результатов
  }

  async loadTest(testId: string): Promise<SpiralTest> {
    // Ваша логика загрузки тестов
  }
}

// Использование типов
const answers: TestAnswers = {
  testId: 'graves-standard',
  answers: [
    {
      questionId: 'q1',
      selectedOptionId: 'yes',
      timestamp: new Date()
    }
  ]
};

const result = await testService.calculateResult(answers);
console.log(`Доминирующий уровень: ${result.dominantLevel}`);
```

## Основные интерфейсы

### SpiralTest - Структура теста
```typescript
interface SpiralTest {
  id: string;
  name: string;
  description: string;
  questions: TestQuestion[];
  metadata?: TestMetadata;
}
```

### TestAnswers - Ответы пользователя
```typescript
interface TestAnswers {
  testId: string;
  userId?: string;
  answers: UserAnswer[];
  startedAt?: Date;
  completedAt?: Date;
}
```

### TestResult - Результат тестирования
```typescript
interface TestResult {
  dominantLevel: SpiralLevel;
  levelScores: LevelScores;
  confidence: number;
  consistency: number;
  reliability: number;
  profile: SpiralProfile;
  recommendations: string[];
}
```

## Уровни спиральной динамики

| Уровень | Цвет | Код | Описание |
|---------|------|-----|----------|
| 1 | Бежевый | AN | Выживание: базовые потребности, инстинкты |
| 2 | Фиолетовый | BO | Племенной: традиции, ритуалы |
| 3 | Красный | CP | Силовой: доминирование, импульсы |
| 4 | Синий | DQ | Порядок: правила, иерархия |
| 5 | Оранжевый | ER | Достижения: успех, конкуренция |
| 6 | Зеленый | FS | Гармония: равенство, сообщество |
| 7 | Желтый | GT | Гибкость: системное мышление |
| 8 | Бирюзовый | HU | Целостность: глобальное сознание |

## Структура проекта

```
src/
├── types/                     # Основные типы данных
│   ├── spiral-levels.enum.ts  # 8 уровней спиральной динамики
│   ├── test.interface.ts      # Структура тестов
│   ├── answers.interface.ts   # Ответы пользователей
│   ├── results.interface.ts   # Результаты тестирования
│   └── validation.interface.ts # Валидация данных
└── services/interfaces/       # Интерфейсы сервисов
    ├── test-service.interface.ts      # Основной сервис
    ├── spiral-calculator.interface.ts # Расчеты
    └── test-provider.interface.ts     # Управление тестами
```

## Интерфейсы сервисов

### ISpiralDynamicsTestService
Основной сервис для управления тестами и расчета результатов.

### ISpiralCalculator
Алгоритмы для подсчета баллов и определения уровней.

### ITestProvider
Загрузка тестовых данных и валидация.

## Пример реализации

```typescript
class SpiralCalculator implements ISpiralCalculator {
  calculateScores(answers: TestAnswers): Promise<LevelScores> {
    // Расчет баллов для каждого уровня на основе весов ответов
    // Пример: blue_score = sum(blue_weights * user_answers)
  }

  determineDominantLevel(scores: LevelScores): SpiralLevel {
    // Поиск уровня с наивысшим баллом
    return Object.entries(scores)
      .reduce((max, [level, score]) =>
        score > max.score ? { level, score } : max
      ).level as SpiralLevel;
  }
}
```

## Система валидации

Встроенная валидация для:
- Полноты данных
- Согласованности ответов
- Паттернов ответов
- Метрик качества

```typescript
const validation: ValidationResult = await service.validateAnswers(answers);
if (!validation.isValid) {
  console.log('Ошибки валидации:', validation.errors);
}
```

## Что нужно реализовать

- **Бизнес-логику** для расчета баллов
- **Хранение данных** (база данных, файлы, API)
- **Пользовательский интерфейс** для прохождения тестов
- **Контент тестов** (реальные вопросы и варианты ответов)

## Лицензия

MIT License - свободное использование.

---

**Готово к созданию вашей системы тестирования спиральной динамики!** 🚀
