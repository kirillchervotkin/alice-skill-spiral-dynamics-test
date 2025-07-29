import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Пауза теста
 * 
 * Положительные тесты:
 * - "пауза"
 * - "остановить"
 * - "приостановить"
 * - "стоп"
 * - "подожди"
 * - "остановись"
 * - "прерви тест"
 * 
 * Отрицательные тесты:
 * - "продолжить"
 * - "дальше"
 * - "начать"
 */

// Грамматика Яндекса:
/*
root:
  пауза |
  остановить |
  приостановить |
  стоп |
  подожди |
  остановись |
  прерви тест

slots:
*/

@RegexIntent({
  pattern: /(пауза|остановить|приостановить|стоп|подожди|остановись|прерви\s+тест)/i,
  priority: 7,
  description: 'Пауза теста'
})
export function spiralPause(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для spiral.pause
  
  return new SkillResponseBuilder(
    'Обработка интента: spiral.pause'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "пауза",
  "остановить",
  "приостановить",
  "стоп",
  "подожди",
  "остановись",
  "прерви тест"
],
  negative: [
  "продолжить",
  "дальше",
  "начать"
]
};
