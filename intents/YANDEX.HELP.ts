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

// Паттерн: /(помощь|что\s+ты\s+умеешь|как\s+пользоваться|инструкция|справка)/i
// Приоритет: 10
export function yandexHelp(_context: any, matches: RegExpMatchArray): AliceResponse {
    const command = matches[0].toLowerCase();
    
    // Для всех запросов помощи - краткий ответ
    return new SkillResponseBuilder(
        'Привет! Я помогу разобраться с навыком. ' +
        'Чтобы узнать подробности о навыке, скажите "о навыке". ' +
        'Чтобы начать тест, скажите "начать тест".'
    )
      .setButtons([
        { title: "О навыке", hide: true },
        { title: "Начать тест", hide: true }
      ])
      .build();
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
