export interface YandexIntent {
  name: string;
  description: string;
  grammar: string;
  positiveTests: string[];
  negativeTests: string[];
  priority?: number;
}

export interface ParsedGrammar {
  patterns: string[];
  slots: Record<string, string[]>;
}

export class YandexGrammarParser {
  
  /**
   * Парсит грамматику Яндекса и конвертирует в regex паттерны
   */
  static parseGrammar(grammar: string): ParsedGrammar {
    const lines = grammar.split('\n').map(line => line.trim()).filter(line => line);
    const patterns: string[] = [];
    const slots: Record<string, string[]> = {};
    
    let currentSection = 'root';
    
    for (const line of lines) {
      if (line.startsWith('root:')) {
        currentSection = 'root';
        continue;
      }
      
      if (line.startsWith('slots:')) {
        currentSection = 'slots';
        continue;
      }
      
      if (currentSection === 'root') {
        // Конвертируем строки грамматики в regex
        const pattern = this.convertGrammarLineToRegex(line);
        if (pattern) {
          patterns.push(pattern);
        }
      }
      
      if (currentSection === 'slots') {
        // Парсим слоты (пока не используем, но может пригодиться)
        const slotMatch = line.match(/(\w+):\s*(.+)/);
        if (slotMatch) {
          const [, slotName, slotValues] = slotMatch;
          slots[slotName] = slotValues.split('|').map(v => v.trim());
        }
      }
    }
    
    return { patterns, slots };
  }
  
  /**
   * Конвертирует строку грамматики Яндекса в regex паттерн
   */
  private static convertGrammarLineToRegex(line: string): string | null {
    if (!line || line.startsWith('//')) return null;
    
    // Убираем лишние символы
    let pattern = line.replace(/^\s*\d+\s*/, ''); // убираем номера строк
    pattern = pattern.replace(/\s*\|\s*$/, ''); // убираем завершающий |
    
    // Конвертируем альтернативы через |
    const alternatives = pattern.split('|').map(alt => alt.trim()).filter(alt => alt);
    
    if (alternatives.length === 0) return null;
    
    // Создаем regex паттерн
    const regexParts = alternatives.map(alt => {
      // Экранируем специальные символы regex
      let regexAlt = alt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Заменяем пробелы на \s+
      regexAlt = regexAlt.replace(/\s+/g, '\\s+');
      
      return regexAlt;
    });
    
    if (regexParts.length === 1) {
      return regexParts[0];
    } else {
      return `(${regexParts.join('|')})`;
    }
  }
  
  /**
   * Создает полный regex паттерн из частей грамматики
   */
  static createRegexPattern(patterns: string[]): string {
    if (patterns.length === 0) return '';
    
    if (patterns.length === 1) {
      return patterns[0];
    }
    
    return `(${patterns.join('|')})`;
  }
  
  /**
   * Конвертирует интент Яндекса в TypeScript код для контроллера
   */
  static generateControllerMethod(intent: YandexIntent): string {
    const parsed = this.parseGrammar(intent.grammar);
    const regexPattern = this.createRegexPattern(parsed.patterns);
    
    const methodName = this.camelCase(intent.name);
    const priority = intent.priority || 5;
    
    return `
  // ${intent.description}
  @RegexIntent({
    pattern: /${regexPattern}/i,
    priority: ${priority},
    description: '${intent.description}'
  })
  ${methodName}(_context: any, matches: RegExpMatchArray): AliceResponse {
    // TODO: Реализовать логику обработки
    return new SkillResponseBuilder(
      'Обработка интента: ${intent.name}'
    ).build();
  }`;
  }
  
  /**
   * Конвертирует строку в camelCase
   */
  private static camelCase(str: string): string {
    return str
      .replace(/[^a-zA-Zа-яА-Я0-9]/g, ' ')
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }
  
  /**
   * Генерирует тесты на основе положительных примеров
   */
  static generateTests(intent: YandexIntent): string {
    const testCases = intent.positiveTests.map(test => 
      `    expect(regexService.hasMatch('${test}')).toBe(true);`
    ).join('\n');
    
    const negativeTestCases = intent.negativeTests.map(test => 
      `    expect(regexService.hasMatch('${test}')).toBe(false);`
    ).join('\n');
    
    return `
  describe('${intent.name}', () => {
    it('should match positive cases', () => {
${testCases}
    });
    
    it('should not match negative cases', () => {
${negativeTestCases}
    });
  });`;
  }
}