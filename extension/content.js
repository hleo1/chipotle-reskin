// Chipotle Food Card Customizer
// This script replaces food cards on Chipotle's website with custom images and names

(function() {
  'use strict';

  // Hero section configuration
  const HERO_SECTION = {
    title: "Your Italian Piatto",
    description: "Build your ideal Italian bowl with your choice of Pollo Arrosto, Stracotto di Manzo, Salsiccia e Peperoni, Gamberetti Aglio e Olio, or Melanzane e Funghi. Served with creamy Risotto or Polenta, alongside Fagioli Cannellini or Borlotti Beans. Finish it your way with fresh Bruschetta Topping, authentic Parmigiano Reggiano, vibrant Peperonata, or rich Pesto alla Genovese.",
    image: 'hero-section/italian/hero-image.png'
  };

  // Food items configuration organized by section
  const FOOD_ITEMS_BY_SECTION = {
    'protein-or-veggie': [
      { image: 'italian/proteins_veg/braised-beef-stracotto.png', name: 'Beef Stracotto' },
      { image: 'italian/proteins_veg/eggplant-mushroom.png', name: 'Eggplant Mushroom' },
      { image: 'italian/proteins_veg/garlic-shrimp.png', name: 'Garlic Shrimp' },
      { image: 'italian/proteins_veg/herbed-chicken.png', name: 'Herbed Chicken' },
      { image: 'italian/proteins_veg/sausage-peppers.png', name: 'Sausage Peppers' }
    ],
    'rice': [
      { image: 'italian/carbs/polenta.png', name: 'Polenta' },
      { image: 'italian/carbs/risotto.png', name: 'Risotto' }
    ],
    'beans': [
      { image: 'italian/beans/borlotti-beans.png', name: 'Borlotti Beans' },
      { image: 'italian/beans/cannellini-beans.png', name: 'Cannellini Beans' }
    ],
    'toppings': [
      { image: 'italian/toppings/basil-pesto.png', name: 'Basil Pesto' },
      { image: 'italian/toppings/bruschetta-topping.png', name: 'Bruschetta Topping' },
      { image: 'italian/toppings/grated-parmesan.png', name: 'Grated Parmesan' },
      { image: 'italian/toppings/peperonata.png', name: 'Peperonata' }
    ]
  };

  // Track custom cards to persist their images
  const customCards = new WeakMap();

  // Extract country from image path (e.g., "italian/proteins_veg/..." -> "italian")
  function extractCountryFromImagePath(imagePath) {
    const match = imagePath.match(/^([^/]+)\//);
    return match ? match[1] : 'italian'; // Default to italian if not found
  }

  // Inject CSS to override background images with !important and style info buttons/modal
  function injectPersistentCSS() {
    const styleId = 'chipotle-custom-images';
    if (document.getElementById(styleId)) {
      return; // Already injected
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .meal-builder-item-selector-card-container[data-custom-image] {
        background-image: var(--custom-bg-image) !important;
      }
      
      /* Info button styles */
      .chipotle-info-button {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(8px);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        padding: 0;
      }
      
      .chipotle-info-button:hover {
        background-color: rgba(255, 255, 255, 1);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
      }
      
      .chipotle-info-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }
      
      .chipotle-info-button img {
        width: 16px;
        height: 16px;
        object-fit: contain;
        display: block;
        transition: opacity 0.2s ease;
      }
      
      .chipotle-info-button:hover img {
        opacity: 0.8;
      }
      
      .meal-builder-item-selector-card-container {
        position: relative;
      }
      
      /* Modal styles */
      .chipotle-info-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .chipotle-info-modal {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
        position: relative;
      }
      
      @keyframes slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      .chipotle-info-modal-header {
        padding: 20px 24px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        background: white;
        z-index: 1;
      }
      
      .chipotle-info-modal-title {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
      
      .chipotle-info-modal-close {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
      }
      
      .chipotle-info-modal-close:hover {
        background-color: #f0f0f0;
        color: #333;
      }
      
      .chipotle-info-modal-content {
        padding: 24px;
      }
      
      .chipotle-info-section {
        margin-bottom: 32px;
      }
      
      .chipotle-info-section:last-child {
        margin-bottom: 0;
      }
      
      .chipotle-info-section-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 2px solid #e0e0e0;
      }
      
      .chipotle-info-section-content {
        font-size: 15px;
        line-height: 1.6;
        color: #555;
      }
      
      .chipotle-info-loading {
        text-align: center;
        padding: 40px;
        color: #666;
      }
      
      .chipotle-info-loading-spinner {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #333;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .chipotle-info-error {
        padding: 20px;
        background-color: #fee;
        border: 1px solid #fcc;
        border-radius: 8px;
        color: #c33;
        text-align: center;
      }
      
      .chipotle-info-sources {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e0e0e0;
      }
      
      .chipotle-info-source {
        font-size: 13px;
        color: #666;
        margin-bottom: 8px;
      }
      
      .chipotle-info-source a {
        color: #0066cc;
        text-decoration: none;
      }
      
      .chipotle-info-source a:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
  }

  // Helper function to add info button to a card
  function addInfoButton(card, foodName, country) {
    // Remove existing info button if present
    const existingButton = card.querySelector('.chipotle-info-button');
    if (existingButton) {
      existingButton.remove();
    }

    // Create info button
    const infoButton = document.createElement('button');
    infoButton.className = 'chipotle-info-button';
    infoButton.setAttribute('aria-label', `Learn about ${foodName}`);
    infoButton.title = `Learn about ${foodName}`;
    infoButton.type = 'button';
    
    // Create image icon
    const iconImg = document.createElement('img');
    iconImg.src = chrome.runtime.getURL('info-icon.png');
    iconImg.alt = 'Info';
    iconImg.setAttribute('aria-hidden', 'true');
    infoButton.appendChild(iconImg);
    
    infoButton.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      showFoodInfoModal(foodName, country);
    });

    card.appendChild(infoButton);
  }

  // Helper function to update a card with new image and name
  function updateCard(card, imageUrl, newName, imagePath) {
    // Store custom image URL in data attribute and WeakMap for persistence
    card.setAttribute('data-custom-image', imageUrl);
    const country = extractCountryFromImagePath(imagePath);
    customCards.set(card, { imageUrl, name: newName, country, imagePath });

    // Use setProperty with !important flag for maximum persistence
    card.style.setProperty('background-image', `url(${imageUrl})`, 'important');
    
    // Also set CSS custom property as backup
    card.style.setProperty('--custom-bg-image', `url(${imageUrl})`, 'important');

    // Update item name
    const itemName = card.querySelector('.item-name');
    if (itemName && itemName.textContent.trim() !== newName) {
      itemName.textContent = newName;
      console.log(`Updated item name to: ${newName}`);
    }

    // Update data attributes
    if (card.getAttribute('data-qa-item-name')) {
      card.setAttribute('data-qa-item-name', newName);
      card.setAttribute('data-qa-title', newName);
    }

    // Update aria-label if it contains the old name
    const cardElement = card.querySelector('.card');
    if (cardElement && cardElement.getAttribute('aria-label')) {
      const ariaLabel = cardElement.getAttribute('aria-label');
      const oldName = cardElement.getAttribute('aria-label').match(/You can select ([^$]+)/);
      if (oldName) {
        const newAriaLabel = ariaLabel.replace(oldName[1].trim(), newName);
        cardElement.setAttribute('aria-label', newAriaLabel);
        console.log(`Updated aria-label for: ${newName}`);
      }
    }

    // Update data-qa-item-name-title attribute if present
    const titleButton = card.querySelector('[data-qa-item-name-title]');
    if (titleButton) {
      titleButton.setAttribute('data-qa-item-name-title', newName);
      console.log(`Updated data-qa-item-name-title for: ${newName}`);
    }

    // Add info button
    addInfoButton(card, newName, country);
  }

  // Function to re-apply custom images to cards that have been reset
  function reapplyCustomImages() {
    // Find all cards with our custom data attribute
    const allCustomCards = document.querySelectorAll('[data-custom-image]');
    
    allCustomCards.forEach(card => {
      const customData = customCards.get(card);
      if (customData) {
        const currentBg = card.style.backgroundImage || window.getComputedStyle(card).backgroundImage;
        const expectedUrl = customData.imageUrl;
        
        // If the background image doesn't match our custom one, re-apply it
        if (!currentBg.includes(expectedUrl)) {
          card.style.setProperty('background-image', `url(${expectedUrl})`, 'important');
          card.style.setProperty('--custom-bg-image', `url(${expectedUrl})`, 'important');
          console.log(`Re-applied custom image for: ${customData.name}`);
        }

        // Re-apply info button if missing
        if (!card.querySelector('.chipotle-info-button')) {
          addInfoButton(card, customData.name, customData.country);
        }
      }
    });
  }

  // Function to replace food cards in a specific section
  function replaceFoodCardsInSection(sectionName, foodItems) {
    // Find the section by data-analytics-section attribute
    // Handle empty section name (for toppings which has empty data-analytics-section)
    let section;
    if (sectionName === 'toppings') {
      // For toppings, find section by title "Top Things Off"
      const allSections = document.querySelectorAll('.item-selector');
      section = Array.from(allSections).find(s => {
        const title = s.querySelector('.title');
        return title && title.textContent.trim() === 'Top Things Off';
      });
    } else {
      const sectionSelector = `[data-analytics-section="${sectionName}"]`;
      section = document.querySelector(sectionSelector);
    }
    
    if (!section) {
      return; // Section not found yet
    }

    // Find the cards container within this section
    const cardsContainer = section.querySelector('.cards');
    
    if (!cardsContainer) {
      return; // Cards container not found yet
    }

    // Get all food card containers in this section
    const allCards = cardsContainer.querySelectorAll('.meal-builder-item-selector-card-container');
    
    if (allCards.length === 0) {
      return; // No cards found yet
    }

    // Update each available card with our custom foods
    const cardsArray = Array.from(allCards);
    const numFoodItems = foodItems.length;
    const numCards = cardsArray.length;

    for (let i = 0; i < Math.min(numFoodItems, numCards); i++) {
      const card = cardsArray[i];
      const foodItem = foodItems[i];
      const imageUrl = chrome.runtime.getURL(`pictures/${foodItem.image}`);
      const cardName = card.querySelector('.item-name')?.textContent.trim();
      
      // Only update if not already customized
      if (cardName !== foodItem.name) {
        updateCard(card, imageUrl, foodItem.name, foodItem.image);
      } else {
        // Ensure info button is present even if card is already customized
        const customData = customCards.get(card);
        if (customData && !card.querySelector('.chipotle-info-button')) {
          addInfoButton(card, foodItem.name, customData.country);
        }
      }
    }

    // Remove all remaining cards (starting after our custom foods)
    for (let i = numFoodItems; i < cardsArray.length; i++) {
      const cardToRemove = cardsArray[i];
      console.log(`Removing card from ${sectionName}: ${cardToRemove.getAttribute('data-qa-item-name') || 'unknown'}`);
      cardToRemove.remove();
    }
  }

  // Function to remove unwanted sections
  function removeUnwantedSections() {
    // Sections to remove by their data-analytics-section attribute
    const sectionsToRemove = ['chips-and-dips', 'single-side', 'drinks'];
    
    sectionsToRemove.forEach(sectionName => {
      const section = document.querySelector(`[data-analytics-section="${sectionName}"]`);
      if (section) {
        // Find the parent item-category container and remove it
        const itemCategory = section.closest('.item-category');
        if (itemCategory) {
          itemCategory.remove();
          console.log(`Removed section: ${sectionName}`);
        }
      }
    });
  }

  // Function to replace hero section
  function replaceHeroSection() {
    const header = document.querySelector('.meal-builder-header');
    if (!header) {
      return; // Hero section not found yet
    }

    // Check if already customized to prevent infinite loops
    if (header.hasAttribute('data-custom-hero')) {
      return; // Already customized
    }

    // Mark as customized to prevent re-processing
    header.setAttribute('data-custom-hero', 'true');

    // Update hero image
    const bannerImage = header.querySelector('.banner-image');
    if (bannerImage) {
      const imageUrl = chrome.runtime.getURL(HERO_SECTION.image);
      // Only update if different
      if (bannerImage.src !== imageUrl) {
        bannerImage.src = imageUrl;
        bannerImage.setAttribute('data-custom-hero-image', imageUrl);
        console.log('Updated hero image');
      }
    }

    // Update title - split "Your Italian Piatto" into "BUILD YOUR" and "Italian Piatto"
    const heading = header.querySelector('.heading');
    const name = header.querySelector('.name');
    
    if (heading && heading.textContent.trim() !== 'BUILD YOUR') {
      heading.textContent = 'BUILD YOUR';
      console.log('Updated hero heading');
    }
    
    if (name) {
      // Extract the main title (everything after "Your" or use the full title)
      const titleParts = HERO_SECTION.title.split(' ');
      const newName = titleParts.length > 2 && titleParts[0].toLowerCase() === 'your'
        ? titleParts.slice(1).join(' ')
        : HERO_SECTION.title;
      
      if (name.textContent.trim() !== newName) {
        name.textContent = newName;
        console.log('Updated hero title');
      }
    }

    // Update description
    const description = header.querySelector('.description');
    if (description && description.textContent.trim() !== HERO_SECTION.description) {
      description.textContent = HERO_SECTION.description;
      console.log('Updated hero description');
    }
  }

  // Function to replace food cards in all configured sections
  function replaceFoodCards() {
    // Process each section defined in FOOD_ITEMS_BY_SECTION
    for (const [sectionName, foodItems] of Object.entries(FOOD_ITEMS_BY_SECTION)) {
      replaceFoodCardsInSection(sectionName, foodItems);
    }
    // Re-apply custom images after replacement
    reapplyCustomImages();
  }

  // Inject CSS early
  injectPersistentCSS();

  // Replace hero section
  replaceHeroSection();

  // Remove unwanted sections
  removeUnwantedSections();

  // Initial replacement
  replaceFoodCards();

  // Watch for dynamically loaded content and style changes
  const observer = new MutationObserver((mutations) => {
    let shouldReplace = false;
    
    mutations.forEach(mutation => {
      // Skip mutations on our custom hero section
      if (mutation.target && mutation.target.hasAttribute && mutation.target.hasAttribute('data-custom-hero')) {
        return; // Ignore our own changes
      }
      
      // Watch for new nodes
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any added node is part of our custom hero section
        const isOurUpdate = Array.from(mutation.addedNodes).some(node => 
          node.nodeType === 1 && (node.hasAttribute('data-custom-hero') || node.closest('[data-custom-hero]'))
        );
        if (!isOurUpdate) {
          shouldReplace = true;
        }
      }
      // Watch for style attribute changes on custom cards (but not hero section)
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'style' && 
          mutation.target.hasAttribute('data-custom-image')) {
        // Re-apply immediately when style is changed
        reapplyCustomImages();
      }
    });
    
    if (shouldReplace) {
      replaceHeroSection();
      removeUnwantedSections();
      replaceFoodCards();
    }
  });

  // Start observing when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
        // Ignore changes to our custom hero section
        attributeOldValue: false
      });
    });
    } else {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
        // Ignore changes to our custom hero section
        attributeOldValue: false
      });
    }

  // Re-apply custom images more frequently to combat Chipotle's resets
  setInterval(reapplyCustomImages, 500);
  
  // Also run replacement periodically for heavy SPAs
  setInterval(() => {
    // Only replace hero section if not already customized
    const header = document.querySelector('.meal-builder-header');
    if (header && !header.hasAttribute('data-custom-hero')) {
      replaceHeroSection();
    }
    removeUnwantedSections();
    replaceFoodCards();
  }, 2000);

  // Use requestAnimationFrame for aggressive persistence (throttled)
  let lastCheck = 0;
  const CHECK_INTERVAL = 100; // Check every 100ms max
  
  function persistentCheck(timestamp) {
    // Throttle checks to avoid performance issues
    if (timestamp - lastCheck >= CHECK_INTERVAL) {
      reapplyCustomImages();
      lastCheck = timestamp;
    }
    requestAnimationFrame(persistentCheck);
  }
  requestAnimationFrame(persistentCheck);

  // Modal functionality
  function showFoodInfoModal(foodName, country) {
    // Remove existing modal if present
    const existingModal = document.querySelector('.chipotle-info-modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'chipotle-info-modal-overlay';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'chipotle-info-modal';
    
    // Modal header
    const header = document.createElement('div');
    header.className = 'chipotle-info-modal-header';
    
    const title = document.createElement('h2');
    title.className = 'chipotle-info-modal-title';
    title.textContent = foodName;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'chipotle-info-modal-close';
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.addEventListener('click', () => overlay.remove());
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    // Modal content
    const content = document.createElement('div');
    content.className = 'chipotle-info-modal-content';
    
    // Loading state
    const loading = document.createElement('div');
    loading.className = 'chipotle-info-loading';
    loading.innerHTML = `
      <div class="chipotle-info-loading-spinner"></div>
      <div>Loading information about ${foodName}...</div>
    `;
    content.appendChild(loading);
    
    modal.appendChild(header);
    modal.appendChild(content);
    overlay.appendChild(modal);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    document.body.appendChild(overlay);
    
    // Fetch food information
    chrome.runtime.sendMessage(
      {
        action: 'getFoodInfo',
        foodName: foodName,
        country: country
      },
      (response) => {
        // Remove loading
        loading.remove();
        
        if (!response || !response.success) {
          const error = document.createElement('div');
          error.className = 'chipotle-info-error';
          error.textContent = response?.error || 'Failed to load information. Please check your Tavily API key in extension settings.';
          content.appendChild(error);
          return;
        }

        const data = response.data;
        
        // General information section
        const generalSection = document.createElement('div');
        generalSection.className = 'chipotle-info-section';
        
        const generalTitle = document.createElement('h3');
        generalTitle.className = 'chipotle-info-section-title';
        generalTitle.textContent = `What are ${foodName}?`;
        
        const generalContent = document.createElement('div');
        generalContent.className = 'chipotle-info-section-content';
        generalContent.textContent = data.general.answer;
        
        generalSection.appendChild(generalTitle);
        generalSection.appendChild(generalContent);
        
        // Add sources if available
        if (data.general.sources && data.general.sources.length > 0) {
          const sources = document.createElement('div');
          sources.className = 'chipotle-info-sources';
          sources.innerHTML = '<strong>Sources:</strong>';
          data.general.sources.forEach(source => {
            const sourceDiv = document.createElement('div');
            sourceDiv.className = 'chipotle-info-source';
            const link = document.createElement('a');
            link.href = source.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = source.title || source.url;
            sourceDiv.appendChild(link);
            sources.appendChild(sourceDiv);
          });
          generalSection.appendChild(sources);
        }
        
        content.appendChild(generalSection);
        
        // Cultural/preparation information section
        const culturalSection = document.createElement('div');
        culturalSection.className = 'chipotle-info-section';
        
        const culturalTitle = document.createElement('h3');
        culturalTitle.className = 'chipotle-info-section-title';
        culturalTitle.textContent = `How it's prepared in ${country.charAt(0).toUpperCase() + country.slice(1)}`;
        
        const culturalContent = document.createElement('div');
        culturalContent.className = 'chipotle-info-section-content';
        culturalContent.textContent = data.cultural.answer;
        
        culturalSection.appendChild(culturalTitle);
        culturalSection.appendChild(culturalContent);
        
        // Add sources if available
        if (data.cultural.sources && data.cultural.sources.length > 0) {
          const sources = document.createElement('div');
          sources.className = 'chipotle-info-sources';
          sources.innerHTML = '<strong>Sources:</strong>';
          data.cultural.sources.forEach(source => {
            const sourceDiv = document.createElement('div');
            sourceDiv.className = 'chipotle-info-source';
            const link = document.createElement('a');
            link.href = source.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = source.title || source.url;
            sourceDiv.appendChild(link);
            sources.appendChild(sourceDiv);
          });
          culturalSection.appendChild(sources);
        }
        
        content.appendChild(culturalSection);
      }
    );
  }

  console.log('Chipotle Food Card Customizer loaded with persistent image support and food information');
})();

