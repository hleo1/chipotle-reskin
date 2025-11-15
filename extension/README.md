# Chipotle Food Card Customizer Extension

This browser extension replaces food cards on Chipotle's website with custom images and names, and provides educational information about each food item through an info button feature.

## Features

- **Custom Food Cards**: Replace Chipotle's menu items with your own cuisine (Italian, Mongolian, etc.)
- **Info Buttons**: Click the ℹ️ button on any food card to learn:
  - What the food item is
  - How it's prepared in the specific country/cuisine
- **Dynamic Cuisine Support**: Works with any cuisine you configure - just update the food items and images

## Installation

### Chrome/Edge/Brave (Chromium-based browsers)

1. Open your browser and navigate to `chrome://extensions/` (or `edge://extensions/` for Edge)
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. The extension should now be active!

### Firefox

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the `extension` folder
5. The extension should now be active!

## Setting Up Backend Server (Required for Info Buttons)

The info button feature requires a backend server with Redis caching. 

### Quick Setup:

1. **Set up the backend server:**
   ```bash
   cd backend
   npm install
   # Follow instructions in backend/SETUP.md
   npm start
   ```

2. **The extension is already configured** to use `http://localhost:3000` by default.

3. **For production deployment:**
   - Deploy backend to Railway, Render, or similar
   - Update `BACKEND_URL` in `extension/background.js` to your deployed URL
   - Or set it via console:
   ```javascript
   chrome.runtime.sendMessage({
     action: 'setBackendUrl',
     url: 'https://your-backend-url.com'
   });
   ```

See `backend/README.md` for detailed setup instructions.

## Customizing Your Food Items

1. Update `FOOD_ITEMS_BY_SECTION` in `content.js` with your food items
2. Add corresponding images to the `pictures/[country]/` folders
3. The extension automatically extracts the country from the image path (e.g., `italian/proteins_veg/...` → `italian`)

## How It Works

The extension uses a content script that:
- Runs on all Chipotle.com pages
- Replaces food cards with your custom images and names
- Adds info buttons (ℹ️) to each food card
- When clicked, fetches information from Tavily API about:
  - What the food item is (general information)
  - How it's prepared in the specific country/cuisine (cultural context)
- Caches results to minimize API calls

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main script that performs card replacement and info button functionality
- `background.js` - Service worker that handles Tavily API calls
- `pictures/` - Folder containing food images organized by country/cuisine

## Notes

- The extension automatically watches for new content loaded by Chipotle's dynamic page updates
- Info button results are cached for 7 days to reduce API usage
- Check the browser console for logs and any errors
- The extension works with any cuisine - just update the food items and ensure images are in the correct folder structure

