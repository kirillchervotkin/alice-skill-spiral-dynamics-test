"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralDescribePurple = spiralDescribePurple;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Описание фиолетового уровня
 *
 * Положительные тесты:
 * - "опиши фиолетовый"
 * - "расскажи про фиолетовый"
 * - "что такое фиолетовый"
 * - "про фиолетовый"
 * - "о фиолетовом"
 * - "фиолетовый"
 * - "опиши purple"
 *
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */
// Грамматика Яндекса:
/*
root:
  опиши фиолетовый |
  расскажи про фиолетовый |
  что такое фиолетовый |
  про фиолетовый |
  о фиолетовом |
  фиолетовый |
  опиши purple

slots:
*/
function spiralDescribePurple(_context, matches) {
    return new alice_nestjs_framework_1.SkillResponseBuilder('Фиолетовый: Сила традиций: ритуалы, духи предков, мистика, верность \'своим\'.').build();
}
// Тесты
exports.tests = {
    positive: [
        "опиши фиолетовый",
        "расскажи про фиолетовый",
        "что такое фиолетовый",
        "про фиолетовый",
        "о фиолетовом",
        "фиолетовый",
        "опиши purple"
    ],
    negative: [
        "опиши красный",
        "желтый",
        "помощь"
    ]
};
//# sourceMappingURL=spiral.describe.purple.js.map