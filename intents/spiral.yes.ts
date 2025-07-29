import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Ответ Да
 * 
 * Положительные тесты:
 * - "да"
 * - "согласен"
 * - "верно"
 * - "правильно"
 * - "конечно"
 * - "точно"
 * - "абсолютно"
 * - "именно так"
 * - "ага"
 * - "угу"
 * 
 * Отрицательные тесты:
 * - "нет"
 * - "не согласен"
 * - "может быть"
 */

// Грамматика Яндекса:
/*
root:
  да |
  согласен |
  верно |
  правильно |
  конечно |
  точно |
  абсолютно |
  именно так |
  ага |
  угу

slots:
*/

@RegexIntent({
  pattern: /(да|согласен|верно|правильно|конечно|точно|абсолютно|именно\s+так|ага|угу)/i,
  priority: 8,
  description: 'Ответ Да'
})
export function spiralYes(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для spiral.yes
  
  return new SkillResponseBuilder(
    'Обработка интента: spiral.yes'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "да",
  "согласен",
  "верно",
  "правильно",
  "конечно",
  "точно",
  "абсолютно",
  "именно так",
  "ага",
  "угу"
],
  negative: [
  "нет",
  "не согласен",
  "может быть"
]
};
