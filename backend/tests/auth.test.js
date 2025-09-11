const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Entry = require('../models/Entry');

describe('Authentication Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Entry.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        consentGiven: true
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should not register user without consent', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        consentGiven: false
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });

    it('should not register duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        consentGiven: true
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        consentGiven: true
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should not login with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});

describe('Entry Routes', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Entry.deleteMany({});

    // Create a test user and get auth token
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      consentGiven: true
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  describe('POST /api/entries', () => {
    it('should create a new entry with valid data', async () => {
      const entryData = {
        text: 'This is a test journal entry',
        tags: ['test', 'example']
      };

      const response = await request(app)
        .post('/api/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(entryData)
        .expect(201);

      expect(response.body.message).toBe('Entry created successfully');
      expect(response.body.entry.text).toBe(entryData.text);
      expect(response.body.entry.tags).toEqual(entryData.tags);
    });

    it('should not create entry without text', async () => {
      const entryData = {
        tags: ['test']
      };

      const response = await request(app)
        .post('/api/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(entryData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });

    it('should not create entry without authentication', async () => {
      const entryData = {
        text: 'This is a test journal entry'
      };

      const response = await request(app)
        .post('/api/entries')
        .send(entryData)
        .expect(401);

      expect(response.body.message).toBe('No token provided, authorization denied');
    });
  });

  describe('GET /api/entries', () => {
    beforeEach(async () => {
      // Create test entries
      const entries = [
        { userId, text: 'First entry', tags: ['test'] },
        { userId, text: 'Second entry', tags: ['example'] },
        { userId, text: 'Third entry', tags: ['test', 'example'] }
      ];

      for (const entry of entries) {
        await new Entry(entry).save();
      }
    });

    it('should get all entries for authenticated user', async () => {
      const response = await request(app)
        .get('/api/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.entries).toHaveLength(3);
      expect(response.body.pagination.total).toBe(3);
    });

    it('should filter entries by mood', async () => {
      // Update one entry with specific mood
      await Entry.findOneAndUpdate(
        { userId },
        { mood: 'happy' }
      );

      const response = await request(app)
        .get('/api/entries?mood=happy')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.entries).toHaveLength(1);
      expect(response.body.entries[0].mood).toBe('happy');
    });

    it('should paginate entries', async () => {
      const response = await request(app)
        .get('/api/entries?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.entries).toHaveLength(2);
      expect(response.body.pagination.current).toBe(1);
      expect(response.body.pagination.pages).toBe(2);
    });
  });
});

describe('AI Routes', () => {
  let authToken;

  beforeEach(async () => {
    await User.deleteMany({});

    const userData = {
      email: 'test@example.com',
      password: 'password123',
      consentGiven: true
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    authToken = registerResponse.body.token;
  });

  describe('POST /api/ai/emotion', () => {
    it('should detect emotion in text', async () => {
      const emotionData = {
        text: 'I am so happy today! This is amazing!'
      };

      const response = await request(app)
        .post('/api/ai/emotion')
        .set('Authorization', `Bearer ${authToken}`)
        .send(emotionData)
        .expect(200);

      expect(response.body.emotion).toBeDefined();
      expect(response.body.emotion.mood).toBeDefined();
      expect(response.body.emotion.score).toBeDefined();
    });

    it('should not process emotion without text', async () => {
      const response = await request(app)
        .post('/api/ai/emotion')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('POST /api/ai/summarize', () => {
    it('should generate summary for text', async () => {
      const summaryData = {
        text: 'Today I went to work. I had a meeting with my team. We discussed the new project. After work, I went to the gym and had dinner with friends.',
        type: 'daily'
      };

      const response = await request(app)
        .post('/api/ai/summarize')
        .set('Authorization', `Bearer ${authToken}`)
        .send(summaryData)
        .expect(200);

      expect(response.body.summary).toBeDefined();
      expect(response.body.type).toBe('daily');
    });
  });
});
