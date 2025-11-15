# Chipotle Food Info Backend

Backend API server with Redis caching for food information queries.

## Features

- ✅ Redis caching to reduce Tavily API calls
- ✅ Automatic cache expiration (30 days)
- ✅ Graceful fallback if Redis is unavailable
- ✅ Health check endpoint
- ✅ Error handling and logging

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Redis

**Option A: Redis Cloud (Recommended - Free Tier)**
1. Sign up at https://redis.com/try-free/
2. Create a free database
3. Copy the connection URL
4. Add to `.env` file

**Option B: Local Redis**
```bash
# macOS
brew install redis
brew services start redis

# The default URL will work: redis://localhost:6379
```

**Option C: Upstash (Free Tier)**
1. Sign up at https://upstash.com/
2. Create a Redis database
3. Copy the connection URL
4. Add to `.env` file

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your Redis URL:

```env
REDIS_URL=redis://default:your-password@your-host:port
TAVILY_API_KEY=your-tavily-api-key
PORT=3000
```

### 4. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### POST `/api/food-info`

Get food information with caching.

**Request:**
```json
{
  "foodName": "Beef Stracotto",
  "country": "italian"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "foodName": "Beef Stracotto",
    "country": "italian",
    "general": {
      "answer": "...",
      "sources": [...]
    },
    "cultural": {
      "answer": "...",
      "sources": [...]
    },
    "timestamp": 1234567890
  },
  "cached": true
}
```

### GET `/health`

Check server and Redis status.

**Response:**
```json
{
  "status": "ok",
  "redis": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Deployment

### Railway (Recommended)

1. Push code to GitHub
2. Connect Railway to your repo
3. Add environment variables in Railway dashboard
4. Deploy!

### Render

1. Create new Web Service
2. Connect your GitHub repo
3. Add environment variables
4. Deploy!

### Other Platforms

Any Node.js hosting platform works:
- Heroku
- Fly.io
- AWS Elastic Beanstalk
- Google Cloud Run

## How Caching Works

1. **First Request**: User asks about "Beef Stracotto"
   - Cache miss → Call Tavily API
   - Store result in Redis (30 day TTL)
   - Return to user

2. **Subsequent Requests**: Other users ask about "Beef Stracotto"
   - Cache hit → Return from Redis (no API call!)
   - Much faster and free

3. **After 30 Days**: Cache expires
   - Next request fetches fresh data from Tavily
   - Updates cache

## Error Handling

- If Redis is unavailable, the server continues to work (calls Tavily directly)
- If Tavily API fails, returns error to client
- All errors are logged to console

## Monitoring

Check server health:
```bash
curl http://localhost:3000/health
```

