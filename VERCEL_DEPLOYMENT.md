# Vercel Serverless Deployment Guide

## 🚀 Quick Setup

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy Backend
```bash
cd backend
vercel
```

## 📁 Project Structure
```
backend/
├── api/
│   ├── index.js          # Main serverless entry point
│   ├── auth.js           # Authentication routes
│   ├── entries.js        # Entry management routes
│   ├── ai.js            # AI processing routes
│   ├── reminders.js     # Reminder management routes
│   └── voiceAnalysis.js # Voice analysis routes
├── utils/
│   └── database.js      # Optimized DB connection for serverless
├── models/              # MongoDB models
├── middleware/          # Express middleware
├── controllers/         # Business logic
├── services/           # External services
└── package.json        # Dependencies
```

## 🔧 Environment Variables

Set these in your Vercel dashboard:

### Required Variables
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/recall-ai
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Optional Variables
```
GOOGLE_AI_API_KEY=your-google-ai-api-key
GOOGLE_APPLICATION_CREDENTIALS=base64-encoded-service-account-key
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_EMAIL=mailto:your-email@example.com
NODE_ENV=production
```

## 🚀 Deployment Steps

### 1. Prepare Backend
```bash
cd backend
npm install
```

### 2. Deploy to Vercel
```bash
vercel --prod
```

### 3. Set Environment Variables
```bash
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add FRONTEND_URL
# Add other variables as needed
```

### 4. Redeploy with Environment Variables
```bash
vercel --prod
```

## 🔗 API Endpoints

Your API will be available at:
```
https://your-project-name.vercel.app/api/
```

### Available Routes
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/entries` - Get user entries
- `POST /api/entries` - Create new entry
- `POST /api/ai/transcribe` - Transcribe audio
- `POST /api/ai/emotion` - Detect emotion
- `GET /api/reminders` - Get user reminders
- `POST /api/reminders` - Create reminder
- `POST /api/voice/analyze-reminders` - Analyze voice for reminders

## 🛠️ Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/api/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "backend/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

## 🔍 Testing Deployment

### 1. Health Check
```bash
curl https://your-project-name.vercel.app/api/health
```

### 2. Test Registration
```bash
curl -X POST https://your-project-name.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "consentGiven": true
  }'
```

## 🚨 Important Notes

### Database Connection
- Uses connection pooling for serverless
- Connections are cached between function invocations
- Optimized for cold starts

### File Uploads
- Multer configured for memory storage
- 10MB file size limit
- Audio files only

### Rate Limiting
- 100 requests per 15 minutes per IP
- Applied to all routes

### CORS
- Configured for your frontend domain
- Credentials enabled

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Timeout**
   - Check MONGO_URI format
   - Ensure MongoDB Atlas allows your IP
   - Verify connection string includes retryWrites=true

2. **Function Timeout**
   - Increase maxDuration in vercel.json
   - Optimize database queries
   - Use connection pooling

3. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Redeploy after adding variables

4. **CORS Issues**
   - Update FRONTEND_URL in environment
   - Check CORS configuration in api/index.js

### Debug Commands
```bash
# View deployment logs
vercel logs

# Check function status
vercel functions list

# View environment variables
vercel env ls
```

## 📊 Monitoring

### Vercel Dashboard
- View function invocations
- Monitor response times
- Check error rates
- View logs

### Database Monitoring
- MongoDB Atlas dashboard
- Connection metrics
- Query performance

## 🔄 Updates

### Redeploy After Changes
```bash
vercel --prod
```

### Update Environment Variables
```bash
vercel env add VARIABLE_NAME
vercel --prod
```

## 🎯 Next Steps

1. Deploy frontend to Vercel
2. Update frontend API URLs
3. Configure custom domain
4. Set up monitoring
5. Configure CI/CD pipeline

Your backend is now ready for serverless deployment on Vercel! 🚀
