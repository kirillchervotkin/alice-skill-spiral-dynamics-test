import { Test, TestingModule } from '@nestjs/testing';
import { AliceController } from './alice.controller';
import { SpiralDynamicsService } from '../spiral-dynamics/spiral-dynamics.service';
import { QuestionsService } from '../spiral-dynamics/questions.service';

describe('AliceController (Simple Tests)', () => {
  let controller: AliceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AliceController],
      providers: [SpiralDynamicsService, QuestionsService],
    }).compile();

    controller = module.get<AliceController>(AliceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Basic functionality', () => {
    it('should return welcome message', () => {
      const response = controller.defaultHandler({});
      
      expect(response).toBeDefined();
      expect(response.response).toBeDefined();
      expect(response.response.text).toContain('Привет!');
      expect(response.response.text).toContain('Спиральной динамики');
      expect(response.response.end_session).toBe(false);
    });

    it('should return help message', () => {
      const mockData = {
        request: {
          command: 'что ты умеешь',
          original_utterance: 'что ты умеешь'
        }
      };
      const response = controller.whatCanYouDo(mockData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Я умею:');
      expect(response.response.text).toContain('Проводить тест на определение ценностей');
    });

    it('should handle agreement to start', () => {
      const response = controller.agreeToStart({ state: 'welcome' });

      expect(response).toBeDefined();
      expect(response.response.text).toContain('Отлично! Начнём!');
      expect(response.response.text).toContain('Вопрос 1 из 24');
    });

    it('should handle refusal', () => {
      const response = controller.exit({ state: 'welcome' });

      expect(response).toBeDefined();
      expect(response.response.text).toBe('Всегда рада помочь. Обращайтесь!');
      expect(response.response.end_session).toBe(true);
    });

    it('should handle exit', () => {
      const response = controller.exitSkill();
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('До свидания!');
      expect(response.response.end_session).toBe(true);
    });

    it('should handle restart', () => {
      const response = controller.restart();
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Привет!');
    });
  });

  describe('Answer handling', () => {
    const mockSessionData = {
      currentQuestion: 1,
      answers: [],
      state: 'testing' as const
    };

    // Правильная структура данных для Яндекс.Диалогов
    const mockAliceData = {
      state: {
        session: {
          data: mockSessionData
        }
      }
    };

    it('should handle yes answer', () => {
      const response = controller.answerYes(mockAliceData.state.session.data);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Вопрос 2 из 24');
    });

    it('should handle no answer', () => {
      const response = controller.answerNo(mockAliceData.state.session.data);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Вопрос 2 из 24');
    });

    it('should handle unsure answer', () => {
      const response = controller.answerUnsure(mockAliceData.state.session.data);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Вопрос 2 из 24');
    });

    it('should handle repeat question', () => {
      const response = controller.repeatQuestion(mockSessionData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Вопрос 1 из 24');
    });
  });

  describe('Test completion', () => {
    const mockSessionDataLastQuestion = {
      currentQuestion: 24,
      answers: Array.from({ length: 23 }, (_, i) => ({
        questionId: i + 1,
        score: 1
      })),
      state: 'testing' as const
    };

    // Правильная структура данных для Яндекс.Диалогов
    const mockAliceDataLastQuestion = {
      state: {
        session: {
          data: mockSessionDataLastQuestion
        }
      }
    };

    it('should show results after last question', () => {
      const response = controller.answerYes(mockAliceDataLastQuestion.state.session.data);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Спасибо за ответы!');
      expect(response.response.text).toContain('ТОП-3 уровня ценностей');
    });
  });

  describe('Results navigation', () => {
    const mockResultsData = {
      results: {
        top3: [{
          level: 'yellow' as any,
          name: 'Интегральный',
          fullName: 'Интегральный (Желтый)',
          score: 6,
          interpretation: 'Доминирующий уровень'
        }],
        allScores: {} as any
      },
      state: 'results' as const
    };

    it('should handle describe level', () => {
      const response = controller.describeLevel(mockResultsData);

      expect(response).toBeDefined();
      expect(response.response.text).toContain('Подробнее о вашем доминирующем уровне');
    });

    it('should handle repeat results', () => {
      const response = controller.repeatResults(mockResultsData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('ТОП-3 уровня ценностей');
    });

      // it('should handle send results', () => {
  //   const response = controller.sendResults(mockResultsData);
  //   
  //   expect(response).toBeDefined();
  //   expect(response.response.text).toContain('функция отправки пока не реализована');
  // });
  });

  describe('Pause functionality', () => {
    const mockPausedData = {
      currentQuestion: 10,
      answers: Array.from({ length: 9 }, (_, i) => ({
        questionId: i + 1,
        score: 1
      })),
      state: 'testing' as const
    };

    it('should handle pause', () => {
      const response = controller.pauseTest(mockPausedData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Тест приостановлен');
      expect(response.response.text).toContain('вопросе 10 из 24');
    });

    it('should handle continue after pause', () => {
      const pausedSessionData = {
        ...mockPausedData,
        state: 'paused' as const
      };
      
      const response = controller.continueTest(pausedSessionData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Продолжаем!');
      expect(response.response.text).toContain('Вопрос 10 из 24');
    });
  });

  describe('Error handling', () => {
    const mockTestingData = {
      currentQuestion: 5,
      answers: [],
      state: 'testing' as const
    };

    it('should handle error during testing', () => {
      const response = controller.handleError(mockTestingData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Извини, не поняла ответ');
      expect(response.response.text).toContain('ДА, НЕТ или НЕ УВЕРЕН');
    });

    it('should handle error in other states', () => {
      const response = controller.handleError({ state: 'welcome' as const });
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Извини, не поняла');
    });
  });

  describe('Unknown command handling', () => {
    it('should handle unknown command in welcome state', () => {
      const mockUnknownData = {
        request: {
          command: 'блаблабла',
          original_utterance: 'блаблабла'
        },
        session: {},
        state: 'welcome' as const
      };
      
      const response = controller.defaultHandler(mockUnknownData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Не понял команду "блаблабла"');
      expect(response.response.text).toContain('начать тест');
      expect(response.response.buttons).toBeDefined();
      expect(response.response.buttons?.some(btn => btn.title === 'О навыке')).toBe(true);
    });

    it('should handle unknown command in testing state', () => {
      const mockUnknownData = {
        request: {
          command: 'nonsense',
          original_utterance: 'nonsense'
        },
        session: {},
        currentQuestion: 5,
        answers: [],
        state: 'testing' as const
      };
      
      const response = controller.defaultHandler(mockUnknownData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Не понял ответ "nonsense"');
      expect(response.response.text).toContain('ДА, НЕТ или НЕ УВЕРЕН');
      expect(response.response.text).toContain('Вопрос 5 из 24');
      expect(response.response.buttons?.some(btn => btn.title === 'Да')).toBe(true);
    });

    it('should handle unknown command in results state', () => {
      const mockUnknownData = {
        request: {
          command: 'xyz',
          original_utterance: 'xyz'  
        },
        session: {},
        results: { top3: [], allScores: {} },
        state: 'results' as const
      };
      
      const response = controller.defaultHandler(mockUnknownData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Не понял команду "xyz"');
      expect(response.response.text).toContain('Подробнее');
      expect(response.response.buttons?.some(btn => btn.title === 'Подробнее')).toBe(true);
    });

    it('should handle unknown command in paused state', () => {
      const mockUnknownData = {
        request: {
          command: 'random',
          original_utterance: 'random'
        },
        session: {},
        currentQuestion: 10,
        answers: [],
        state: 'paused' as const
      };
      
      const response = controller.defaultHandler(mockUnknownData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Не понял команду "random"');
      expect(response.response.text).toContain('Тест на паузе');
      expect(response.response.buttons?.some(btn => btn.title === 'Продолжить')).toBe(true);
    });

    it('should handle "пон" command in welcome state', () => {
      const mockPonData = {
        request: {
          command: 'пон',
          original_utterance: 'пон'
        },
        session: {},
        state: 'welcome' as const
      };
      
      const response = controller.defaultHandler(mockPonData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Не понял команду "пон"');
      expect(response.response.text).toContain('начать тест');
      expect(response.response.buttons).toBeDefined();
      expect(response.response.buttons?.length).toBeGreaterThan(0);
    });

    it('should handle "пон" in Yandex Dialogs format', () => {
      const mockYandexData = {
        meta: {
          locale: "ru-RU",
          timezone: "UTC",
          client_id: "test"
        },
        session: {
          message_id: 1,
          session_id: "test-session",
          skill_id: "test-skill",
          user: { user_id: "test-user" },
          new: false
        },
        request: {
          command: 'пон',
          original_utterance: 'пон',
          nlu: {
            tokens: ['пон'],
            entities: [],
            intents: {}
          },
          type: "SimpleUtterance"
        },
        state: {
          session: {
            data: {
              state: 'welcome'
            }
          }
        },
        version: "1.0"
      };
      
      const response = controller.defaultHandler(mockYandexData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Не понял команду "пон"');
      expect(response.response.text).toContain('начать тест');
    });
  });

  describe('Unknown commands via intent', () => {
    it('should handle "пон" via unknown intent in welcome state', () => {
      const mockUnknownData = {
        request: {
          command: 'пон',
          original_utterance: 'пон'
        },
        session: {},
        state: 'welcome' as const
      };
      
      const response = controller.handleUnknownIntent(mockUnknownData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Готов узнать свои ценности');
      expect(response.response.text).toContain('начать тест');
      expect(response.response.buttons?.some(btn => btn.title === 'Начать тест')).toBe(true);
    });

    it('should handle unknown command during testing', () => {
      const mockUnknownData = {
        request: {
          command: 'блабла',
          original_utterance: 'блабла'
        },
        session: {},
        currentQuestion: 5,
        answers: [],
        state: 'testing' as const
      };
      
      const response = controller.handleUnknownIntent(mockUnknownData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Отвечай на вопрос: ДА, НЕТ или НЕ УВЕРЕН');
      expect(response.response.text).toContain('Вопрос 5 из 24');
    });

    it('should handle unknown command in results state', () => {
      const mockUnknownData = {
        request: {
          command: 'хрень',
          original_utterance: 'хрень'
        },
        session: {},
        results: { top3: [], allScores: {} },
        state: 'results' as const
      };
      
      const response = controller.handleUnknownIntent(mockUnknownData);
      
      expect(response).toBeDefined();
      expect(response.response.text).toContain('Выбери что хочешь');
      expect(response.response.buttons?.some(btn => btn.title === 'Подробнее')).toBe(true);
    });
  });
});
