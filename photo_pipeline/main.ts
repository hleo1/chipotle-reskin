import { generateFoodImages } from "./foodImages";
import { generateHeroSection } from "./heroSection";
import * as path from "node:path";

async function main() {
  // Array of config paths to process
  const configPaths = [
    // path.join(__dirname, "configs", "jamaican-food-config.json"),
    path.join(__dirname, "configs", "italian-food-config.json"),
    // path.join(__dirname, "configs", "bronx-food-config.json"),
    // path.join(__dirname, "configs", "chinese-food-config.json"),
    // path.join(__dirname, "configs", "english-food-config.json"),
    // path.join(__dirname, "configs", "brooklyn-food-config.json"),
  ];

  // Iterate through each config path
  for (const configPath of configPaths) {
    console.log(`\nProcessing config: ${configPath}`);
    
    // Generate food images first
    await generateFoodImages(configPath);
    
    // Then generate hero section
    await generateHeroSection(configPath);
  }

  console.log("\nAll configs processed!");
}

main();

