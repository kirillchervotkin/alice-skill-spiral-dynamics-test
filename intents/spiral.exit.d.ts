import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
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
export declare function spiralExit(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};
//# sourceMappingURL=spiral.exit.d.ts.map