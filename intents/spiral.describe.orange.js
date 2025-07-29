"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralDescribeOrange = spiralDescribeOrange;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Описание оранжевого уровня
 *
 * Положительные тесты:
 * - "опиши оранжевый"
 * - "расскажи про оранжевый"
 * - "что такое оранжевый"
 * - "про оранжевый"
 * - "о оранжевом"
 * - "оранжевый"
 * - "опиши orange"
 *
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */
// Грамматика Яндекса:
/*
root:
  опиши оранжевый |
  расскажи про оранжевый |
  что такое оранжевый |
  про оранжевый |
  о оранжевом |
  оранжевый |
  опиши orange

slots:
*/
function spiralDescribeOrange(_context, matches) {
    return new alice_nestjs_framework_1.SkillResponseBuilder('Оранжевый: Двигатель прогресса: стратегия, успех, конкуренция, инновации, личные достижения.').build();
}
// Тесты
exports.tests = {
    positive: [
        "опиши оранжевый",
        "расскажи про оранжевый",
        "что такое оранжевый",
        "про оранжевый",
        "о оранжевом",
        "оранжевый",
        "опиши orange"
    ],
    negative: [
        "опиши красный",
        "желтый",
        "помощь"
    ]
};
//# sourceMappingURL=spiral.describe.orange.js.map