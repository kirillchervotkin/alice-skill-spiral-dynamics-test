import { RegexIntent } from '../src/decorators/regex-intent.decorator';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Повтор вопроса
 * 
 * Положительные тесты:
 * - "повтори"
 * - "повторить"
 * - "еще раз"
 * - "не расслышал"
 * - "не поняла"
 * - "что ты сказала"
 * - "скажи еще раз"
 * - "повтори вопрос"
 * 
 * Отрицательные тесты:
 * - "да"
 * - "нет"
 * - "помощь"
 */

// Грамматика Яндекса:
/*
root:
  повтори |
  повторить |
  еще раз |
  не расслышал |
  не поняла |
  что ты сказала |
  скажи еще раз |
  повтори вопрос

slots:
*/

@RegexIntent({
  pattern: /(повтори|повторить|еще\s+раз|не\s+расслышал|не\s+поняла|что\s+ты\s+сказала|скажи\s+еще\s+раз|повтори\s+вопрос)/i,
  priority: 6,
  description: 'Повтор вопроса'
})
export function spiralRepeat(_context: any, matches: RegExpMatchArray): AliceResponse {
  // TODO: Реализовать логику для spiral.repeat
  
  return new SkillResponseBuilder(
    'Обработка интента: spiral.repeat'
  ).build();
}

// Тесты
export const tests = {
  positive: [
  "повтори",
  "повторить",
  "еще раз",
  "не расслышал",
  "не поняла",
  "что ты сказала",
  "скажи еще раз",
  "повтори вопрос"
],
  negative: [
  "да",
  "нет",
  "помощь"
]
};
