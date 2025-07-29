"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralYes = spiralYes;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Ответ Да
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
 * - "ага"
 * - "угу"
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
  именно так |
  ага |
  угу

slots:
*/
function spiralYes(_context, matches) {
    // TODO: Реализовать логику для spiral.yes
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.yes').build();
}
// Тесты
exports.tests = {
    positive: [
        "да",
        "согласен",
        "верно",
        "правильно",
        "конечно",
        "точно",
        "абсолютно",
        "именно так",
        "ага",
        "угу"
    ],
    negative: [
        "нет",
        "не согласен",
        "может быть"
    ]
};
//# sourceMappingURL=spiral.yes.js.map