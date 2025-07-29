import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Ответ нет на вопрос
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
  description: 'Ответ нет на вопрос'
})
export function spiralAnswerNo(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для spiral.answer.no
  
  return new SkillResponseBuilder(
    'Обработка интента: spiral.answer.no'
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
