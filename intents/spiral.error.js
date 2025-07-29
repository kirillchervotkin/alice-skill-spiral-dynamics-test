"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralError = spiralError;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Обработка ошибок
 *
 * Положительные тесты:
 * - "не понял"
 * - "не поняла"
 * - "ошибка"
 * - "что делать"
 * - "не работает"
 * - "проблема"
 * - "сломалось"
 *
 * Отрицательные тесты:
 * - "помощь"
 * - "да"
 * - "нет"
 */
// Грамматика Яндекса:
/*
root:
  не понял |
  не поняла |
  ошибка |
  что делать |
  не работает |
  проблема |
  сломалось

slots:
*/
function spiralError(_context, matches) {
    // TODO: Реализовать логику для spiral.error
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.error').build();
}
// Тесты
exports.tests = {
    positive: [
        "не понял",
        "не поняла",
        "ошибка",
        "что делать",
        "не работает",
        "проблема",
        "сломалось"
    ],
    negative: [
        "помощь",
        "да",
        "нет"
    ]
};
//# sourceMappingURL=spiral.error.js.map