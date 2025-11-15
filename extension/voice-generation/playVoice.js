/**
 * Voice playback module
 * Handles ElevenLabs API calls and local MP3 file playback
 * Ensures only one voice plays at a time
 */

// Create global namespace if it doesn't exist
window.VoiceSystem = window.VoiceSystem || {};

// Global audio instance to prevent overlapping playback
let currentAudio = null;
let isPlaying = false;

// Track if user has interacted with the page (required for autoplay)
let hasUserInteracted = false;

// Initialize user interaction tracking
function initUserInteractionTracking() {
  const interactionEvents = ['click', 'touchstart', 'keydown', 'scroll'];
  
  const markInteraction = () => {
    if (!hasUserInteracted) {
      hasUserInteracted = true;
      console.log('User interaction detected - audio can now play');
    }
  };
  
  interactionEvents.forEach(event => {
    document.addEventListener(event, markInteraction, { once: true, passive: true });
  });
}

// Initialize on load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUserInteractionTracking);
  } else {
    initUserInteractionTracking();
  }
}

/**
 * Stop any currently playing audio
 */
function stopCurrentAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
      isPlaying = false;
      // Stop video avatar when audio stops
      stopVideoAvatar();
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }
}

/**
 * Play video avatar (smiling.mp4) when audio plays
 */
function playVideoAvatar() {
  try {
    const videoContainer = document.querySelector('.chipotle-top-video');
    if (!videoContainer) {
      return;
    }
    
    const video = videoContainer.querySelector('video');
    if (!video) {
      return;
    }
    
    // Get current cuisine
    const cuisineElement = document.querySelector('[data-cuisine]');
    const cuisine = cuisineElement ? cuisineElement.getAttribute('data-cuisine') : 'italian';
    const cuisinesWithVideos = ['bronx', 'chinese', 'italian'];
    
    if (!cuisinesWithVideos.includes(cuisine)) {
      return;
    }
    
    // Update video source to smiling.mp4 if needed
    const expectedUrl = chrome.runtime.getURL(`videos/${cuisine}/smiling.mp4`);
    // Compare URLs properly (video.src might have different format)
    if (!video.src.includes(`videos/${cuisine}/smiling.mp4`)) {
      video.src = expectedUrl;
      video.load();
    }
    
    // Reset to beginning and play
    video.currentTime = 0;
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Silently handle autoplay errors
        if (error.name !== 'NotAllowedError' && error.name !== 'NotSupportedError') {
          console.warn('Video playback error:', error);
        }
      });
    }
  } catch (error) {
    // Silently handle errors
    console.warn('Error playing video avatar:', error);
  }
}

/**
 * Stop video avatar (pause and reset)
 */
function stopVideoAvatar() {
  try {
    const videoContainer = document.querySelector('.chipotle-top-video');
    if (!videoContainer) {
      return;
    }
    
    const video = videoContainer.querySelector('video');
    if (!video) {
      return;
    }
    
    video.pause();
    video.currentTime = 0;
  } catch (error) {
    // Silently handle errors
    console.warn('Error stopping video avatar:', error);
  }
}

/**
 * Play audio from a URL (MP3 file)
 * @param {string} audioUrl - URL to the audio file
 * @returns {Promise<void>} Promise that resolves when audio finishes playing
 */
function playAudioFromUrl(audioUrl) {
  return new Promise((resolve, reject) => {
    try {
      // Check if user has interacted (required for autoplay policy)
      if (!hasUserInteracted) {
        console.warn('Audio playback blocked: User interaction required. Audio will play after user clicks/scrolls.');
        // Resolve silently - don't throw error, just skip playback
        resolve();
        return;
      }
      
      // Stop any currently playing audio
      stopCurrentAudio();
      
      // Create new audio element
      const audio = new Audio(audioUrl);
      currentAudio = audio;
      isPlaying = true;
      
      // Preload the audio
      audio.preload = 'auto';
      
      // Play video avatar when audio starts
      playVideoAvatar();
      
      // Handle successful playback
      audio.onended = () => {
        isPlaying = false;
        currentAudio = null;
        // Stop video avatar when audio ends
        stopVideoAvatar();
        resolve();
      };
      
      // Handle errors
      audio.onerror = (error) => {
        isPlaying = false;
        currentAudio = null;
        // Stop video avatar on error
        stopVideoAvatar();
        const errorMsg = audio.error ? `Code: ${audio.error.code}, Message: ${audio.error.message}` : 'Unknown error';
        console.error('Audio playback error:', errorMsg);
        reject(new Error(`Failed to play audio: ${errorMsg}`));
      };
      
      // Start playback with better error handling
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            console.log('Audio playback started');
          })
          .catch((error) => {
            isPlaying = false;
            currentAudio = null;
            // Stop video avatar on error
            stopVideoAvatar();
            
            // Check if it's an autoplay policy error
            if (error.name === 'NotAllowedError' || error.name === 'NotSupportedError') {
              console.warn('Audio autoplay blocked by browser policy. User interaction required.');
              // Don't reject - just resolve silently
              resolve();
            } else {
              console.error('Audio play error:', error.name, error.message);
              reject(error);
            }
          });
      }
      
    } catch (error) {
      isPlaying = false;
      currentAudio = null;
      // Stop video avatar on error
      stopVideoAvatar();
      console.error('Error creating audio:', error);
      reject(error);
    }
  });
}

