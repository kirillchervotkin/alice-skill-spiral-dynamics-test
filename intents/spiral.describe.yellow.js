"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralDescribeYellow = spiralDescribeYellow;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Описание желтого уровня
 *
 * Положительные тесты:
 * - "опиши желтый"
 * - "расскажи про желтый"
 * - "что такое желтый"
 * - "про желтый"
 * - "о желтом"
 * - "желтый"
 * - "опиши yellow"
 *
 * Отрицательные тесты:
 * - "опиши красный"
 * - "синий"
 * - "помощь"
 */
// Грамматика Яндекса:
/*
root:
  опиши желтый |
  расскажи про желтый |
  что такое желтый |
  про желтый |
  о желтом |
  желтый |
  опиши yellow

slots:
*/
function spiralDescribeYellow(_context, matches) {
    return new alice_nestjs_framework_1.SkillResponseBuilder('Желтый: Гибкость систем: адаптивность, функциональность, интеграция знаний, видение связей.').build();
}
// Тесты
exports.tests = {
    positive: [
        "опиши желтый",
        "расскажи про желтый",
        "что такое желтый",
        "про желтый",
        "о желтом",
        "желтый",
        "опиши yellow"
    ],
    negative: [
        "опиши красный",
        "синий",
        "помощь"
    ]
};
//# sourceMappingURL=spiral.describe.yellow.js.map