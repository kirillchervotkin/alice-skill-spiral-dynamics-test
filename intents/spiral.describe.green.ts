import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Описание зеленого уровня
 * 
 * Положительные тесты:
 * - "опиши зеленый"
 * - "расскажи про зеленый"
 * - "что такое зеленый"
 * - "про зеленый"
 * - "о зеленом"
 * - "зеленый"
 * - "опиши green"
 * 
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */

// Грамматика Яндекса:
/*
root:
  опиши зеленый |
  расскажи про зеленый |
  что такое зеленый |
  про зеленый |
  о зеленом |
  зеленый |
  опиши green

slots:
*/

@RegexIntent({
  pattern: /(опиши\s+зеленый|расскажи\s+про\s+зеленый|что\s+такое\s+зеленый|про\s+зеленый|о\s+зеленом|зеленый|опиши\s+green)/i,
  priority: 8,
  description: 'Описание зеленого уровня'
})
export function spiralDescribeGreen(_context: any, matches: RegExpMatchArray): AliceResponse {
  return new SkillResponseBuilder(
    'Зеленый: Ценность гармонии: равенство, эмпатия, сообщество, консенсус, забота о людях.'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "опиши зеленый",
  "расскажи про зеленый",
  "что такое зеленый",
  "про зеленый",
  "о зеленом",
  "зеленый",
  "опиши green"
],
  negative: [
  "опиши красный",
  "желтый",
  "помощь"
]
};
