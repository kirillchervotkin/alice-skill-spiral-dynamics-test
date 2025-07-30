"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.yandexHelp = yandexHelp;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
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
function yandexHelp(_context, matches) {
    // TODO: Реализовать логику для YANDEX.HELP
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: YANDEX.HELP').build();
}
// Тесты
exports.tests = {
    positive: [
        "помощь",
        "что ты умеешь",
        "о навыке",
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
//# sourceMappingURL=YANDEX.HELP.js.map