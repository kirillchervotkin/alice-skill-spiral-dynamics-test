"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralAnswerNo = spiralAnswerNo;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Ответ нет на вопрос
 *
 * Положительные тесты:
 * - "нет"
 * - "не согласен"
 * - "неверно"
 * - "не правильно"
 * - "никогда"
 * - "ни в коем случае"
 *
 * Отрицательные тесты:
 * - "да"
 * - "согласен"
 * - "может быть"
 */
// Грамматика Яндекса:
/*
root:
  нет |
  не согласен |
  неверно |
  не правильно |
  никогда |
  ни в коем случае

slots:
*/
function spiralAnswerNo(_context, matches) {
    // TODO: Реализовать логику для spiral.answer.no
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.answer.no').build();
}
// Тесты
exports.tests = {
    positive: [
        "нет",
        "не согласен",
        "неверно",
        "не правильно",
        "никогда",
        "ни в коем случае"
    ],
    negative: [
        "да",
        "согласен",
        "может быть"
    ]
};
//# sourceMappingURL=spiral.answer.no.js.map