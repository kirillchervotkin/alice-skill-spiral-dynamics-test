"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralStart = spiralStart;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Запуск теста
 *
 * Положительные тесты:
 * - "начать тест"
 * - "пройти тест"
 * - "запустить тест"
 * - "начинаем"
 * - "старт"
 * - "тестирование"
 * - "хочу пройти тест"
 * - "давай начнем"
 * - "готов к тесту"
 * - "начать диагностику"
 *
 * Отрицательные тесты:
 * - "помощь"
 * - "выйти"
 * - "результаты"
 */
// Грамматика Яндекса:
/*
root:
  начать тест |
  пройти тест |
  запустить тест |
  начинаем |
  старт |
  тестирование |
  хочу пройти тест |
  давай начнем |
  готов к тесту |
  начать диагностику

slots:
*/
function spiralStart(_context, matches) {
    // TODO: Реализовать логику для spiral.start
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.start').build();
}
// Тесты
exports.tests = {
    positive: [
        "начать тест",
        "пройти тест",
        "запустить тест",
        "начинаем",
        "старт",
        "тестирование",
        "хочу пройти тест",
        "давай начнем",
        "готов к тесту",
        "начать диагностику"
    ],
    negative: [
        "помощь",
        "выйти",
        "результаты"
    ]
};
//# sourceMappingURL=spiral.start.js.map