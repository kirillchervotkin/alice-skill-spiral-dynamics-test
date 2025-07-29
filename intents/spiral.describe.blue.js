"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralDescribeBlue = spiralDescribeBlue;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Описание синего уровня
 *
 * Положительные тесты:
 * - "опиши синий"
 * - "расскажи про синий"
 * - "что такое синий"
 * - "про синий"
 * - "о синем"
 * - "синий"
 * - "опиши blue"
 *
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */
// Грамматика Яндекса:
/*
root:
  опиши синий |
  расскажи про синий |
  что такое синий |
  про синий |
  о синем |
  синий |
  опиши blue

slots:
*/
function spiralDescribeBlue(_context, matches) {
    return new alice_nestjs_framework_1.SkillResponseBuilder('Синий: Основа — порядок: правила, иерархия, долг, абсолютная истина, стабильность.').build();
}
// Тесты
exports.tests = {
    positive: [
        "опиши синий",
        "расскажи про синий",
        "что такое синий",
        "про синий",
        "о синем",
        "синий",
        "опиши blue"
    ],
    negative: [
        "опиши красный",
        "желтый",
        "помощь"
    ]
};
//# sourceMappingURL=spiral.describe.blue.js.map