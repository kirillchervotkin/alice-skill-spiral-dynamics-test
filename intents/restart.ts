import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Перезапуск
 * 
 * Положительные тесты:
 * - "заново"
 * - "сначала"
 * - "перезапустить"
 * - "начать заново"
 * - "повторить тест"
 * 
 * Отрицательные тесты:
 * - "помощь"
 * - "да"
 * - "нет"
 */

// Грамматика Яндекса:
/*
root:
  заново |
  сначала |
  перезапустить |
  начать заново |
  повторить тест

slots:
*/

@RegexIntent({
  pattern: /(заново|сначала|перезапустить|начать\s+заново|повторить\s+тест)/i,
  priority: 9,
  description: 'Перезапуск'
})
export function restart(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для restart
  
  return new SkillResponseBuilder(
    'Обработка интента: restart'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "заново",
  "сначала",
  "перезапустить",
  "начать заново",
  "повторить тест"
],
  negative: [
  "помощь",
  "да",
  "нет"
]
};
