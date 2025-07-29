import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Описание бирюзового уровня
 * 
 * Положительные тесты:
 * - "опиши бирюзовый"
 * - "расскажи про бирюзовый"
 * - "что такое бирюзовый"
 * - "про бирюзовый"
 * - "о бирюзовом"
 * - "бирюзовый"
 * - "опиши turquoise"
 * 
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */

// Грамматика Яндекса:
/*
root:
  опиши бирюзовый |
  расскажи про бирюзовый |
  что такое бирюзовый |
  про бирюзовый |
  о бирюзовом |
  бирюзовый |
  опиши turquoise

slots:
*/

@RegexIntent({
  pattern: /(опиши\s+бирюзовый|расскажи\s+про\s+бирюзовый|что\s+такое\s+бирюзовый|про\s+бирюзовый|о\s+бирюзовом|бирюзовый|опиши\s+turquoise)/i,
  priority: 8,
  description: 'Описание бирюзового уровня'
})
export function spiralDescribeTurquoise(_context: any, matches: RegExpMatchArray): AliceResponse {
  return new SkillResponseBuilder(
    'Бирюзовый: Целостность мира: глобальное сознание, холизм, духовность, единство жизни, эволюция.'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "опиши бирюзовый",
  "расскажи про бирюзовый",
  "что такое бирюзовый",
  "про бирюзовый",
  "о бирюзовом",
  "бирюзовый",
  "опиши turquoise"
],
  negative: [
  "опиши красный",
  "желтый",
  "помощь"
]
};
