"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralAnswerYes = spiralAnswerYes;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Ответ Да на вопрос
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
  именно так

slots:
*/
function spiralAnswerYes(_context, matches) {
    // TODO: Реализовать логику для spiral.answer.yes
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.answer.yes').build();
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
        "именно так"
    ],
    negative: [
        "нет",
        "не согласен",
        "может быть"
    ]
};
//# sourceMappingURL=spiral.answer.yes.js.map