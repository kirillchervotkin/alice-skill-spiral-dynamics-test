"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralAbout = spiralAbout;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * О навыке - что умеет навык
 *
 * Положительные тесты:
 * - "о навыке"
 * - "что ты умеешь"
 * - "что может навык"
 * - "какие функции"
 * - "возможности навыка"
 * - "что можешь делать"
 * - "расскажи о навыке"
 * - "описание навыка"
 * - "функции навыка"
 *
 * Отрицательные тесты:
 * - "начать тест"
 * - "помощь"
 * - "да"
 */
// Грамматика Яндекса:
/*
root:
  о навыке |
  что ты умеешь |
  что может навык |
  какие функции |
  возможности навыка |
  что можешь делать |
  расскажи о навыке |
  описание навыка |
  функции навыка

slots:
*/
function spiralAbout(_context, matches) {
    // TODO: Реализовать логику для spiral.about
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.about').build();
}
// Тесты
exports.tests = {
    positive: [
        "о навыке",
        "что ты умеешь",
        "что может навык",
        "какие функции",
        "возможности навыка",
        "что можешь делать",
        "расскажи о навыке",
        "описание навыка",
        "функции навыка"
    ],
    negative: [
        "начать тест",
        "помощь",
        "да"
    ]
};