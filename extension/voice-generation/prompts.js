/**
 * Voice prompt text for each section
 * These prompts are used to generate voice audio via ElevenLabs API
 */

// Create global namespace if it doesn't exist
window.VoiceSystem = window.VoiceSystem || {};

window.VoiceSystem.PROMPTS = {
  protein: "Choose your protein.",
  rice: "What rice would you like?",
  beans: "What beans would you like?",
  toppings: "What toppings would you like?",
  fallback: "You skipped your protein!"
};

/**
 * Get fallback prompt text
 * @returns {string} Fallback prompt text
 */
window.VoiceSystem.getFallbackPrompt = function() {
  return window.VoiceSystem.PROMPTS.fallback;
};

/**
 * Get prompt text for a section
 * @param {string} section - Section name
 * @returns {string} Prompt text
 */
window.VoiceSystem.getPrompt = function(section) {
  return window.VoiceSystem.PROMPTS[section] || `Choose your ${section}.`;
};

