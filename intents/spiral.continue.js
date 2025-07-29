"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralContinue = spiralContinue;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Продолжить тест
 *
 * Положительные тесты:
 * - "продолжить"
 * - "продолжаем"
 * - "дальше"
 * - "идем дальше"
 * - "следующий"
 * - "продолжи тест"
 * - "возобновить"
 *
 * Отрицательные тесты:
 * - "стоп"
 * - "пауза"
 * - "помощь"
 */
// Грамматика Яндекса:
/*
root:
  продолжить |
  продолжаем |
  дальше |
  идем дальше |
  следующий |
  продолжи тест |
  возобновить

slots:
*/
function spiralContinue(_context, matches) {
    // TODO: Реализовать логику для spiral.continue
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.continue').build();
}
// Тесты
exports.tests = {
    positive: [
        "продолжить",
        "продолжаем",
        "дальше",
        "идем дальше",
        "следующий",
        "продолжи тест",
        "возобновить"
    ],
    negative: [
        "стоп",
        "пауза",
        "помощь"
    ]
};
//# sourceMappingURL=spiral.continue.js.map