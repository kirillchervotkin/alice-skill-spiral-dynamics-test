import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Продолжить тест
 * 
 * Положительные тесты:
 * - "продолжить"
 * - "продолжаем"
 * - "дальше"
 * - "идем дальше"
 * - "следующий"
 * - "продолжи тест"
 * - "возобновить"
 * 
 * Отрицательные тесты:
 * - "стоп"
 * - "пауза"
 * - "помощь"
 */

// Грамматика Яндекса:
/*
root:
  продолжить |
  продолжаем |
  дальше |
  идем дальше |
  следующий |
  продолжи тест |
  возобновить

slots:
*/

@RegexIntent({
  pattern: /(продолжить|продолжаем|дальше|идем\s+дальше|следующий|продолжи\s+тест|возобновить)/i,
  priority: 7,
  description: 'Продолжить тест'
})
export function spiralContinue(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для spiral.continue
  
  return new SkillResponseBuilder(
    'Обработка интента: spiral.continue'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "продолжить",
  "продолжаем",
  "дальше",
  "идем дальше",
  "следующий",
  "продолжи тест",
  "возобновить"
],
  negative: [
  "стоп",
  "пауза",
  "помощь"
]
};
