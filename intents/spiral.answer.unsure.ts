import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Не уверен
 * 
 * Положительные тесты:
 * - "не знаю"
 * - "не уверен"
 * - "затрудняюсь"
 * - "может быть"
 * - "возможно"
 * - "сложно сказать"
 * - "трудно сказать"
 * - "по разному"
 * - "и да и нет"
 * 
 * Отрицательные тесты:
 * - "да"
 * - "нет"
 * - "точно"
 */

// Грамматика Яндекса:
/*
root:
  не знаю |
  не уверен |
  затрудняюсь |
  может быть |
  возможно |
  сложно сказать |
  трудно сказать |
  по разному |
  и да и нет

slots:
*/

@RegexIntent({
  pattern: /(не\s+знаю|не\s+уверен|затрудняюсь|может\s+быть|возможно|сложно\s+сказать|трудно\s+сказать|по\s+разному|и\s+да\s+и\s+нет)/i,
  priority: 8,
  description: 'Не уверен'
})
export function spiralAnswerUnsure(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для spiral.answer.unsure
  
  return new SkillResponseBuilder(
    'Обработка интента: spiral.answer.unsure'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "не знаю",
  "не уверен",
  "затрудняюсь",
  "может быть",
  "возможно",
  "сложно сказать",
  "трудно сказать",
  "по разному",
  "и да и нет"
],
  negative: [
  "да",
  "нет",
  "точно"
]
};
