"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralRepeat = spiralRepeat;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Повтор вопроса
 *
 * Положительные тесты:
 * - "повтори"
 * - "повторить"
 * - "еще раз"
 * - "не расслышал"
 * - "не поняла"
 * - "что ты сказала"
 * - "скажи еще раз"
 * - "повтори вопрос"
 *
 * Отрицательные тесты:
 * - "да"
 * - "нет"
 * - "помощь"
 */
// Грамматика Яндекса:
/*
root:
  повтори |
  повторить |
  еще раз |
  не расслышал |
  не поняла |
  что ты сказала |
  скажи еще раз |
  повтори вопрос

slots:
*/
function spiralRepeat(_context, matches) {
    // TODO: Реализовать логику для spiral.repeat
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.repeat').build();
}
// Тесты
exports.tests = {
    positive: [
        "повтори",
        "повторить",
        "еще раз",
        "не расслышал",
        "не поняла",
        "что ты сказала",
        "скажи еще раз",
        "повтори вопрос"
    ],
    negative: [
        "да",
        "нет",
        "помощь"
    ]
};
//# sourceMappingURL=spiral.repeat.js.map