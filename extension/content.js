// Chipotle Food Card Customizer
// This script replaces food cards on Chipotle's website with custom images and names

(function() {
  'use strict';

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

  // Inject CSS to override background images with !important
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
    `;
    document.head.appendChild(style);
  }

  // Helper function to update a card with new image and name
  function updateCard(card, imageUrl, newName) {
    // Store custom image URL in data attribute and WeakMap for persistence
    card.setAttribute('data-custom-image', imageUrl);
    customCards.set(card, { imageUrl, name: newName });

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
        updateCard(card, imageUrl, foodItem.name);
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

  // Remove unwanted sections
  removeUnwantedSections();

  // Initial replacement
  replaceFoodCards();

  // Watch for dynamically loaded content and style changes
  const observer = new MutationObserver((mutations) => {
    let shouldReplace = false;
    
    mutations.forEach(mutation => {
      // Watch for new nodes
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldReplace = true;
      }
      // Watch for style attribute changes on custom cards
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'style' && 
          mutation.target.hasAttribute('data-custom-image')) {
        // Re-apply immediately when style is changed
        reapplyCustomImages();
      }
    });
    
    if (shouldReplace) {
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
        attributeFilter: ['style']
      });
    });
  } else {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });
  }

  // Re-apply custom images more frequently to combat Chipotle's resets
  setInterval(reapplyCustomImages, 500);
  
  // Also run replacement periodically for heavy SPAs
  setInterval(() => {
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

  console.log('Chipotle Food Card Customizer loaded with persistent image support');
})();

