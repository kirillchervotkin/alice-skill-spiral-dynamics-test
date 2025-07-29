"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
exports.spiralExit = spiralExit;
const alice_nestjs_framework_1 = require("@kirillchervotkin/alice-nestjs-framework");
/**
 * Выход из навыка
 *
 * Положительные тесты:
 * - "выйти"
 * - "выход"
 * - "закончить"
 * - "завершить"
 * - "хватит"
 * - "достаточно"
 * - "до свидания"
 * - "пока"
 *
 * Отрицательные тесты:
 * - "начать"
 * - "продолжить"
 * - "помощь"
 */
// Грамматика Яндекса:
/*
root:
  выйти |
  выход |
  закончить |
  завершить |
  хватит |
  достаточно |
  до свидания |
  пока

slots:
*/
function spiralExit(_context, matches) {
    // TODO: Реализовать логику для spiral.exit
    return new alice_nestjs_framework_1.SkillResponseBuilder('Обработка интента: spiral.exit').build();
}
// Тесты
exports.tests = {
    positive: [
        "выйти",
        "выход",
        "закончить",
        "завершить",
        "хватит",
        "достаточно",
        "до свидания",
        "пока"
    ],
    negative: [
        "начать",
        "продолжить",
        "помощь"
    ]
};
//# sourceMappingURL=spiral.exit.js.map