/**
 * Voice configuration for each cuisine
 * Contains ElevenLabs voice IDs and local MP3 file paths
 * Update with actual voice IDs and file paths as needed
 */

// Create global namespace if it doesn't exist
window.VoiceSystem = window.VoiceSystem || {};

window.VoiceSystem.VOICES = {
  italian: {
    protein: {
      elevenlabsId: "italian_protein_voice_id",
      mp3Path: "voice-generation/voices/italian/choose-protein.mp3"
    },
    rice: {
      elevenlabsId: "italian_rice_voice_id",
      mp3Path: "voice-generation/voices/italian/choose-rice.mp3"
    },
    beans: {
      elevenlabsId: "italian_beans_voice_id",
      mp3Path: "voice-generation/voices/italian/choose-beans.mp3"
    },
    toppings: {
      elevenlabsId: "italian_toppings_voice_id",
      mp3Path: "voice-generation/voices/italian/choose-toppings.mp3"
    },
    fallback: {
      elevenlabsId: "italian_fallback_voice_id",
      mp3Path: "voice-generation/voices/italian/scream-protein-skipped.mp3"
    }
  },
  chinese: {
    protein: {
      elevenlabsId: "chinese_protein_voice_id",
      mp3Path: "voice-generation/voices/chinese/choose-protein.mp3"
    },
    rice: {
      elevenlabsId: "chinese_rice_voice_id",
      mp3Path: "voice-generation/voices/chinese/choose-rice.mp3"
    },
    beans: {
      elevenlabsId: "chinese_beans_voice_id",
      mp3Path: "voice-generation/voices/chinese/choose-beans.mp3"
    },
    toppings: {
      elevenlabsId: "chinese_toppings_voice_id",
      mp3Path: "voice-generation/voices/chinese/choose-toppings.mp3"
    },
    fallback: {
      elevenlabsId: "chinese_fallback_voice_id",
      mp3Path: "voice-generation/voices/chinese/scream-protein-skipped.mp3"
    }
  },
  jamaican: {
    protein: {
      elevenlabsId: "jamaican_protein_voice_id",
      mp3Path: "voice-generation/voices/jamaican/choose-protein.mp3"
    },
    rice: {
      elevenlabsId: "jamaican_rice_voice_id",
      mp3Path: "voice-generation/voices/jamaican/choose-rice.mp3"
    },
    beans: {
      elevenlabsId: "jamaican_beans_voice_id",
      mp3Path: "voice-generation/voices/jamaican/choose-beans.mp3"
    },
    toppings: {
      elevenlabsId: "jamaican_toppings_voice_id",
      mp3Path: "voice-generation/voices/jamaican/choose-toppings.mp3"
    },
    fallback: {
      elevenlabsId: "jamaican_fallback_voice_id",
      mp3Path: "voice-generation/voices/jamaican/scream-protein-skipped.mp3"
    }
  },
  bronx: {
    protein: {
      elevenlabsId: "bronx_protein_voice_id",
      mp3Path: "voice-generation/voices/bronx/choose-protein.mp3"
    },
    rice: {
      elevenlabsId: "bronx_rice_voice_id",
      mp3Path: "voice-generation/voices/bronx/choose-rice.mp3"
    },
    beans: {
      elevenlabsId: "bronx_beans_voice_id",
      mp3Path: "voice-generation/voices/bronx/choose-beans.mp3"
    },
    toppings: {
      elevenlabsId: "bronx_toppings_voice_id",
      mp3Path: "voice-generation/voices/bronx/choose-toppings.mp3"
    },
    fallback: {
      elevenlabsId: "bronx_fallback_voice_id",
      mp3Path: "voice-generation/voices/bronx/scream-protein-skipped.mp3"
    }
  },
  brooklyn: {
    protein: {
      elevenlabsId: "brooklyn_protein_voice_id",
      mp3Path: "voice-generation/voices/brooklyn/choose-protein.mp3"
    },
    rice: {
      elevenlabsId: "brooklyn_rice_voice_id",
      mp3Path: "voice-generation/voices/brooklyn/choose-rice.mp3"
    },
    beans: {
      elevenlabsId: "brooklyn_beans_voice_id",
      mp3Path: "voice-generation/voices/brooklyn/choose-beans.mp3"
    },
    toppings: {
      elevenlabsId: "brooklyn_toppings_voice_id",
      mp3Path: "voice-generation/voices/brooklyn/choose-toppings.mp3"
    },
    fallback: {
      elevenlabsId: "brooklyn_fallback_voice_id",
      mp3Path: "voice-generation/voices/brooklyn/scream-protein-skipped.mp3"
    }
  },
  english: {
    protein: {
      elevenlabsId: "english_protein_voice_id",
      mp3Path: "voice-generation/voices/english/choose-protein.mp3"
    },
    rice: {
      elevenlabsId: "english_rice_voice_id",
      mp3Path: "voice-generation/voices/english/choose-rice.mp3"
    },
    beans: {
      elevenlabsId: "english_beans_voice_id",
      mp3Path: "voice-generation/voices/english/choose-beans.mp3"
    },
    toppings: {
      elevenlabsId: "english_toppings_voice_id",
      mp3Path: "voice-generation/voices/english/choose-toppings.mp3"
    },
    fallback: {
      elevenlabsId: "english_fallback_voice_id",
      mp3Path: "voice-generation/voices/english/scream-protein-skipped.mp3"
    }
  }
};

/**
 * Get voice configuration for a specific cuisine and section
 * @param {string} cuisine - The cuisine name (e.g., 'italian', 'chinese')
 * @param {string} section - The section name (e.g., 'protein', 'rice', 'beans', 'toppings', 'fallback')
 * @returns {Object|null} Voice configuration object or null if not found
 */
window.VoiceSystem.getVoiceConfig = function(cuisine, section) {
  if (!window.VoiceSystem.VOICES[cuisine] || !window.VoiceSystem.VOICES[cuisine][section]) {
    console.warn(`Voice config not found for cuisine: ${cuisine}, section: ${section}`);
    return null;
  }
  return window.VoiceSystem.VOICES[cuisine][section];
};

