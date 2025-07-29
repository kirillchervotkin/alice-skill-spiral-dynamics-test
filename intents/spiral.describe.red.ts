import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Описание красного уровня
 * 
 * Положительные тесты:
 * - "опиши красный"
 * - "расскажи про красный"
 * - "что такое красный"
 * - "про красный"
 * - "о красном"
 * - "красный"
 * - "опиши red"
 * 
 * Отрицательные тесты:
 * - "опиши желтый"
 * - "синий"
 * - "помощь"
 */

// Грамматика Яндекса:
/*
root:
  опиши красный |
  расскажи про красный |
  что такое красный |
  про красный |
  о красном |
  красный |
  опиши red

slots:
*/

@RegexIntent({
  pattern: /(опиши\s+красный|расскажи\s+про\s+красный|что\s+такое\s+красный|про\s+красный|о\s+красном|красный|опиши\s+red)/i,
  priority: 8,
  description: 'Описание красного уровня'
})
export function spiralDescribeRed(_context: any, matches: RegExpMatchArray): AliceResponse {
  return new SkillResponseBuilder(
    'Красный: Мир-джунгли: сила, власть, импульсы, победа любой ценой, \'беру что хочу\'.'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "опиши красный",
  "расскажи про красный",
  "что такое красный",
  "про красный",
  "о красном",
  "красный",
  "опиши red"
],
  negative: [
  "опиши желтый",
  "синий",
  "помощь"
]
};
