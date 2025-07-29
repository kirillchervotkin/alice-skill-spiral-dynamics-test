"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralDescribeTurquoise = spiralDescribeTurquoise;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Описание бирюзового уровня
 *
 * Положительные тесты:
 * - "опиши бирюзовый"
 * - "расскажи про бирюзовый"
 * - "что такое бирюзовый"
 * - "про бирюзовый"
 * - "о бирюзовом"
 * - "бирюзовый"
 * - "опиши turquoise"
 *
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */
// Грамматика Яндекса:
/*
root:
  опиши бирюзовый |
  расскажи про бирюзовый |
  что такое бирюзовый |
  про бирюзовый |
  о бирюзовом |
  бирюзовый |
  опиши turquoise

slots:
*/
function spiralDescribeTurquoise(_context, matches) {
    return new alice_nestjs_framework_1.SkillResponseBuilder('Бирюзовый: Целостность мира: глобальное сознание, холизм, духовность, единство жизни, эволюция.').build();
}
// Тесты
exports.tests = {
    positive: [
        "опиши бирюзовый",
        "расскажи про бирюзовый",
        "что такое бирюзовый",
        "про бирюзовый",
        "о бирюзовом",
        "бирюзовый",
        "опиши turquoise"
    ],
    negative: [
        "опиши красный",
        "желтый",
        "помощь"
    ]
};
//# sourceMappingURL=spiral.describe.turquoise.js.map