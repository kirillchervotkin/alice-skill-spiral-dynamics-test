import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Описание оранжевого уровня
 * 
 * Положительные тесты:
 * - "опиши оранжевый"
 * - "расскажи про оранжевый"
 * - "что такое оранжевый"
 * - "про оранжевый"
 * - "о оранжевом"
 * - "оранжевый"
 * - "опиши orange"
 * 
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */

// Грамматика Яндекса:
/*
root:
  опиши оранжевый |
  расскажи про оранжевый |
  что такое оранжевый |
  про оранжевый |
  о оранжевом |
  оранжевый |
  опиши orange

slots:
*/

@RegexIntent({
  pattern: /(опиши\s+оранжевый|расскажи\s+про\s+оранжевый|что\s+такое\s+оранжевый|про\s+оранжевый|о\s+оранжевом|оранжевый|опиши\s+orange)/i,
  priority: 8,
  description: 'Описание оранжевого уровня'
})
export function spiralDescribeOrange(_context: any, matches: RegExpMatchArray): AliceResponse {
  return new SkillResponseBuilder(
    'Оранжевый: Двигатель прогресса: стратегия, успех, конкуренция, инновации, личные достижения.'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "опиши оранжевый",
  "расскажи про оранжевый",
  "что такое оранжевый",
  "про оранжевый",
  "о оранжевом",
  "оранжевый",
  "опиши orange"
],
  negative: [
  "опиши красный",
  "желтый",
  "помощь"
]
};
