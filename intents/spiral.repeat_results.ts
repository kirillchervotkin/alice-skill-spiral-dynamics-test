import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Повтор результатов
 * 
 * Положительные тесты:
 * - "повтори результаты"
 * - "результаты"
 * - "мои результаты"
 * - "что получилось"
 * - "итоги"
 * - "повтори итоги"
 * - "скажи результат"
 * 
 * Отрицательные тесты:
 * - "начать тест"
 * - "помощь"
 * - "да"
 */

// Грамматика Яндекса:
/*
root:
  повтори результаты |
  результаты |
  мои результаты |
  что получилось |
  итоги |
  повтори итоги |
  скажи результат

slots:
*/

@RegexIntent({
  pattern: /(повтори\s+результаты|результаты|мои\s+результаты|что\s+получилось|итоги|повтори\s+итоги|скажи\s+результат)/i,
  priority: 7,
  description: 'Повтор результатов'
})
export function spiralRepeatResults(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для spiral.repeat_results

  return new SkillResponseBuilder(
    'Обработка интента: spiral.repeat_results'
  ).build();
}

// Тесты
export const tests = {
  positive: [
    "повтори результаты",
    "результаты",
    "мои результаты",
    "что получилось",
    "итоги",
    "повтори итоги",
    "скажи результат"
  ],
  negative: [
    "начать тест",
    "помощь",
    "да"
  ]
};
