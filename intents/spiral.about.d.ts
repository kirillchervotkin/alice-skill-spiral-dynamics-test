import { AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';
/**
 * О навыке - что умеет навык
 *
 * Положительные тесты:
 * - "о навыке"
 * - "что может навык"
 * - "какие функции"
 * - "возможности навыка"
 * - "что можешь делать"
 * - "расскажи о навыке"
 * - "описание навыка"
 * - "функции навыка"
 *
 * Отрицательные тесты:
 * - "начать тест"
 * - "помощь"
 * - "да"
 */
export declare function spiralAbout(_context: any, matches: RegExpMatchArray): AliceResponse;
export declare const tests: {
    positive: string[];
    negative: string[];
};