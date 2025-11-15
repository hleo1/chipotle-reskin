import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Redis client
let redisClient = null;

async function initRedis() {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = createClient({ url: redisUrl });
    
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
    
    redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });
    
    await redisClient.connect();
    console.log('Redis connection established');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    console.log('Continuing without Redis cache (will use Tavily directly)');
  }
}

// Initialize Redis on startup
initRedis();

// Helper function to generate unique cache key
// Ensures each country+food combination has a unique key
// Example: "White Rice" in "italian" -> "food-italian-white-rice"
//          "White Rice" in "mongolian" -> "food-mongolian-white-rice"
function getCacheKey(foodName, country) {
  // Normalize food name: lowercase, replace spaces with hyphens, remove special chars
  const normalizedName = foodName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')     // Remove special characters
    .replace(/-+/g, '-')            // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');         // Remove leading/trailing hyphens
  
  // Normalize country: lowercase, remove special chars
  const normalizedCountry = country
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')     // Remove special characters
    .replace(/-+/g, '-')            // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');         // Remove leading/trailing hyphens
  
  // Combine: food-{country}-{foodName}
  // This ensures uniqueness: same food in different countries = different keys
  const cacheKey = `food-${normalizedCountry}-${normalizedName}`;
  
  // Validate key is not empty
  if (!normalizedCountry || !normalizedName) {
    throw new Error(`Invalid cache key generation: country="${country}", foodName="${foodName}"`);
  }
  
  return cacheKey;
}

// Helper function to query Tavily API
async function queryTavily(query, apiKey) {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: query,
      search_depth: 'advanced',
      include_answer: true,
      include_images: false,
      max_results: 5
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Tavily API error: ${response.status}`);
  }

  return await response.json();
}

// Main API endpoint - All data is cached in Redis
app.post('/api/food-info', async (req, res) => {
  try {
    const { foodName, country } = req.body;

    if (!foodName || !country) {
      return res.status(400).json({
        success: false,
        error: 'foodName and country are required'
      });
    }

    // Generate unique cache key that includes both country and food name
    // This ensures "White Rice" in Italian and "White Rice" in Mongolian are cached separately
    const cacheKey = getCacheKey(foodName, country);
    console.log(`🔑 Cache key generated: ${cacheKey} (food: "${foodName}", country: "${country}")`);
    
    const tavilyApiKey = process.env.TAVILY_API_KEY || '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';

    // ALWAYS check Redis cache first - this is the primary data source
    if (redisClient && redisClient.isOpen) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          const cachedData = JSON.parse(cached);
          console.log(`✅ Cache HIT for ${foodName} in ${country} - returning from Redis`);
          
          // Update timestamp to show when it was retrieved from cache
          cachedData.retrievedAt = Date.now();
          
          return res.json({
            success: true,
            data: cachedData,
            cached: true,
            source: 'redis'
          });
        }
      } catch (redisError) {
        console.error('❌ Redis read error:', redisError);
        // If Redis fails, we'll still try Tavily as fallback
      }
    } else {
      console.warn('⚠️ Redis not connected - will fetch from Tavily (no caching)');
    }

    // Cache miss - fetch from Tavily and store in Redis
    console.log(`❌ Cache MISS for ${foodName} in ${country} - fetching from Tavily and caching in Redis`);
    
    try {
      // Make two parallel queries to Tavily
      const [generalInfo, culturalInfo] = await Promise.all([
        queryTavily(`What are ${foodName}?`, tavilyApiKey),
        queryTavily(`How is ${foodName} prepared in ${country}?`, tavilyApiKey)
      ]);

      const result = {
        foodName,
        country,
        general: {
          answer: generalInfo.answer || 'Information not available.',
          sources: generalInfo.results?.slice(0, 3) || []
        },
        cultural: {
          answer: culturalInfo.answer || `Information about ${foodName} in ${country} cuisine is not available.`,
          sources: culturalInfo.results?.slice(0, 3) || []
        },
        timestamp: Date.now(),
        cachedAt: Date.now()
      };

      // ALWAYS store in Redis cache (30 days TTL = 2,592,000 seconds)
      const cacheTTL = 30 * 24 * 60 * 60; // 30 days
      
      if (redisClient && redisClient.isOpen) {
        try {
          await redisClient.setEx(cacheKey, cacheTTL, JSON.stringify(result));
          console.log(`💾 Cached result for ${foodName} in ${country} in Redis (TTL: 30 days)`);
        } catch (redisError) {
          console.error('❌ Redis write error (data still returned, but not cached):', redisError);
          // Continue even if cache write fails - at least return the data
        }
      } else {
        console.warn('⚠️ Redis not available - data fetched but NOT cached');
      }

      return res.json({
        success: true,
        data: result,
        cached: false,
        source: 'tavily'
      });
    } catch (tavilyError) {
      console.error('❌ Tavily API error:', tavilyError);
      
      // If Tavily fails, check if we have stale cache as last resort
      if (redisClient && redisClient.isOpen) {
        try {
          const staleCache = await redisClient.get(cacheKey);
          if (staleCache) {
            console.log(`⚠️ Using stale cache for ${foodName} in ${country} (Tavily failed)`);
            const staleData = JSON.parse(staleCache);
            staleData.stale = true;
            return res.json({
              success: true,
              data: staleData,
              cached: true,
              source: 'redis-stale',
              warning: 'Tavily API unavailable, returning cached data'
            });
          }
        } catch (redisError) {
          // Ignore Redis errors here since we're already in error state
        }
      }
      
      return res.status(500).json({
        success: false,
        error: tavilyError.message || 'Failed to fetch information from Tavily API'
      });
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Root endpoint - show available routes
app.get('/', (req, res) => {
  res.json({
    message: 'Chipotle Food Info API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      foodInfo: 'POST /api/food-info',
      cacheStats: 'GET /api/cache/stats'
    },
    example: {
      url: 'POST /api/food-info',
      body: {
        foodName: 'Jerk Chicken',
        country: 'jamaican'
      }
    }
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const redisStatus = redisClient && redisClient.isOpen ? 'connected' : 'disconnected';
  
  // Get cache statistics if Redis is connected
  let cacheStats = null;
  if (redisClient && redisClient.isOpen) {
    try {
      const info = await redisClient.info('stats');
      const keyspace = await redisClient.info('keyspace');
      cacheStats = {
        info: info.split('\n').filter(line => line && !line.startsWith('#')),
        keyspace: keyspace.split('\n').filter(line => line && !line.startsWith('#'))
      };
    } catch (error) {
      // Ignore stats errors
    }
  }
  
  res.json({
    status: 'ok',
    redis: redisStatus,
    caching: redisStatus === 'connected' ? 'enabled' : 'disabled',
    timestamp: new Date().toISOString(),
    stats: cacheStats
  });
});

// Cache statistics endpoint
app.get('/api/cache/stats', async (req, res) => {
  if (!redisClient || !redisClient.isOpen) {
    return res.json({
      success: false,
      error: 'Redis not connected'
    });
  }
  
  try {
    // Get all cache keys
    const keys = await redisClient.keys('food-*');
    const stats = {
      totalCachedItems: keys.length,
      keys: keys.slice(0, 100) // Limit to first 100 for display
    };
    
    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing Redis connection...');
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
  process.exit(0);
});

