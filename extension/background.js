// Background Service Worker for Food Info API Integration
// Uses backend server with Redis caching

// Backend API URL - Change this to your deployed backend URL
// For local development: http://localhost:3000
// For production: https://your-backend-url.com
const BACKEND_URL = 'http://localhost:3000';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getFoodInfo') {
    handleFoodInfoRequest(request.foodName, request.country)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates we will send a response asynchronously
  }
  
  if (request.action === 'setBackendUrl') {
    chrome.storage.local.set({ backendUrl: request.url })
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function handleFoodInfoRequest(foodName, country) {
  // Get backend URL from storage or use default
  const config = await chrome.storage.local.get('backendUrl');
  const backendUrl = config.backendUrl || BACKEND_URL;
  
  try {
    // Call backend API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`${backendUrl}/api/food-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        foodName: foodName,
        country: country
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Backend API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch food information');
    }
    
    console.log(`Food info fetched for ${foodName} in ${country} (cached: ${result.cached})`);
    return result.data;
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your backend server is running.');
    }
    
    console.error('Error fetching food info from backend:', error);
    
    // If backend fails, provide helpful error message
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to backend server at ${backendUrl}. Make sure the server is running.`);
    }
    
    throw error;
  }
}

