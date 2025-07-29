import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Ответ Да на вопрос
 * 
 * Положительные тесты:
 * - "да"
 * - "согласен"
 * - "верно"
 * - "правильно"
 * - "конечно"
 * - "точно"
 * - "абсолютно"
 * - "именно так"
 * 
 * Отрицательные тесты:
 * - "нет"
 * - "не согласен"
 * - "может быть"
 */

// Грамматика Яндекса:
/*
root:
  да |
  согласен |
  верно |
  правильно |
  конечно |
  точно |
  абсолютно |
  именно так

slots:
*/

@RegexIntent({
  pattern: /(да|согласен|верно|правильно|конечно|точно|абсолютно|именно\s+так)/i,
  priority: 8,
  description: 'Ответ Да на вопрос'
})
export function spiralAnswerYes(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для spiral.answer.yes
  
  return new SkillResponseBuilder(
    'Обработка интента: spiral.answer.yes'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "да",
  "согласен",
  "верно",
  "правильно",
  "конечно",
  "точно",
  "абсолютно",
  "именно так"
],
  negative: [
  "нет",
  "не согласен",
  "может быть"
]
};
