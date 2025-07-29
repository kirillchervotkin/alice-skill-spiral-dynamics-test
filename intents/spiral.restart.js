"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralRestart = spiralRestart;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Начать заново
 *
 * Положительные тесты:
 * - "заново"
 * - "сначала"
 * - "перезапустить"
 * - "начать заново"
 * - "повторить тест"
 * - "с начала"
 * - "рестарт"
 *
 * Отрицательные тесты:
 * - "продолжить"
 * - "помощь"
 * - "результаты"
 */
// Грамматика Яндекса:
/*
root:
  заново |
  сначала |
  перезапустить |
  начать заново |
  повторить тест |
  с начала |
  рестарт

slots:
*/
function spiralRestart(_context, matches) {
    // TODO: Реализовать логику для spiral.restart
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.restart').build();
}
// Тесты
exports.tests = {
    positive: [
        "заново",
        "сначала",
        "перезапустить",
        "начать заново",
        "повторить тест",
        "с начала",
        "рестарт"
    ],
    negative: [
        "продолжить",
        "помощь",
        "результаты"
    ]
};
//# sourceMappingURL=spiral.restart.js.map