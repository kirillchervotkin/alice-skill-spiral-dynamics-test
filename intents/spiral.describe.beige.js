"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralDescribeBeige = spiralDescribeBeige;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Описание бежевого уровня
 *
 * Положительные тесты:
 * - "опиши бежевый"
 * - "расскажи про бежевый"
 * - "что такое бежевый"
 * - "про бежевый"
 * - "о бежевом"
 * - "бежевый"
 * - "опиши beige"
 *
 * Отрицательные тесты:
 * - "опиши красный"
 * - "желтый"
 * - "помощь"
 */
// Грамматика Яндекса:
/*
root:
  опиши бежевый |
  расскажи про бежевый |
  что такое бежевый |
  про бежевый |
  о бежевом |
  бежевый |
  опиши beige

slots:
*/
function spiralDescribeBeige(_context, matches) {
    return new alice_nestjs_framework_1.SkillResponseBuilder('Бежевый: Фокус на выживании: еда, безопасность, здоровье, действия по инстинкту.').build();
}
// Тесты
exports.tests = {
    positive: [
        "опиши бежевый",
        "расскажи про бежевый",
        "что такое бежевый",
        "про бежевый",
        "о бежевом",
        "бежевый",
        "опиши beige"
    ],
    negative: [
        "опиши красный",
        "желтый",
        "помощь"
    ]
};
//# sourceMappingURL=spiral.describe.beige.js.map