/**
 * Generate audio using ElevenLabs API
 * Typical generation time: 1-3 seconds for short prompts (e.g., "Choose your protein.")
 * Longer text may take 3-5 seconds. Timeout set to 10 seconds to prevent hanging.
 * 
 * @param {string} text - Text to convert to speech
 * @param {string} voiceId - ElevenLabs voice ID
 * @param {string} apiKey - ElevenLabs API key
 * @returns {Promise<string>} Promise that resolves with the audio URL
 */
async function generateElevenLabsAudio(text, voiceId, apiKey) {
  const TIMEOUT_MS = 10000; // 10 second timeout
  
  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    const startTime = Date.now();
    console.log('Starting ElevenLabs API generation...');
    
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `ElevenLabs API error: ${response.status}`);
    }
    
    // Convert response to blob URL
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const generationTime = Date.now() - startTime;
    console.log(`ElevenLabs API generation completed in ${generationTime}ms`);
    
    return audioUrl;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('ElevenLabs API timeout after 10 seconds');
      throw new Error('Voice generation timeout - API took too long to respond');
    }
    console.error('ElevenLabs API error:', error);
    throw error;
  }
}

/**
 * Play voice using ElevenLabs API or fallback to local MP3
 * @param {string} text - Text to speak (for ElevenLabs)
 * @param {Object} voiceConfig - Voice configuration object with elevenlabsId and mp3Path
 * @param {string} apiKey - ElevenLabs API key (optional)
 * @returns {Promise<void>} Promise that resolves when voice finishes playing
 */
window.VoiceSystem.playVoice = async function(text, voiceConfig, apiKey = null) {
  if (!voiceConfig) {
    console.error('No voice config provided');
    return;
  }
  
  // Check if user has interacted (required for autoplay)
  if (!hasUserInteracted) {
    console.log('Voice playback queued - waiting for user interaction');
    // Don't throw error, just return silently
    return;
  }
  
  // Stop any currently playing audio
  stopCurrentAudio();
  
  // Try ElevenLabs API first if API key and voice ID are available
  if (apiKey && voiceConfig.elevenlabsId && voiceConfig.elevenlabsId !== '') {
    try {
      console.log('Attempting ElevenLabs API playback...');
      const audioUrl = await generateElevenLabsAudio(text, voiceConfig.elevenlabsId, apiKey);
      await playAudioFromUrl(audioUrl);
      // Clean up blob URL after playback
      URL.revokeObjectURL(audioUrl);
      return;
    } catch (error) {
      console.warn('ElevenLabs API failed, falling back to local MP3:', error);
      // Fall through to MP3 playback
    }
  }
  
  // Fallback to local MP3 file
  try {
    console.log('Playing local MP3 file:', voiceConfig.mp3Path);
    const mp3Url = chrome.runtime.getURL(voiceConfig.mp3Path);
    console.log('MP3 URL:', mp3Url);
    await playAudioFromUrl(mp3Url);
    console.log('MP3 playback completed');
  } catch (error) {
    // Only log error, don't throw - autoplay blocking is expected
    if (error.message && !error.message.includes('autoplay')) {
      console.error('Failed to play local MP3:', error);
      console.error('MP3 path was:', voiceConfig.mp3Path);
    }
    // Don't throw - just return silently
  }
}

/**
 * Check if audio is currently playing
 * @returns {boolean} True if audio is playing
 */
window.VoiceSystem.isAudioPlaying = function() {
  return isPlaying;
};

/**
 * Stop any currently playing audio
 */
window.VoiceSystem.stopAudio = function() {
  stopCurrentAudio();
};

/**
 * Check if user has interacted with the page
 * @returns {boolean} True if user has interacted
 */
window.VoiceSystem.hasUserInteracted = function() {
  return hasUserInteracted;
};

/**
 * Manually mark user interaction (useful for testing)
 */
window.VoiceSystem.markUserInteraction = function() {
  hasUserInteracted = true;
  console.log('User interaction manually marked');
};

