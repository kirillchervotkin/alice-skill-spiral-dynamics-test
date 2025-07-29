import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Описание бежевого уровня
 * 
 * Положительные тесты:
 * - "опиши бежевый"
 * - "расскажи про бежевый"
 * - "что такое бежевый"
 * - "про бежевый"
 * - "о бежевом"
 * - "бежевый"
 * - "опиши beige"
 * 
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */

// Грамматика Яндекса:
/*
root:
  опиши бежевый |
  расскажи про бежевый |
  что такое бежевый |
  про бежевый |
  о бежевом |
  бежевый |
  опиши beige

slots:
*/

@RegexIntent({
  pattern: /(опиши\s+бежевый|расскажи\s+про\s+бежевый|что\s+такое\s+бежевый|про\s+бежевый|о\s+бежевом|бежевый|опиши\s+beige)/i,
  priority: 8,
  description: 'Описание бежевого уровня'
})
export function spiralDescribeBeige(_context: any, matches: RegExpMatchArray): AliceResponse {
  return new SkillResponseBuilder(
    'Бежевый: Фокус на выживании: еда, безопасность, здоровье, действия по инстинкту.'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "опиши бежевый",
  "расскажи про бежевый",
  "что такое бежевый",
  "про бежевый",
  "о бежевом",
  "бежевый",
  "опиши beige"
],
  negative: [
  "опиши красный",
  "желтый",
  "помощь"
]
};
