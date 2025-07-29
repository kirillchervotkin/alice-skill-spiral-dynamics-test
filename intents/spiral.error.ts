import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Обработка ошибок
 * 
 * Положительные тесты:
 * - "не понял"
 * - "не поняла"
 * - "ошибка"
 * - "что делать"
 * - "не работает"
 * - "проблема"
 * - "сломалось"
 * 
 * Отрицательные тесты:
 * - "помощь"
 * - "да"
 * - "нет"
 */

// Грамматика Яндекса:
/*
root:
  не понял |
  не поняла |
  ошибка |
  что делать |
  не работает |
  проблема |
  сломалось

slots:
*/

@RegexIntent({
  pattern: /(не\s+понял|не\s+поняла|ошибка|что\s+делать|не\s+работает|проблема|сломалось)/i,
  priority: 5,
  description: 'Обработка ошибок'
})
export function spiralError(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для spiral.error
  
  return new SkillResponseBuilder(
    'Обработка интента: spiral.error'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "не понял",
  "не поняла",
  "ошибка",
  "что делать",
  "не работает",
  "проблема",
  "сломалось"
],
  negative: [
  "помощь",
  "да",
  "нет"
]
};
