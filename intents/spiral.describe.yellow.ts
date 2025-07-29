import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Описание желтого уровня
 * 
 * Положительные тесты:
 * - "опиши желтый"
 * - "расскажи про желтый"
 * - "что такое желтый"
 * - "про желтый"
 * - "о желтом"
 * - "желтый"
 * - "опиши yellow"
 * 
 * Отрицательные тесты:
 * - "опиши красный"
 * - "синий"
 * - "помощь"
 */

// Грамматика Яндекса:
/*
root:
  опиши желтый |
  расскажи про желтый |
  что такое желтый |
  про желтый |
  о желтом |
  желтый |
  опиши yellow

slots:
*/

@RegexIntent({
  pattern: /(опиши\s+желтый|расскажи\s+про\s+желтый|что\s+такое\s+желтый|про\s+желтый|о\s+желтом|желтый|опиши\s+yellow)/i,
  priority: 8,
  description: 'Описание желтого уровня'
})
export function spiralDescribeYellow(_context: any, matches: RegExpMatchArray): AliceResponse {
  return new SkillResponseBuilder(
    'Желтый: Гибкость систем: адаптивность, функциональность, интеграция знаний, видение связей.'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "опиши желтый",
  "расскажи про желтый",
  "что такое желтый",
  "про желтый",
  "о желтом",
  "желтый",
  "опиши yellow"
],
  negative: [
  "опиши красный",
  "синий",
  "помощь"
]
};
