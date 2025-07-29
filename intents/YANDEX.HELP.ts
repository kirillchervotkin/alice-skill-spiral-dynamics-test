import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

/**
 * Помощь
 * 
 * Положительные тесты:
 * - "помощь"
 * - "что ты умеешь"
 * - "как пользоваться"
 * - "инструкция"
 * - "справка"
 * 
 * Отрицательные тесты:
 * - "начать тест"
 * - "желтый"
 * - "да"
 */

// Грамматика Яндекса:
/*
root:
  помощь |
  что ты умеешь |
  как пользоваться |
  инструкция |
  справка

slots:
*/

@RegexIntent({
    pattern: /(помощь|что\s+ты\s+умеешь|как\s+пользоваться|инструкция|справка)/i,
    priority: 10,
    description: 'Помощь'
})
export function yandexHelp(_context: any, matches: RegExpMatchArray): AliceResponse {
    // TODO: Реализовать логику для YANDEX.HELP

    return new SkillResponseBuilder(
        'Обработка интента: YANDEX.HELP'
    ).build();
}

// Тесты
export const tests = {
    positive: [
        "помощь",
        "что ты умеешь",
        "как пользоваться",
        "инструкция",
        "справка"
    ],
    negative: [
        "начать тест",
        "желтый",
        "да"
    ]
};
