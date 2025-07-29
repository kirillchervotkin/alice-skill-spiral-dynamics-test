"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralRepeatResults = spiralRepeatResults;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Повтор результатов
 *
 * Положительные тесты:
 * - "повтори результаты"
 * - "результаты"
 * - "мои результаты"
 * - "что получилось"
 * - "итоги"
 * - "повтори итоги"
 * - "скажи результат"
 *
 * Отрицательные тесты:
 * - "начать тест"
 * - "помощь"
 * - "да"
 */
// Грамматика Яндекса:
/*
root:
  повтори результаты |
  результаты |
  мои результаты |
  что получилось |
  итоги |
  повтори итоги |
  скажи результат

slots:
*/
function spiralRepeatResults(_context, matches) {
    // TODO: Реализовать логику для spiral.repeat_results
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.repeat_results').build();
}
// Тесты
exports.tests = {
    positive: [
        "повтори результаты",
        "результаты",
        "мои результаты",
        "что получилось",
        "итоги",
        "повтори итоги",
        "скажи результат"
    ],
    negative: [
        "начать тест",
        "помощь",
        "да"
    ]
};
//# sourceMappingURL=spiral.repeat_results.js.map