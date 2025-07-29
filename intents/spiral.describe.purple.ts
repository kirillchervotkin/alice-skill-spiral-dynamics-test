import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Описание фиолетового уровня
 * 
 * Положительные тесты:
 * - "опиши фиолетовый"
 * - "расскажи про фиолетовый"
 * - "что такое фиолетовый"
 * - "про фиолетовый"
 * - "о фиолетовом"
 * - "фиолетовый"
 * - "опиши purple"
 * 
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */

// Грамматика Яндекса:
/*
root:
  опиши фиолетовый |
  расскажи про фиолетовый |
  что такое фиолетовый |
  про фиолетовый |
  о фиолетовом |
  фиолетовый |
  опиши purple

slots:
*/

@RegexIntent({
  pattern: /(опиши\s+фиолетовый|расскажи\s+про\s+фиолетовый|что\s+такое\s+фиолетовый|про\s+фиолетовый|о\s+фиолетовом|фиолетовый|опиши\s+purple)/i,
  priority: 8,
  description: 'Описание фиолетового уровня'
})
export function spiralDescribePurple(_context: any, matches: RegExpMatchArray): AliceResponse {
  return new SkillResponseBuilder(
    'Фиолетовый: Сила традиций: ритуалы, духи предков, мистика, верность \'своим\'.'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "опиши фиолетовый",
  "расскажи про фиолетовый",
  "что такое фиолетовый",
  "про фиолетовый",
  "о фиолетовом",
  "фиолетовый",
  "опиши purple"
],
  negative: [
  "опиши красный",
  "желтый",
  "помощь"
]
};
