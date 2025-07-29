#!/usr/bin/env node

import { YandexGrammarParser, YandexIntent } from './yandex-grammar-parser';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Пример использования:
 * 
 * 1. Создайте JSON файл с интентами из Яндекс.Диалогов:
 * {
 *   "intents": [
 *     {
 *       "name": "spiral.describe.yellow",
 *       "description": "Описание желтого уровня",
 *       "grammar": "root:\n  опиши желтый |\n  расскажи про желтый |\n  что такое желтый |\n  про желтый |\n  о желтом |\n  желтый |\n  опиши yellow",
 *       "positiveTests": ["желтый", "опиши желтый", "расскажи про желтый", "что такое желтый уровень"],
 *       "negativeTests": ["опиши красный", "расскажи про синий", "что такое зеленый"],
 *       "priority": 8
 *     }
 *   ]
 * }
 * 
 * 2. Запустите: npx ts-node src/utils/convert-yandex-intents.ts intents.json
 */

interface IntentsFile {
  intents: YandexIntent[];
}

function convertIntentsFile(inputFile: string, outputDir: string = 'src/generated') {
  if (!fs.existsSync(inputFile)) {
    console.error(`Файл ${inputFile} не найден`);
    process.exit(1);
  }

  const data: IntentsFile = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  
  if (!data.intents || !Array.isArray(data.intents)) {
    console.error('Неверный формат файла. Ожидается объект с массивом intents');
    process.exit(1);
  }

  // Создаем директорию для вывода
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Генерируем контроллер
  const controllerMethods = data.intents.map(intent => 
    YandexGrammarParser.generateControllerMethod(intent)
  ).join('\n');

  const controllerCode = `import { Controller, OnModuleInit } from '@nestjs/common';
import { RegexIntent } from '../decorators/regex-intent.decorator';
import { RegexIntentService } from '../services/regex-intent.service';
import { SkillResponseBuilder, AliceResponse } from '@kirillchervotkin/alice-nestjs-framework';

@Controller()
export class GeneratedRegexController implements OnModuleInit {
  constructor(private readonly regexService: RegexIntentService) {}

  onModuleInit() {
    this.registerRegexHandlers();
  }

  private registerRegexHandlers() {
    const prototype = Object.getPrototypeOf(this);
    const methodNames = Object.getOwnPropertyNames(prototype);

    for (const methodName of methodNames) {
      const method = prototype[methodName];
      if (typeof method === 'function') {
        const regexOptions = Reflect.getMetadata('regex_intent', method);
        if (regexOptions) {
          const pattern = typeof regexOptions.pattern === 'string' 
            ? new RegExp(regexOptions.pattern, 'i') 
            : regexOptions.pattern;
          
          this.regexService.registerHandler(this, methodName, pattern, regexOptions);
        }
      }
    }
  }
${controllerMethods}
}`;

  fs.writeFileSync(path.join(outputDir, 'generated-regex.controller.ts'), controllerCode);

  // Генерируем тесты
  const testMethods = data.intents.map(intent => 
    YandexGrammarParser.generateTests(intent)
  ).join('\n');

  const testCode = `import { Test, TestingModule } from '@nestjs/testing';
import { RegexIntentService } from '../services/regex-intent.service';
import { GeneratedRegexController } from './generated-regex.controller';

describe('GeneratedRegexController', () => {
  let controller: GeneratedRegexController;
  let regexService: RegexIntentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneratedRegexController],
      providers: [RegexIntentService],
    }).compile();

    controller = module.get<GeneratedRegexController>(GeneratedRegexController);
    regexService = module.get<RegexIntentService>(RegexIntentService);
    
    // Инициализируем обработчики
    controller.onModuleInit();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
${testMethods}
});`;

  fs.writeFileSync(path.join(outputDir, 'generated-regex.controller.spec.ts'), testCode);

  // Генерируем README с инструкциями
  const readmeContent = `# Сгенерированные Regex Контроллеры

Этот код был автоматически сгенерирован из интентов Яндекс.Диалогов.

## Интенты:

${data.intents.map(intent => `
### ${intent.name}
- **Описание**: ${intent.description}
- **Приоритет**: ${intent.priority || 5}
- **Положительные тесты**: ${intent.positiveTests.join(', ')}
- **Отрицательные тесты**: ${intent.negativeTests.join(', ')}

**Грамматика:**
\`\`\`
${intent.grammar}
\`\`\`
`).join('\n')}

## Использование

1. Добавьте \`GeneratedRegexController\` в ваш модуль
2. Реализуйте логику в сгенерированных методах
3. Запустите тесты: \`npm test generated-regex.controller.spec.ts\`
`;

  fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);

  console.log(`✅ Конвертация завершена!`);
  console.log(`📁 Файлы созданы в директории: ${outputDir}`);
  console.log(`📄 Контроллер: ${path.join(outputDir, 'generated-regex.controller.ts')}`);
  console.log(`🧪 Тесты: ${path.join(outputDir, 'generated-regex.controller.spec.ts')}`);
  console.log(`📖 README: ${path.join(outputDir, 'README.md')}`);
}

// CLI интерфейс
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Использование: npx ts-node src/utils/convert-yandex-intents.ts <input-file> [output-dir]

Пример:
  npx ts-node src/utils/convert-yandex-intents.ts intents.json
  npx ts-node src/utils/convert-yandex-intents.ts intents.json src/my-generated
    `);
    process.exit(1);
  }

  const inputFile = args[0];
  const outputDir = args[1] || 'src/generated';
  
  convertIntentsFile(inputFile, outputDir);
}

export { convertIntentsFile };