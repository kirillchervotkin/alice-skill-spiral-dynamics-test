"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralAnswerUnsure = spiralAnswerUnsure;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Не уверен
 *
 * Положительные тесты:
 * - "не знаю"
 * - "не уверен"
 * - "затрудняюсь"
 * - "может быть"
 * - "возможно"
 * - "сложно сказать"
 * - "трудно сказать"
 * - "по разному"
 * - "и да и нет"
 *
 * Отрицательные тесты:
 * - "да"
 * - "нет"
 * - "точно"
 */
// Грамматика Яндекса:
/*
root:
  не знаю |
  не уверен |
  затрудняюсь |
  может быть |
  возможно |
  сложно сказать |
  трудно сказать |
  по разному |
  и да и нет

slots:
*/
function spiralAnswerUnsure(_context, matches) {
    // TODO: Реализовать логику для spiral.answer.unsure
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.answer.unsure').build();
}
// Тесты
exports.tests = {
    positive: [
        "не знаю",
        "не уверен",
        "затрудняюсь",
        "может быть",
        "возможно",
        "сложно сказать",
        "трудно сказать",
        "по разному",
        "и да и нет"
    ],
    negative: [
        "да",
        "нет",
        "точно"
    ]
};
//# sourceMappingURL=spiral.answer.unsure.js.map