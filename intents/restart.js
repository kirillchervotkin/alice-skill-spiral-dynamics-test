"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.restart = restart;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Перезапуск
 *
 * Положительные тесты:
 * - "заново"
 * - "сначала"
 * - "перезапустить"
 * - "начать заново"
 * - "повторить тест"
 *
 * Отрицательные тесты:
 * - "помощь"
 * - "да"
 * - "нет"
 */
// Грамматика Яндекса:
/*
root:
  заново |
  сначала |
  перезапустить |
  начать заново |
  повторить тест

slots:
*/
function restart(_context, matches) {
    // TODO: Реализовать логику для restart
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: restart').build();
}
// Тесты
exports.tests = {
    positive: [
        "заново",
        "сначала",
        "перезапустить",
        "начать заново",
        "повторить тест"
    ],
    negative: [
        "помощь",
        "да",
        "нет"
    ]
};
//# sourceMappingURL=restart.js.map