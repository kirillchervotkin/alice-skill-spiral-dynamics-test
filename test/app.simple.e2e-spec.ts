import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Alice Skill Simple E2E Tests', () => {
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

  const createSimpleAliceRequest = (command: string) => ({
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
        intents: {}
      },
      markup: { dangerous_context: false },
      type: 'SimpleUtterance'
    },
    state: {
      session: { data: {} },
      user: {},
      application: {}
    },
    version: '1.0'
  });

  describe('Basic HTTP Tests', () => {
    it('should handle initial request', () => {
      const aliceRequest = createSimpleAliceRequest('привет');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.response).toBeDefined();
          expect(res.body.response.text).toContain('Привет!');
          expect(res.body.response.text).toContain('Спиральной динамики');
        });
    });

    it('should return valid Alice response structure', () => {
      const aliceRequest = createSimpleAliceRequest('тест');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          // Проверяем структуру ответа Алисы
          expect(res.body.response).toBeDefined();
          expect(res.body.response.text).toBeDefined();
          expect(typeof res.body.response.text).toBe('string');
          expect(typeof res.body.response.end_session).toBe('boolean');
          expect(res.body.session_state).toBeDefined();
          expect(res.body.version).toBe('1.0');
        });
    });

    it('should handle empty request gracefully', () => {
      const aliceRequest = createSimpleAliceRequest('');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toBeDefined();
          expect(res.body.response.text.length).toBeGreaterThan(0);
        });
    });

    it('should handle unknown command', () => {
      const aliceRequest = createSimpleAliceRequest('неизвестная команда');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.text).toBeDefined();
          // Должен вернуть приветствие или помощь
          expect(res.body.response.text).toMatch(/Привет|помощь|Спиральной динамики/i);
        });
    });
  });

  describe('Content Validation', () => {
    it('should return Russian text', () => {
      const aliceRequest = createSimpleAliceRequest('начать');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          const text = res.body.response.text;
          expect(text).toMatch(/[а-яё]/i); // содержит русские буквы
          expect(text.length).toBeGreaterThan(10);
        });
    });

    it('should have buttons in response', () => {
      const aliceRequest = createSimpleAliceRequest('помощь');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.buttons).toBeDefined();
          expect(Array.isArray(res.body.response.buttons)).toBe(true);
          expect(res.body.response.buttons.length).toBeGreaterThan(0);
        });
    });

    it('should not end session on welcome', () => {
      const aliceRequest = createSimpleAliceRequest('привет');
      
      return request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200)
        .expect(res => {
          expect(res.body.response.end_session).toBe(false);
        });
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed request', () => {
      const malformedRequest = { invalid: 'request' };
      
      return request(app.getHttpServer())
        .post('/')
        .send(malformedRequest)
        .expect(400);
    });

    it('should handle missing fields gracefully', () => {
      const incompleteRequest = {
        ...createSimpleAliceRequest('тест'),
        request: undefined
      };
      
      return request(app.getHttpServer())
        .post('/')
        .send(incompleteRequest)
        .expect(400);
    });
  });

  describe('Performance', () => {
    it('should respond quickly', async () => {
      const aliceRequest = createSimpleAliceRequest('быстрый тест');
      const startTime = Date.now();
      
      await request(app.getHttpServer())
        .post('/')
        .send(aliceRequest)
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // менее 1 секунды
    });
  });
});
