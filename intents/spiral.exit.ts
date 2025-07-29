import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Выход из навыка
 * 
 * Положительные тесты:
 * - "выйти"
 * - "выход"
 * - "закончить"
 * - "завершить"
 * - "хватит"
 * - "достаточно"
 * - "до свидания"
 * - "пока"
 * 
 * Отрицательные тесты:
 * - "начать"
 * - "продолжить"
 * - "помощь"
 */

// Грамматика Яндекса:
/*
root:
  выйти |
  выход |
  закончить |
  завершить |
  хватит |
  достаточно |
  до свидания |
  пока

slots:
*/

@RegexIntent({
  pattern: /(выйти|выход|закончить|завершить|хватит|достаточно|до\s+свидания|пока)/i,
  priority: 9,
  description: 'Выход из навыка'
})
export function spiralExit(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для spiral.exit
  
  return new SkillResponseBuilder(
    'Обработка интента: spiral.exit'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "выйти",
  "выход",
  "закончить",
  "завершить",
  "хватит",
  "достаточно",
  "до свидания",
  "пока"
],
  negative: [
  "начать",
  "продолжить",
  "помощь"
]
};
