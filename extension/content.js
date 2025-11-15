// Chipotle Food Card Customizer
// This script replaces food cards on Chipotle's website with custom images and names

(function() {
  'use strict';

  // Cuisine configurations
  const CUISINE_CONFIGS = {
    italian: {
      hero: {
        title: "Your Italian Piatto",
        description: "Build your ideal Italian bowl with your choice of Pollo Arrosto, Stracotto di Manzo, Salsiccia e Peperoni, Gamberetti Aglio e Olio, or Melanzane e Funghi. Served with creamy Risotto or Polenta, alongside Fagioli Cannellini or Borlotti Beans. Finish it your way with fresh Bruschetta Topping, authentic Parmigiano Reggiano, vibrant Peperonata, or rich Pesto alla Genovese.",
        image: 'hero-section/italian/hero-image.png'
      },
      foodItems: {
        'protein-or-veggie': [
          { image: 'italian/protein-vegetable/braised-beef-stracotto.png', name: 'Beef Stracotto' },
          { image: 'italian/protein-vegetable/eggplant-mushroom.png', name: 'Eggplant Mushroom' },
          { image: 'italian/protein-vegetable/garlic-shrimp.png', name: 'Garlic Shrimp' },
          { image: 'italian/protein-vegetable/herbed-chicken.png', name: 'Herbed Chicken' },
          { image: 'italian/protein-vegetable/sausage-peppers.png', name: 'Sausage Peppers' }
        ],
        'rice': [
          { image: 'italian/rice/polenta.png', name: 'Polenta' },
          { image: 'italian/rice/risotto.png', name: 'Risotto' }
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
      }
    },
    chinese: {
      hero: {
        title: "Craft Your Wok",
        description: "Your personalized Chinese bowl, crafted with fresh ingredients. Choose from savory General Tso's, Kung Pao Chicken, Sweet and Sour Pork, Mapo Tofu, or Beef and Broccoli. Pair with Steamed White or Fried Rice, then finish with Edamame or Black Bean Sauce, Soy Sauce, Chili Oil, Hoisin, or Duck Sauce. Fresh, flavorful, and all yours.",
        image: 'hero-section/chinese/hero-image.png'
      },
      foodItems: {
        'protein-or-veggie': [
          { image: 'chinese/protein-vegetable/general-tso-chicken.png', name: "General Tso's Chicken" },
          { image: 'chinese/protein-vegetable/kung-pao-chicken.png', name: 'Kung Pao Chicken' },
          { image: 'chinese/protein-vegetable/sweet-sour-pork.png', name: 'Sweet and Sour Pork' },
          { image: 'chinese/protein-vegetable/mapo-tofu.png', name: 'Mapo Tofu' },
          { image: 'chinese/protein-vegetable/beef-broccoli.png', name: 'Beef and Broccoli' }
        ],
        'rice': [
          { image: 'chinese/rice/steamed-rice.png', name: 'Steamed Rice' },
          { image: 'chinese/rice/fried-rice.png', name: 'Fried Rice' }
        ],
        'beans': [
          { image: 'chinese/beans/edamame.png', name: 'Edamame' },
          { image: 'chinese/beans/black-bean-sauce.png', name: 'Black Bean Sauce' }
        ],
        'toppings': [
          { image: 'chinese/toppings/soy-sauce.png', name: 'Soy Sauce' },
          { image: 'chinese/toppings/chili-oil.png', name: 'Chili Oil' },
          { image: 'chinese/toppings/hoisin-sauce.png', name: 'Hoisin Sauce' },
          { image: 'chinese/toppings/duck-sauce.png', name: 'Duck Sauce' }
        ]
      }
    },
    bronx: {
      hero: {
        title: "Boogie Down Bowl",
        description: "Craft your perfect Bronx Plate. Choose from savory Fried Chicken, tender BBQ Ribs, Collard Greens with Smoked Turkey, creamy Mac and Cheese, or crispy Fried Catfish. Add your choice of Dirty Rice or Jambalaya Rice, plus Black-Eyed Peas or Red Beans. Top it all with Hot Sauce, BBQ Sauce, Honey Mustard, or Ranch for a taste that's all your own.",
        image: 'hero-section/bronx/hero-image.png'
      },
      foodItems: {
        'protein-or-veggie': [
          { image: 'bronx/protein-vegetable/fried-chicken.png', name: 'Fried Chicken' },
          { image: 'bronx/protein-vegetable/bbq-ribs.png', name: 'BBQ Ribs' },
          { image: 'bronx/protein-vegetable/collard-greens-turkey.png', name: 'Collard Greens with Turkey' },
          { image: 'bronx/protein-vegetable/mac-cheese.png', name: 'Mac and Cheese' },
          { image: 'bronx/protein-vegetable/fried-catfish.png', name: 'Fried Catfish' }
        ],
        'rice': [
          { image: 'bronx/rice/dirty-rice.png', name: 'Dirty Rice' },
          { image: 'bronx/rice/jambalaya-rice.png', name: 'Jambalaya Rice' }
        ],
        'beans': [
          { image: 'bronx/beans/black-eyed-peas.png', name: 'Black-Eyed Peas' },
          { image: 'bronx/beans/red-beans.png', name: 'Red Beans' }
        ],
        'toppings': [
          { image: 'bronx/toppings/hot-sauce.png', name: 'Hot Sauce' },
          { image: 'bronx/toppings/bbq-sauce.png', name: 'BBQ Sauce' },
          { image: 'bronx/toppings/honey-mustard.png', name: 'Honey Mustard' },
          { image: 'bronx/toppings/ranch-dressing.png', name: 'Ranch Dressing' }
        ]
      }
    },
    brooklyn: {
      hero: {
        title: "Brooklyn Street Eats",
        description: "Build your Brooklyn bowl with your choice of freshly prepared Soul Food Fried Chicken, Smothered Pork Chops, Oxtails, or Fried Whiting. Pair it with Yellow Rice or classic Rice and Gravy, plus Black Beans and Rice or Red Beans. Add sweet Candied Yams for a perfect touch. Finish your custom creation with Hot Sauce, BBQ, Tartar, or Honey Hot.",
        image: 'hero-section/brooklyn/hero-image.png'
      },
      foodItems: {
        'protein-or-veggie': [
          { image: 'brooklyn/protein-vegetable/soul-fried-chicken.png', name: 'Soul Food Fried Chicken' },
          { image: 'brooklyn/protein-vegetable/smothered-pork-chops.png', name: 'Smothered Pork Chops' },
          { image: 'brooklyn/protein-vegetable/oxtails.png', name: 'Oxtails' },
          { image: 'brooklyn/protein-vegetable/candied-yams.png', name: 'Candied Yams' },
          { image: 'brooklyn/protein-vegetable/fried-whiting.png', name: 'Fried Whiting' }
        ],
        'rice': [
          { image: 'brooklyn/rice/yellow-rice.png', name: 'Yellow Rice' },
          { image: 'brooklyn/rice/rice-gravy.png', name: 'Rice and Gravy' }
        ],
        'beans': [
          { image: 'brooklyn/beans/black-beans-rice.png', name: 'Black Beans and Rice' },
          { image: 'brooklyn/beans/red-beans.png', name: 'Red Beans' }
        ],
        'toppings': [
          { image: 'brooklyn/toppings/hot-sauce.png', name: 'Hot Sauce' },
          { image: 'brooklyn/toppings/bbq-sauce.png', name: 'BBQ Sauce' },
          { image: 'brooklyn/toppings/tartar-sauce.png', name: 'Tartar Sauce' },
          { image: 'brooklyn/toppings/honey-hot-sauce.png', name: 'Honey Hot Sauce' }
        ]
      }
    },
    english: {
      hero: {
        title: "Craft English Fare",
        description: "Your choice of classic English mains: Fish and Chips, Bangers and Mash, Roast Beef, Shepherd's Pie, or Chicken Tikka Masala. Served in a delicious bowl with your pick of Mashed or Roasted Potatoes, plus Baked Beans or Mushy Peas. Top it off with HP Sauce, Malt Vinegar, Brown Gravy, or Mint Sauce for your perfect custom creation.",
        image: 'hero-section/english/hero-image.png'
      },
      foodItems: {
        'protein-or-veggie': [
          { image: 'english/protein-vegetable/fish-chips.png', name: 'Fish and Chips' },
          { image: 'english/protein-vegetable/bangers-mash.png', name: 'Bangers and Mash' },
          { image: 'english/protein-vegetable/roast-beef.png', name: 'Roast Beef' },
          { image: 'english/protein-vegetable/shepherds-pie.png', name: "Shepherd's Pie" },
          { image: 'english/protein-vegetable/chicken-tikka-masala.png', name: 'Chicken Tikka Masala' }
        ],
        'rice': [
          { image: 'english/rice/mashed-potatoes.png', name: 'Mashed Potatoes' },
          { image: 'english/rice/roasted-potatoes.png', name: 'Roasted Potatoes' }
        ],
        'beans': [
          { image: 'english/beans/baked-beans.png', name: 'Baked Beans' },
          { image: 'english/beans/mushy-peas.png', name: 'Mushy Peas' }
        ],
        'toppings': [
          { image: 'english/toppings/brown-gravy.png', name: 'Brown Gravy' },
          { image: 'english/toppings/hp-sauce.png', name: 'HP Sauce' },
          { image: 'english/toppings/malt-vinegar.png', name: 'Malt Vinegar' },
          { image: 'english/toppings/mint-sauce.png', name: 'Mint Sauce' }
        ]
      }
    },
    jamaican: {
      hero: {
        title: "Your Yaad Plate",
        description: "Your choice of savory Jerk Chicken, tender Curry Goat, Brown Stew, Oxtail, or Ackee and Saltfish, served in a vibrant bowl with Jasmine (Rice and Peas) or Coconut Rice and Red Kidney or Black Beans. Top it with fiery Scotch Bonnet sauce, sweet Fried Plantains, crisp Pickled Cabbage, or our signature Jerk sauce. Experience bold, fresh Jamaican flavors, custom-built just for you.",
        image: 'hero-section/jamaican/hero-image.png'
      },
      foodItems: {
        'protein-or-veggie': [
          { image: 'jamaican/protein-vegetable/jerk-chicken.png', name: 'Jerk Chicken' },
          { image: 'jamaican/protein-vegetable/curry-goat.png', name: 'Curry Goat' },
          { image: 'jamaican/protein-vegetable/brown-stew-chicken.png', name: 'Brown Stew Chicken' },
          { image: 'jamaican/protein-vegetable/oxtail.png', name: 'Oxtail' },
          { image: 'jamaican/protein-vegetable/ackee-saltfish.png', name: 'Ackee and Saltfish' }
        ],
        'rice': [
          { image: 'jamaican/rice/jasmine-rice.png', name: 'Jasmine Rice' },
          { image: 'jamaican/rice/coconut-rice.png', name: 'Coconut Rice' }
        ],
        'beans': [
          { image: 'jamaican/beans/black-beans.png', name: 'Black Beans' },
          { image: 'jamaican/beans/red-kidney-beans.png', name: 'Red Kidney Beans' }
        ],
        'toppings': [
          { image: 'jamaican/toppings/fried-plantains.png', name: 'Fried Plantains' },
          { image: 'jamaican/toppings/jerk-sauce.png', name: 'Jerk Sauce' },
          { image: 'jamaican/toppings/pickled-cabbage.png', name: 'Pickled Cabbage' },
          { image: 'jamaican/toppings/scotch-bonnet-sauce.png', name: 'Scotch Bonnet Sauce' }
        ]
      }
    }
  };

  // Current cuisine (default to italian)
  let currentCuisine = 'italian';
  let HERO_SECTION = CUISINE_CONFIGS[currentCuisine].hero;
  let FOOD_ITEMS_BY_SECTION = CUISINE_CONFIGS[currentCuisine].foodItems;
  
  // Video element reference
  let avatarVideo = null;

  // Track custom cards to persist their images
  let customCards = new WeakMap();

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
      
      /* Cuisine dropdown styles */
      .chipotle-cuisine-selector {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10001;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 8px 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .chipotle-cuisine-selector label {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        white-space: nowrap;
      }
      
      .chipotle-cuisine-selector select {
        padding: 6px 10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        background: white;
        color: #333;
        cursor: pointer;
        outline: none;
        transition: border-color 0.2s ease;
        min-width: 140px;
      }
      
      .chipotle-cuisine-selector select:hover {
        border-color: #999;
      }
      
      .chipotle-cuisine-selector select:focus {
        border-color: #0066cc;
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
      }
      
      /* Video styles */
      .chipotle-top-video {
        position: fixed;
        top: 180px;
        left: 0;
        z-index: 10000;
        width: 175px;
        height: 175px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        background-color: #000;
      }
      
      .chipotle-top-video video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
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
  function updateCard(card, imageUrl, newName, imagePath, sectionName = null) {
    // Store custom image URL in data attribute and WeakMap for persistence
    card.setAttribute('data-custom-image', imageUrl);
    const country = extractCountryFromImagePath(imagePath);
    customCards.set(card, { imageUrl, name: newName, country, imagePath });

    // Use setProperty with !important flag for maximum persistence
    card.style.setProperty('background-image', `url(${imageUrl})`, 'important');
    
    // Also set CSS custom property as backup
    card.style.setProperty('--custom-bg-image', `url(${imageUrl})`, 'important');

    // Add data-item attribute for voice system
    card.setAttribute('data-item', newName);

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
    // Map section names for voice system
    const sectionMap = {
      'protein-or-veggie': 'protein',
      'rice': 'rice',
      'beans': 'beans',
      'toppings': 'toppings'
    };
    const voiceSectionName = sectionMap[sectionName] || sectionName;
    
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

    // Add data-section attribute for voice system
    section.setAttribute('data-section', voiceSectionName);
    
    // Add data-cuisine attribute to section for voice system
    section.setAttribute('data-cuisine', currentCuisine);

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
        updateCard(card, imageUrl, foodItem.name, foodItem.image, voiceSectionName);
      } else {
        // Ensure data-item attribute is set
        card.setAttribute('data-item', foodItem.name);
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

  // Function to create/update video avatar
  function createVideoAvatar() {
    // Remove existing video if present
    const existingVideo = document.querySelector('.chipotle-top-video');
    if (existingVideo) {
      existingVideo.remove();
    }
    
    // Only create video for cuisines that have videos
    const cuisinesWithVideos = ['bronx', 'chinese', 'italian'];
    if (!cuisinesWithVideos.includes(currentCuisine)) {
      return;
    }
    
    // Create video container
    const videoContainer = document.createElement('div');
    videoContainer.className = 'chipotle-top-video';
    
    // Create video element
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.loop = false;
    
    // Set source to smiling.mp4 for current cuisine
    const videoUrl = chrome.runtime.getURL(`videos/${currentCuisine}/smiling.mp4`);
    video.src = videoUrl;
    
    // Load first frame but don't autoplay
    video.load();
    
    // Store reference
    avatarVideo = video;
    
    videoContainer.appendChild(video);
    document.body.appendChild(videoContainer);
    
    console.log(`Video avatar created for ${currentCuisine}`);
  }
  
  // Function to update video source when cuisine changes
  function updateVideoAvatar() {
    const cuisinesWithVideos = ['bronx', 'chinese', 'italian'];
    if (!cuisinesWithVideos.includes(currentCuisine)) {
      // Remove video if cuisine doesn't have videos
      const existingVideo = document.querySelector('.chipotle-top-video');
      if (existingVideo) {
        existingVideo.remove();
        avatarVideo = null;
      }
      return;
    }
    
    if (avatarVideo) {
      const videoUrl = chrome.runtime.getURL(`videos/${currentCuisine}/smiling.mp4`);
      avatarVideo.src = videoUrl;
      avatarVideo.load();
      avatarVideo.currentTime = 0;
      avatarVideo.pause();
    } else {
      createVideoAvatar();
    }
  }
  
  // Function to switch cuisine
  function switchCuisine(newCuisine) {
    if (!CUISINE_CONFIGS[newCuisine]) {
      console.error(`Invalid cuisine: ${newCuisine}`);
      return;
    }
    
    currentCuisine = newCuisine;
    HERO_SECTION = CUISINE_CONFIGS[currentCuisine].hero;
    FOOD_ITEMS_BY_SECTION = CUISINE_CONFIGS[currentCuisine].foodItems;
    
    // Save to storage
    chrome.storage.local.set({ selectedCuisine: currentCuisine });
    
    // Update dropdown value
    const select = document.getElementById('chipotle-cuisine-select');
    if (select) {
      select.value = currentCuisine;
    }
    
    // Update data-cuisine attribute on body for voice system
    document.body.setAttribute('data-cuisine', currentCuisine);
    
    // Update data-cuisine on all sections
    document.querySelectorAll('[data-section]').forEach(section => {
      section.setAttribute('data-cuisine', currentCuisine);
    });
    
    // Update video avatar
    updateVideoAvatar();
    
    // Clear custom cards to force re-render
    customCards = new WeakMap();
    
    // Reset hero section to allow re-customization
    const header = document.querySelector('.meal-builder-header');
    if (header) {
      header.removeAttribute('data-custom-hero');
    }
    
    // Clear all custom image attributes
    document.querySelectorAll('[data-custom-image]').forEach(card => {
      card.removeAttribute('data-custom-image');
    });
    
    // Re-apply everything
    replaceHeroSection();
    replaceFoodCards();
    
    console.log(`Switched to ${currentCuisine} cuisine`);
  }

  // Function to create cuisine dropdown
  function createCuisineDropdown() {
    // Remove existing dropdown if present
    const existing = document.querySelector('.chipotle-cuisine-selector');
    if (existing) {
      return; // Already exists, don't recreate
    }
    
    // Wait for body to be available
    if (!document.body) {
      setTimeout(createCuisineDropdown, 100);
      return;
    }
    
    const selector = document.createElement('div');
    selector.className = 'chipotle-cuisine-selector';
    
    const label = document.createElement('label');
    label.textContent = 'Cuisine:';
    label.setAttribute('for', 'chipotle-cuisine-select');
    
    const select = document.createElement('select');
    select.id = 'chipotle-cuisine-select';
    
    // Add all cuisine options
    const cuisines = [
      { value: 'italian', label: 'Italian' },
      { value: 'chinese', label: 'Chinese' },
      { value: 'bronx', label: 'Bronx' },
      { value: 'brooklyn', label: 'Brooklyn' },
      { value: 'english', label: 'English' },
      { value: 'jamaican', label: 'Jamaican' }
    ];
    
    cuisines.forEach(cuisine => {
      const option = document.createElement('option');
      option.value = cuisine.value;
      option.textContent = cuisine.label;
      select.appendChild(option);
    });
    
    select.value = currentCuisine;
    
    select.addEventListener('change', (e) => {
      switchCuisine(e.target.value);
    });
    
    selector.appendChild(label);
    selector.appendChild(select);
    document.body.appendChild(selector);
  }

  // Function to load saved cuisine preference
  function loadCuisinePreference() {
    chrome.storage.local.get('selectedCuisine', (result) => {
      if (result.selectedCuisine && CUISINE_CONFIGS[result.selectedCuisine]) {
        currentCuisine = result.selectedCuisine;
        HERO_SECTION = CUISINE_CONFIGS[currentCuisine].hero;
        FOOD_ITEMS_BY_SECTION = CUISINE_CONFIGS[currentCuisine].foodItems;
      }
      // Set data-cuisine attribute on body for voice system
      if (document.body) {
        document.body.setAttribute('data-cuisine', currentCuisine);
        // Create video avatar after cuisine is loaded
        setTimeout(() => {
          createVideoAvatar();
        }, 100);
      }
      createCuisineDropdown();
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
    
    // Update heading based on cuisine title format
    const titleLower = HERO_SECTION.title.toLowerCase();
    let headingText = 'BUILD YOUR';
    let nameText = HERO_SECTION.title;
    
    if (titleLower.startsWith('craft your')) {
      headingText = 'CRAFT YOUR';
      nameText = HERO_SECTION.title.split(' ').slice(2).join(' ');
    } else if (titleLower.startsWith('your')) {
      headingText = 'BUILD YOUR';
      nameText = HERO_SECTION.title.split(' ').slice(1).join(' ');
    } else if (titleLower.startsWith('craft')) {
      headingText = 'CRAFT YOUR';
      nameText = HERO_SECTION.title.split(' ').slice(1).join(' ');
    } else {
      // For titles like "Boogie Down Bowl" or "Brooklyn Street Eats", use full title
      headingText = 'BUILD YOUR';
      nameText = HERO_SECTION.title;
    }
    
    if (heading && heading.textContent.trim() !== headingText) {
      heading.textContent = headingText;
      console.log('Updated hero heading');
    }
    
    if (name && name.textContent.trim() !== nameText) {
      name.textContent = nameText;
      console.log('Updated hero title');
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

  // Load saved cuisine preference and create dropdown
  loadCuisinePreference();
  
  // Set initial data-cuisine attribute on body for voice system
  if (document.body) {
    document.body.setAttribute('data-cuisine', currentCuisine);
    // Create video avatar after body is ready
    setTimeout(() => {
      createVideoAvatar();
    }, 100);
  }

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

