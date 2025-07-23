import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Alice Skill E2E Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const createAliceRequest = (intent: string, command: string, sessionData: any = {}) => ({
    meta: {
      locale: 'ru-RU',
      timezone: 'UTC',
      client_id: 'test-client',
      interfaces: { screen: {}, payments: {}, account_linking: {} }
    },
    session: {
      message_id: 1,
      session_id: 'test-session',
      skill_id: 'test-skill',
      user: { user_id: 'test-user' },
      application: { application_id: 'test-app' },
      user_id: 'test-user',
      new: false
    },
    request: {
      command,
      original_utterance: command,
      nlu: {
        tokens: command.split(' '),
        entities: [],
        intents: { [intent]: { slots: {} } }
      },
      markup: { dangerous_context: false },
      type: 'SimpleUtterance'
    },
    state: {
      session: { data: sessionData },
      user: {},
      application: {}
    },
    version: '1.0'
  });

  describe('Welcome Flow', () => {
    it('should handle initial request', () => {
      const aliceRequest = createAliceRequest('', 'привет');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('Привет! Я помогу тебе определить');
          expect(res.body.response.text).toContain('Готов начать?');
          expect(res.body.response.end_session).toBe(false);
          expect(res.body.response.buttons).toHaveLength(3);
        });
    });

    it('should handle help request', () => {
      const aliceRequest = createAliceRequest('YANDEX.HELP', 'помощь');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('Тест покажет, какие ценности сейчас важнее для тебя');
          expect(res.body.response.text).toContain('выживание, традиции, власть, порядок, успех, гармония, гибкость или глобальное мышление');
        });
    });

    it('should handle agreement to start', () => {
      const aliceRequest = createAliceRequest('spiral.yes', 'да');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('Отлично! Начнём!');
          expect(res.body.response.text).toContain('Вопрос 1 из 24:');
          expect(res.body.session_state.data.currentQuestion).toBe(1);
          expect(res.body.session_state.data.state).toBe('testing');
        });
    });

    it('should handle refusal', () => {
      const aliceRequest = createAliceRequest('spiral.no', 'нет');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toBe('Всегда рада помочь. Обращайтесь!');
          expect(res.body.response.end_session).toBe(true);
        });
    });
  });

  describe('Testing Flow', () => {
    it('should handle yes answer', () => {
      const sessionData = {
        currentQuestion: 1,
        answers: [],
        state: 'testing'
      };
      const aliceRequest = createAliceRequest('spiral.answer.yes', 'да', sessionData);
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('Вопрос 2 из 24:');
          expect(res.body.session_state.data.currentQuestion).toBe(2);
          expect(res.body.session_state.data.answers).toHaveLength(1);
          expect(res.body.session_state.data.answers[0].score).toBe(2);
        });
    });

    it('should handle no answer', () => {
      const sessionData = {
        currentQuestion: 1,
        answers: [],
        state: 'testing'
      };
      const aliceRequest = createAliceRequest('spiral.answer.no', 'нет', sessionData);
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.session_state.data.answers[0].score).toBe(0);
        });
    });

    it('should handle unsure answer', () => {
      const sessionData = {
        currentQuestion: 1,
        answers: [],
        state: 'testing'
      };
      const aliceRequest = createAliceRequest('spiral.answer.unsure', 'не уверен', sessionData);
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.session_state.data.answers[0].score).toBe(1);
        });
    });

    it('should handle repeat question', () => {
      const sessionData = {
        currentQuestion: 5,
        answers: [],
        state: 'testing'
      };
      const aliceRequest = createAliceRequest('spiral.repeat', 'повтори', sessionData);
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('Вопрос 5 из 24:');
          expect(res.body.session_state.data.currentQuestion).toBe(5);
        });
    });

    it('should handle pause', () => {
      const sessionData = {
        currentQuestion: 10,
        answers: Array.from({ length: 9 }, (_, i) => ({ questionId: i + 1, score: 1 })),
        state: 'testing'
      };
      const aliceRequest = createAliceRequest('spiral.pause', 'пауза', sessionData);
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('Тест приостановлен на вопросе 10 из 24');
          expect(res.body.session_state.data.state).toBe('paused');
        });
    });

    it('should handle continue after pause', () => {
      const sessionData = {
        currentQuestion: 10,
        answers: Array.from({ length: 9 }, (_, i) => ({ questionId: i + 1, score: 1 })),
        state: 'paused'
      };
      const aliceRequest = createAliceRequest('spiral.continue', 'продолжить', sessionData);
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('Продолжаем! Вопрос 10 из 24:');
          expect(res.body.session_state.data.state).toBe('testing');
        });
    });
  });

  describe('Results Flow', () => {
    it('should show results after 24th question', () => {
      const sessionData = {
        currentQuestion: 24,
        answers: Array.from({ length: 23 }, (_, i) => ({ questionId: i + 1, score: 1 })),
        state: 'testing'
      };
      const aliceRequest = createAliceRequest('spiral.answer.yes', 'да', sessionData);
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('Спасибо за ответы! Считаю твои результаты...');
          expect(res.body.response.text).toContain('Твои ТОП-3 уровня ценностей сейчас:');
          expect(res.body.session_state.data.state).toBe('results');
          expect(res.body.session_state.data.results).toBeDefined();
        });
    });

    it('should handle repeat results', () => {
      const sessionData = {
        results: {
          top3: [{
            level: 'yellow',
            name: 'Гибкость и Системы',
            fullName: 'Гибкость и Системы (Желтый)',
            score: 6,
            interpretation: 'Доминирующий уровень'
          }],
          allScores: {}
        },
        state: 'results'
      };
      const aliceRequest = createAliceRequest('spiral.repeat_results', 'повтори результаты', sessionData);
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('Твои ТОП-3 уровня ценностей сейчас:');
        });
    });

    it('should handle describe level', () => {
      const sessionData = {
        results: {
          top3: [{
            level: 'yellow',
            name: 'Гибкость и Системы',
            fullName: 'Гибкость и Системы (Желтый)',
            score: 6,
            interpretation: 'Доминирующий уровень'
          }],
          allScores: {}
        },
        state: 'results'
      };
      const aliceRequest = createAliceRequest('spiral.describe', 'опиши желтый', sessionData);
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('Гибкость и Системы (yellow):');
          expect(res.body.response.text).toContain('Гибкость систем: адаптивность');
        });
    });

    it('should handle send results', () => {
      const sessionData = { state: 'results' };
      const aliceRequest = createAliceRequest('spiral.send', 'отправить', sessionData);
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('функция отправки пока не реализована');
        });
    });

    it('should handle restart', () => {
      const aliceRequest = createAliceRequest('spiral.restart', 'заново');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('Привет! Я помогу тебе определить');
          expect(res.body.session_state.data.state).toBe('welcome');
        });
    });

    it('should handle exit', () => {
      const aliceRequest = createAliceRequest('spiral.exit', 'выход');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('До свидания!');
          expect(res.body.response.end_session).toBe(true);
        });
    });
  });

  describe('Error Handling', () => {
    it('should handle error during testing', () => {
      const sessionData = {
        currentQuestion: 5,
        answers: [],
        state: 'testing'
      };
      const aliceRequest = createAliceRequest('spiral.error', 'что', sessionData);
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toContain('Извини, не поняла ответ');
          expect(res.body.response.text).toContain('Скажи ДА, НЕТ или НЕ УВЕРЕН');
        });
    });

    it('should handle invalid requests gracefully', () => {
      const invalidRequest = { invalid: 'request' };
      
      return request(app.getHttpServer())
        .post('/')
        .send(invalidRequest)
        .expect(400);
    });
  });
});
