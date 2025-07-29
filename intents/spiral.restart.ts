import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Начать заново
 * 
 * Положительные тесты:
 * - "заново"
 * - "сначала"
 * - "перезапустить"
 * - "начать заново"
 * - "повторить тест"
 * - "с начала"
 * - "рестарт"
 * 
 * Отрицательные тесты:
 * - "продолжить"
 * - "помощь"
 * - "результаты"
 */

// Грамматика Яндекса:
/*
root:
  заново |
  сначала |
  перезапустить |
  начать заново |
  повторить тест |
  с начала |
  рестарт

slots:
*/

@RegexIntent({
  pattern: /(заново|сначала|перезапустить|начать\s+заново|повторить\s+тест|с\s+начала|рестарт)/i,
  priority: 8,
  description: 'Начать заново'
})
export function spiralRestart(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для spiral.restart
  
  return new SkillResponseBuilder(
    'Обработка интента: spiral.restart'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "заново",
  "сначала",
  "перезапустить",
  "начать заново",
  "повторить тест",
  "с начала",
  "рестарт"
],
  negative: [
  "продолжить",
  "помощь",
  "результаты"
]
};
