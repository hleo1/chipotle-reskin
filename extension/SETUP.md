# Quick Setup Guide

## 1. Load the Extension

### Chrome/Edge/Brave:
1. Go to `chrome://extensions/` (or `edge://extensions/` for Edge)
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `extension` folder

### Firefox:
1. Go to `about:debugging`
2. Click "This Firefox" → "Load Temporary Add-on"
3. Select `extension/manifest.json`

## 2. Set Tavily API Key

1. Get API key from https://tavily.com
2. Open browser console (F12) on Chipotle.com
3. Run:
```javascript
chrome.runtime.sendMessage({
  action: 'setTavilyApiKey',
  apiKey: 'YOUR_TAVILY_API_KEY_HERE'
}, (response) => {
  console.log('API key set:', response.success ? 'Success' : 'Failed');
});
```

## 3. Test It!

1. Go to https://www.chipotle.com/order/build/burrito-bowl
2. You should see custom food cards with ℹ️ buttons
3. Click any ℹ️ button to see food information!

