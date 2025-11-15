/**
 * Main entry point for voice-interactive ordering system
 * Event listeners for scroll + click
 */

// Track if initial protein prompt has been triggered
let initialPromptTriggered = false;
let scrollListenerAttached = false;

/**
 * Wait for DOM to be ready
 */
function waitForDOM() {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });
}

/**
 * Wait for VoiceSystem to be ready
 */
function waitForVoiceSystem(maxAttempts = 20, interval = 200) {
  return new Promise((resolve) => {
    let attempts = 0;
    
    const checkVoiceSystem = () => {
      if (window.VoiceSystem && window.VoiceSystem.playVoicePrompt) {
        console.log('[Voice] VoiceSystem.playVoicePrompt is ready');
        resolve(true);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkVoiceSystem, interval);
      } else {
        console.warn('[Voice] VoiceSystem.playVoicePrompt not found after waiting');
        resolve(false);
      }
    };
    
    checkVoiceSystem();
  });
}

/**
 * Handle scroll event - trigger initial protein prompt once
 */
function handleScroll() {
  console.log('[Voice] Scroll event detected');
  
  // Only trigger once
  if (initialPromptTriggered) {
    return;
  }
  
  // Check if VoiceSystem is ready
  if (!window.VoiceSystem || !window.VoiceSystem.playVoicePrompt) {
    console.warn('[Voice] VoiceSystem not ready yet, skipping scroll trigger');
    return;
  }
  
  // Mark as triggered immediately to prevent multiple triggers
  initialPromptTriggered = true;
  
  console.log('[Voice → protein] Initial prompt triggered on scroll');
  
  // Play initial protein prompt
  window.VoiceSystem.playVoicePrompt('protein');
  
  // Remove scroll listeners after triggering
  window.removeEventListener('scroll', handleScroll, { passive: true });
  document.removeEventListener('scroll', handleScroll, { passive: true });
  document.documentElement.removeEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Initialize scroll listener for initial protein prompt
 */
async function initializeScrollListener() {
  // Don't attach if already attached
  if (scrollListenerAttached) {
    return;
  }
  
  // Wait for VoiceSystem to be ready
  const isReady = await waitForVoiceSystem();
  if (!isReady) {
    console.warn('[Voice] Could not initialize scroll listener - VoiceSystem not ready');
    return;
  }
  
  // Attach scroll listener to multiple targets for better compatibility
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('scroll', handleScroll, { passive: true });
  document.documentElement.addEventListener('scroll', handleScroll, { passive: true });
  
  scrollListenerAttached = true;
  console.log('[Voice] Scroll listener initialized for initial protein prompt');
  
  // Also check immediately in case page is already scrolled
  // Use a small delay to ensure everything is set up
  setTimeout(() => {
    if (!initialPromptTriggered && window.VoiceSystem && window.VoiceSystem.playVoicePrompt) {
      // Check if page has been scrolled
      if (window.pageYOffset > 0 || document.documentElement.scrollTop > 0) {
        console.log('[Voice] Page already scrolled, triggering immediately');
        handleScroll();
      }
    }
  }, 500);
}

/**
 * Initialize voice system when page is ready
 */
async function init() {
  try {
    // Wait for DOM
    await waitForDOM();
    
    // Wait a bit for content.js to add data-section attributes
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Initialize the voice system
    if (window.VoiceSystem && window.VoiceSystem.initialize) {
      await window.VoiceSystem.initialize();
      console.log('[Voice] Voice-interactive ordering system ready');
      
      // Initialize scroll listener for initial prompt
      initializeScrollListener();
    } else {
      console.warn('[Voice] VoiceSystem not available yet, will retry...');
      // Retry after a delay
      setTimeout(() => {
        if (window.VoiceSystem && window.VoiceSystem.initialize) {
          window.VoiceSystem.initialize().then(() => {
            initializeScrollListener();
          });
        }
      }, 2000);
    }
  } catch (error) {
    console.error('[Voice] Error initializing voice system:', error);
  }
}

// Start initialization (don't block page load)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // Use setTimeout to ensure it doesn't block
  setTimeout(init, 100);
}
