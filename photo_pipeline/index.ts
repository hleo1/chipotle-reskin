import { FoodImageGenerator, type FoodItem } from "./FoodImageGenerator";
import * as fs from "node:fs";
import * as path from "node:path";

// Type-safe food types based on food-config.json
type FoodType = "rice" | "protein-vegetable" | "beans" | "toppings";

interface FoodConfig {
  apiKey: string;
  country: string;
  categories: {
    foodType: FoodType;
    items: FoodItem[];
    promptTemplate: string;
  }[];
}

// Create a prompt function from a template string
function createPromptFunction(template: string): (food: FoodItem) => string {
  return (food: FoodItem) => {
    return template.replace(/\{\{fullName\}\}/g, food.fullName);
  };
}

async function main() {
  // Read and parse the JSON config file
  const configPath = path.join(__dirname, "food-config.json");
  const configFile = fs.readFileSync(configPath, "utf-8");
  const config: FoodConfig = JSON.parse(configFile);

  // Create generators for each category
  const generators = config.categories.map((category) => {
    const promptFunction = createPromptFunction(category.promptTemplate);
    
    return new FoodImageGenerator(
      config.country,
      category.foodType,
      config.apiKey,
      category.items,
      promptFunction
    );
  });

  // Generate images for each category
  for (let i = 0; i < generators.length; i++) {
    const generator = generators[i];
    const category = config.categories[i];
    
    if (generator && category) {
      console.log(`Generating ${config.country} ${category.foodType} images...`);
      await generator.generate();
    }
  }

  console.log("All images generated!");
}

main();