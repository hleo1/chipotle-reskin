/**
 * Voice-interactive ordering system
 * State machine and voice control logic with one-time playback
 */

// Create global namespace if it doesn't exist
window.VoiceSystem = window.VoiceSystem || {};

// Selection state object to track user choices
const selectionState = {
  protein: null,
  rice: null,
  beans: null,
  toppings: null
};

// One-time prompt guard - tracks which prompts have been played
const hasPrompted = {
  protein: false,
  rice: false,
  beans: false,
  toppings: false,
  fallback: false
};

// Section order for sequential flow
const SECTION_ORDER = ['protein', 'rice', 'beans', 'toppings'];

// Current cuisine (detected from data-cuisine attribute)
let currentCuisine = 'italian';

// ElevenLabs API key (can be set via chrome.storage)
let elevenLabsApiKey = null;

// Track if audio is currently playing to prevent overlaps
let isVoicePlaying = false;

/**
 * Get the current cuisine from the page
 * Looks for elements with data-cuisine attribute
 * @returns {string} Current cuisine name
 */
function detectCurrentCuisine() {
  const cuisineElement = document.querySelector('[data-cuisine]');
  if (cuisineElement) {
    const cuisine = cuisineElement.getAttribute('data-cuisine');
    if (cuisine) {
      currentCuisine = cuisine;
      return cuisine;
    }
  }
  // Default to italian if not found
  return currentCuisine;
}

/**
 * Play a voice prompt for a section (with one-time guard)
 * @param {string} section - Section name (protein, rice, beans, toppings, fallback)
 * @returns {Promise<void>}
 */
async function playVoicePrompt(section) {
  // One-time prompt guard
  if (hasPrompted[section]) {
    return;
  }
  
  // Check if another voice is playing
  if (isVoicePlaying) {
    console.log(`[Voice → ${section}] Skipped - another voice is playing`);
    return;
  }
  
  // Mark as prompted
  hasPrompted[section] = true;
  
  // Detect cuisine
  detectCurrentCuisine();
  
  // Get prompt text
  let promptText;
  if (section === 'fallback') {
    promptText = window.VoiceSystem.getFallbackPrompt();
  } else {
    promptText = window.VoiceSystem.getPrompt(section);
  }
  
  // Get voice config
  const voiceConfig = window.VoiceSystem.getVoiceConfig(currentCuisine, section);
  
  if (!voiceConfig) {
    console.warn(`[Voice → ${section}] No voice config found for cuisine: ${currentCuisine}`);
    return;
  }
  
  // Set playing flag
  isVoicePlaying = true;
  
  try {
    console.log(`[Voice → ${section}] ${promptText}`);
    await window.VoiceSystem.playVoice(promptText, voiceConfig, elevenLabsApiKey);
  } catch (error) {
    // Silently handle autoplay errors - they're expected
    if (!error.message || !error.message.includes('autoplay')) {
      console.error(`[Voice → ${section}] Error:`, error);
    }
  } finally {
    // Reset playing flag after a short delay to allow audio to start
    setTimeout(() => {
      isVoicePlaying = false;
    }, 100);
  }
}

/**
 * Handle user selection of an item
 * @param {string} section - Section name
 * @param {string} itemName - Selected item name
 */
async function handleSelection(section, itemName) {
  console.log(`[Selection] ${section} → ${itemName}`);
  
  // Update selection state
  selectionState[section] = itemName;
  
  // Mark this section as prompted (prevents re-prompting)
  hasPrompted[section] = true;
  
  // Detect cuisine
  detectCurrentCuisine();
  
  // Skip logic: if user clicks any section before protein, play fallback
  if (!selectionState.protein && section !== "protein") {
    if (!hasPrompted.fallback) {
      await playVoicePrompt("fallback");
    }
    return;
  }
  
  // Sequential flow: play next section's prompt
  const order = ["protein", "rice", "beans", "toppings"];
  const currentIndex = order.indexOf(section);
  const nextIndex = currentIndex + 1;
  
  if (nextIndex < order.length) {
    const nextSection = order[nextIndex];
    if (!hasPrompted[nextSection]) {
      await playVoicePrompt(nextSection);
    }
  } else {
    // All sections completed
    console.log('[Voice] Ordering flow complete');
  }
}

/**
 * Initialize click listeners on selectable items
 */
function initializeItemClickListeners() {
  // Find all items with data-item attribute
  const items = document.querySelectorAll('[data-item]');
  
  items.forEach(item => {
    // Check if already has listener (use data attribute to track)
    if (item.hasAttribute('data-voice-listener')) {
      return;
    }
    
    // Mark as having listener
    item.setAttribute('data-voice-listener', 'true');
    
    // Add click listener
    item.addEventListener('click', (event) => {
      const section = item.closest('[data-section]')?.getAttribute('data-section');
      const itemName = item.getAttribute('data-item');
      
      if (section && itemName) {
        handleSelection(section, itemName);
      }
    }, { passive: true });
  });
  
  if (items.length > 0) {
    console.log(`[Voice] Initialized click listeners for ${items.length} items`);
  }
}

/**
 * Load ElevenLabs API key from storage
 */
async function loadApiKey() {
  try {
    const result = await chrome.storage.local.get('elevenLabsApiKey');
    if (result.elevenLabsApiKey) {
      elevenLabsApiKey = result.elevenLabsApiKey;
      console.log('[Voice] ElevenLabs API key loaded');
    }
  } catch (error) {
    console.error('[Voice] Error loading API key:', error);
  }
}

/**
 * Initialize the voice-interactive system
 */
window.VoiceSystem.initialize = async function() {
  console.log('[Voice] Initializing voice-interactive ordering system...');
  
  // Load API key
  await loadApiKey();
  
  // Detect initial cuisine
  detectCurrentCuisine();
  
  // Initialize click listeners
  initializeItemClickListeners();
  
  // Watch for DOM changes (for dynamically loaded content)
  const observer = new MutationObserver(() => {
    initializeItemClickListeners();
  });
  
  // Only observe if body exists
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  console.log('[Voice] Voice-interactive system initialized');
};

/**
 * Reset selection state and prompts (for testing)
 */
window.VoiceSystem.resetSelectionState = function() {
  selectionState.protein = null;
  selectionState.rice = null;
  selectionState.beans = null;
  selectionState.toppings = null;
  
  hasPrompted.protein = false;
  hasPrompted.rice = false;
  hasPrompted.beans = false;
  hasPrompted.toppings = false;
  hasPrompted.fallback = false;
  
  window.VoiceSystem.stopAudio();
  
  console.log('[Voice] Selection state reset');
};

/**
 * Get current selection state
 * @returns {Object} Copy of selection state
 */
window.VoiceSystem.getSelectionState = function() {
  return { ...selectionState };
};

/**
 * Get current prompt state
 * @returns {Object} Copy of hasPrompted state
 */
window.VoiceSystem.getPromptState = function() {
  return { ...hasPrompted };
};

// Export handleSelection for use in main.js
window.VoiceSystem.handleSelection = handleSelection;
window.VoiceSystem.playVoicePrompt = playVoicePrompt;
