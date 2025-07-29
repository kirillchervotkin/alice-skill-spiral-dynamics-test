import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Описание синего уровня
 * 
 * Положительные тесты:
 * - "опиши синий"
 * - "расскажи про синий"
 * - "что такое синий"
 * - "про синий"
 * - "о синем"
 * - "синий"
 * - "опиши blue"
 * 
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */

// Грамматика Яндекса:
/*
root:
  опиши синий |
  расскажи про синий |
  что такое синий |
  про синий |
  о синем |
  синий |
  опиши blue

slots:
*/

@RegexIntent({
  pattern: /(опиши\s+синий|расскажи\s+про\s+синий|что\s+такое\s+синий|про\s+синий|о\s+синем|синий|опиши\s+blue)/i,
  priority: 8,
  description: 'Описание синего уровня'
})
export function spiralDescribeBlue(_context: any, matches: RegExpMatchArray): AliceResponse {
  return new SkillResponseBuilder(
    'Синий: Основа — порядок: правила, иерархия, долг, абсолютная истина, стабильность.'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "опиши синий",
  "расскажи про синий",
  "что такое синий",
  "про синий",
  "о синем",
  "синий",
  "опиши blue"
],
  negative: [
  "опиши красный",
  "желтый",
  "помощь"
]
};
