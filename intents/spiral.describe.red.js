"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralDescribeRed = spiralDescribeRed;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Описание красного уровня
 *
 * Положительные тесты:
 * - "опиши красный"
 * - "расскажи про красный"
 * - "что такое красный"
 * - "про красный"
 * - "о красном"
 * - "красный"
 * - "опиши red"
 *
 * Отрицательные тесты:
 * - "опиши желтый"
 * - "синий"
 * - "помощь"
 */
// Грамматика Яндекса:
/*
root:
  опиши красный |
  расскажи про красный |
  что такое красный |
  про красный |
  о красном |
  красный |
  опиши red

slots:
*/
function spiralDescribeRed(_context, matches) {
    return new alice_nestjs_framework_1.SkillResponseBuilder('Красный: Мир-джунгли: сила, власть, импульсы, победа любой ценой, \'беру что хочу\'.').build();
}
// Тесты
exports.tests = {
    positive: [
        "опиши красный",
        "расскажи про красный",
        "что такое красный",
        "про красный",
        "о красном",
        "красный",
        "опиши red"
    ],
    negative: [
        "опиши желтый",
        "синий",
        "помощь"
    ]
};
//# sourceMappingURL=spiral.describe.red.js.map