# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Set Up Redis

### Option A: Redis Cloud (Easiest - Free)

1. Go to https://redis.com/try-free/
2. Sign up for free account
3. Create a new database
4. Copy the connection URL (looks like: `redis://default:password@host:port`)
5. Save it for Step 3

### Option B: Local Redis

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows:**
Download from https://redis.io/download

## Step 3: Create .env File

Create a file named `.env` in the `backend` folder:

```env
PORT=3000
TAVILY_API_KEY=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
REDIS_URL=redis://localhost:6379
```

**For Redis Cloud:** Replace `REDIS_URL` with the connection URL you copied in Step 2.

## Step 4: Start the Server

```bash
npm start
```

You should see:
```
Connected to Redis
Redis connection established
Server running on port 3000
Health check: http://localhost:3000/health
```

## Step 5: Test It

Open a new terminal and test:

```bash
curl http://localhost:3000/health
```

You should get:
```json
{"status":"ok","redis":"connected","timestamp":"..."}
```

## Step 6: Update Extension

The extension is already configured to use `http://localhost:3000` by default.

Just reload the extension in Chrome and test the info buttons!

## Troubleshooting

**"Cannot connect to Redis":**
- Make sure Redis is running: `redis-cli ping` (should return "PONG")
- Check your REDIS_URL in .env file

**"Cannot connect to backend":**
- Make sure server is running: `npm start`
- Check the port matches (default: 3000)
- Try: `curl http://localhost:3000/health`

**Extension shows error:**
- Make sure backend is running
- Check browser console for errors
- Verify backend URL in extension's background.js

