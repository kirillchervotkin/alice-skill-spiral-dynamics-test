import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Ответ Нет
 * 
 * Положительные тесты:
 * - "нет"
 * - "не согласен"
 * - "неверно"
 * - "не правильно"
 * - "никогда"
 * - "ни в коем случае"
 * 
 * Отрицательные тесты:
 * - "да"
 * - "согласен"
 * - "может быть"
 */

// Грамматика Яндекса:
/*
root:
  нет |
  не согласен |
  неверно |
  не правильно |
  никогда |
  ни в коем случае

slots:
*/

@RegexIntent({
  pattern: /(нет|не\s+согласен|неверно|не\s+правильно|никогда|ни\s+в\s+коем\s+случае)/i,
  priority: 8,
  description: 'Ответ Нет'
})
export function spiralNo(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для spiral.no
  
  return new SkillResponseBuilder(
    'Обработка интента: spiral.no'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "нет",
  "не согласен",
  "неверно",
  "не правильно",
  "никогда",
  "ни в коем случае"
],
  negative: [
  "да",
  "согласен",
  "может быть"
]
};
