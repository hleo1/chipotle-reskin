# Chipotle Steak Picture Replacer Extension

This browser extension replaces the steak picture on Chipotle's website (https://www.chipotle.com/order/build/burrito-bowl) with your own custom image.

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

## Customizing Your Replacement Image

1. Replace the file `images/replacement-image.png` with your own image
2. Keep the filename as `replacement-image.png`, or update the `REPLACEMENT_IMAGE` constant in `content.js` to match your new filename
3. Reload the extension in your browser

## How It Works

The extension uses a content script that:
- Runs on all Chipotle.com pages
- Searches for images containing "steak" in their src, alt text, or title
- Also checks for steak-related elements using data attributes
- Replaces matching images with your custom image
- Watches for dynamically loaded content (Chipotle uses a single-page application)

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main script that performs the image replacement
- `images/replacement-image.png` - Your replacement image (customize this!)

## Notes

- The extension automatically watches for new content loaded by Chipotle's dynamic page updates
- It runs every 2 seconds as a backup to catch any missed images
- Check the browser console for logs of replaced images

