"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralDescribeGreen = spiralDescribeGreen;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Описание зеленого уровня
 *
 * Положительные тесты:
 * - "опиши зеленый"
 * - "расскажи про зеленый"
 * - "что такое зеленый"
 * - "про зеленый"
 * - "о зеленом"
 * - "зеленый"
 * - "опиши green"
 *
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */
// Грамматика Яндекса:
/*
root:
  опиши зеленый |
  расскажи про зеленый |
  что такое зеленый |
  про зеленый |
  о зеленом |
  зеленый |
  опиши green

slots:
*/
function spiralDescribeGreen(_context, matches) {
    return new alice_nestjs_framework_1.SkillResponseBuilder('Зеленый: Ценность гармонии: равенство, эмпатия, сообщество, консенсус, забота о людях.').build();
}
// Тесты
exports.tests = {
    positive: [
        "опиши зеленый",
        "расскажи про зеленый",
        "что такое зеленый",
        "про зеленый",
        "о зеленом",
        "зеленый",
        "опиши green"
    ],
    negative: [
        "опиши красный",
        "желтый",
        "помощь"
    ]
};
//# sourceMappingURL=spiral.describe.green.js.map