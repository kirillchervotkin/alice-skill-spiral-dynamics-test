"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralPause = spiralPause;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Пауза теста
 *
 * Положительные тесты:
 * - "пауза"
 * - "остановить"
 * - "приостановить"
 * - "стоп"
 * - "подожди"
 * - "остановись"
 * - "прерви тест"
 *
 * Отрицательные тесты:
 * - "продолжить"
 * - "дальше"
 * - "начать"
 */
// Грамматика Яндекса:
/*
root:
  пауза |
  остановить |
  приостановить |
  стоп |
  подожди |
  остановись |
  прерви тест

slots:
*/
function spiralPause(_context, matches) {
    // TODO: Реализовать логику для spiral.pause
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.pause').build();
}
// Тесты
exports.tests = {
    positive: [
        "пауза",
        "остановить",
        "приостановить",
        "стоп",
        "подожди",
        "остановись",
        "прерви тест"
    ],
    negative: [
        "продолжить",
        "дальше",
        "начать"
    ]
};
//# sourceMappingURL=spiral.pause.js.map