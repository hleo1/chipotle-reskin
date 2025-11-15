import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

interface FoodItem {
  fullName: string;
  shortName: string;
}

interface FoodConfig {
  apiKey: string;
  country: string;
  categories: {
    foodType: string;
    items: FoodItem[];
    promptTemplate: string;
  }[];
}

interface HeroSectionConfig {
  configPath: string;
  outputDir: string;
}

export class HeroSectionGenerator {
  private ai: GoogleGenAI;
  private config: HeroSectionConfig;
  private foodConfig!: FoodConfig;

  constructor(config: HeroSectionConfig) {
    this.config = config;
    this.loadFoodConfig();
    this.ai = new GoogleGenAI({ apiKey: this.foodConfig.apiKey });
  }

  private loadFoodConfig(): void {
    const configFile = fs.readFileSync(this.config.configPath, "utf-8");
    this.foodConfig = JSON.parse(configFile);
  }

  private getCuisineName(): string {
    // Convert country code to cuisine name (e.g., "italian" -> "Italian")
    return this.foodConfig.country.charAt(0).toUpperCase() + this.foodConfig.country.slice(1);
  }

  private getCategoryItems(categoryType: string): FoodItem[] {
    const category = this.foodConfig.categories.find(cat => cat.foodType === categoryType);
    return category ? category.items : [];
  }

  private formatItemList(items: FoodItem[]): string {
    if (items.length === 0) return "";
    const validItems = items.filter((item): item is FoodItem => 
      item !== undefined && item !== null && item.fullName !== undefined
    );
    if (validItems.length === 0) return "";
    
    const names = validItems
      .map(item => item.fullName?.split(':')[0]?.trim())
      .filter((name): name is string => Boolean(name));
    if (names.length === 0) return "";
    if (names.length === 1) return names[0]!;
    if (names.length === 2) return `${names[0]!} or ${names[1]!}`;
    
    const last = names[names.length - 1];
    const others = names.slice(0, -1);
    return `${others.join(', ')}, or ${last!}`;
  }

  private ensureOutputDir(): void {
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }
  }

  // Generate the hero title text
  async generateTitle(): Promise<string> {
    const cuisineName = this.getCuisineName();
    const prompt = `Generate a short, catchy title (2-4 words maximum) for a ${this.foodConfig.country}-themed customizable meal builder. The title should replace "BUILD YOUR BURRITO BOWL" and should evoke ${cuisineName} cuisine. Examples: "BUILD YOUR ${cuisineName.toUpperCase()} BOWL", "CREATE YOUR ${cuisineName.toUpperCase()} PLATE", "CRAFT YOUR ${cuisineName.toUpperCase()} MEAL". Return only the title text, nothing else.`;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      if (
        response.candidates &&
        response.candidates[0] &&
        response.candidates[0].content &&
        response.candidates[0].content.parts
      ) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            const title = part.text.trim();
            console.log(`Generated title: ${title}`);
            return title;
          }
        }
      }
      throw new Error("No title generated");
    } catch (error) {
      console.error("Error generating title:", error);
      throw error;
    }
  }

  // Generate the hero description text
  async generateDescription(): Promise<string> {
    const cuisineName = this.getCuisineName();
    const proteins = this.getCategoryItems("protein-vegetable");
    const bases = this.getCategoryItems("rice");
    const beans = this.getCategoryItems("beans");
    const toppings = this.getCategoryItems("toppings");

    // Build a concise ingredient summary
    const ingredientSummary: string[] = [];
    if (proteins.length > 0) {
      const proteinList = this.formatItemList(proteins);
      ingredientSummary.push(proteinList);
    }
    if (bases.length > 0) {
      const baseList = this.formatItemList(bases);
      ingredientSummary.push(baseList);
    }
    if (beans.length > 0) {
      const beanList = this.formatItemList(beans);
      ingredientSummary.push(beanList);
    }
    if (toppings.length > 0) {
      const toppingList = this.formatItemList(toppings);
      ingredientSummary.push(toppingList);
    }

    const prompt = `Generate a concise, appetizing description (3-4 sentences maximum, approximately 50-80 words) for a ${this.foodConfig.country}-themed customizable meal builder. The description should replace the Chipotle burrito bowl description. 

Write in Chipotle's marketing style: short, punchy sentences; focus on freshness and quality; simple, direct language. Mention that customers can choose from ${ingredientSummary.join(', ')}. 

Keep it brief and appetizing - similar to how Chipotle describes their bowls: "Your choice of freshly grilled meat or sofritas served in a delicious bowl with rice, beans, or fajita veggies, and topped with guac, salsa, queso blanco, sour cream or cheese."

Return only the description text, nothing else.`;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      if (
        response.candidates &&
        response.candidates[0] &&
        response.candidates[0].content &&
        response.candidates[0].content.parts
      ) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            const description = part.text.trim();
            console.log(`Generated description: ${description}`);
            return description;
          }
        }
      }
      throw new Error("No description generated");
    } catch (error) {
      console.error("Error generating description:", error);
      throw error;
    }
  }

  // Generate the hero image
  async generateHeroImage(): Promise<void> {
    const cuisineName = this.getCuisineName();
    const proteins = this.getCategoryItems("protein-vegetable");
    const bases = this.getCategoryItems("rice");
    const beans = this.getCategoryItems("beans");
    const toppings = this.getCategoryItems("toppings");

    // Randomly select one item from each category
    const validBases = bases.filter((item): item is FoodItem => item !== undefined && item !== null && item.fullName !== undefined);
    const validProteins = proteins.filter((item): item is FoodItem => item !== undefined && item !== null && item.fullName !== undefined);
    const validBeans = beans.filter((item): item is FoodItem => item !== undefined && item !== null && item.fullName !== undefined);
    const validToppings = toppings.filter((item): item is FoodItem => item !== undefined && item !== null && item.fullName !== undefined);

    const selectedBase = validBases.length > 0 ? validBases[Math.floor(Math.random() * validBases.length)] : null;
    const selectedProtein = validProteins.length > 0 ? validProteins[Math.floor(Math.random() * validProteins.length)] : null;
    const selectedBean = validBeans.length > 0 ? validBeans[Math.floor(Math.random() * validBeans.length)] : null;
    const selectedTopping = validToppings.length > 0 ? validToppings[Math.floor(Math.random() * validToppings.length)] : null;

    console.log(`Selected ingredients for hero image:`);
    if (selectedBase) console.log(`  Base: ${selectedBase.fullName?.split(':')[0]?.trim()}`);
    if (selectedProtein) console.log(`  Protein: ${selectedProtein.fullName?.split(':')[0]?.trim()}`);
    if (selectedBean) console.log(`  Bean: ${selectedBean.fullName?.split(':')[0]?.trim()}`);
    if (selectedTopping) console.log(`  Topping: ${selectedTopping.fullName?.split(':')[0]?.trim()}`);

    // Build ingredient description
    const ingredients: string[] = [];
    if (selectedBase) {
      const baseName = selectedBase.fullName?.split(':')[0]?.trim() || '';
      if (baseName) ingredients.push(baseName);
    }
    if (selectedProtein) {
      const proteinName = selectedProtein.fullName?.split(':')[0]?.trim() || '';
      if (proteinName) ingredients.push(proteinName);
    }
    if (selectedBean) {
      const beanName = selectedBean.fullName?.split(':')[0]?.trim() || '';
      if (beanName) ingredients.push(beanName);
    }
    if (selectedTopping) {
      const toppingName = selectedTopping.fullName?.split(':')[0]?.trim() || '';
      if (toppingName) ingredients.push(toppingName);
    }

    const ingredientList = ingredients.join(', ');

    const prompt = `A strictly top-down, photorealistic view (shot from directly above) of an oval-shaped Chipotle-style cardboard bowl showcasing a customizable ${cuisineName} meal. The bowl must be perfectly centered both horizontally and vertically in the frame. The bowl should be a light brown cardboard container, wider than tall (horizontal orientation), with visible rounded edges characteristic of Chipotle's disposable bowls.

The bowl should be filled with ${cuisineName} ingredients arranged in distinct, visible layers from bottom to top:
- First layer (base): ${selectedBase?.fullName?.split(':')[0]?.trim() || 'rice'} as the foundation, covering the bottom of the bowl
- Second layer: ${selectedProtein?.fullName?.split(':')[0]?.trim() || 'protein'} arranged on top of the base, with visible char marks and seasoning
- Third layer: ${selectedBean?.fullName?.split(':')[0]?.trim() || 'beans'} layered on top, scattered but visible as a distinct layer
- Top layer: ${selectedTopping?.fullName?.split(':')[0]?.trim() || 'topping'} prominently placed on top, serving as a focal point

The ingredients should be clearly layered with each layer visible and distinct, not mixed together. The layers should be arranged in an appetizing, organized manner with natural texture variations within each layer. The arrangement should look appetizing and authentic, similar to how Chipotle serves their bowls.

The background must be completely pure white extending to all edges and sides of the image. The bowl itself may have minimal, soft shadows directly beneath it for depth, but the background must remain pure white with no gradients, no shadows, no variations. White sides, white edges, pure white background throughout.

The lighting should be bright and appetizing, highlighting the freshness and colors of the ingredients. The overall aesthetic should match Chipotle's bowl presentation style - organized, appetizing, and authentic ${cuisineName} cuisine.`;

    this.ensureOutputDir();

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });

      if (
        response.candidates &&
        response.candidates[0] &&
        response.candidates[0].content &&
        response.candidates[0].content.parts
      ) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const imageData = part.inlineData.data;
            const buffer = Buffer.from(imageData, "base64");
            const outputPath = path.join(this.config.outputDir, "hero-image.png");
            fs.writeFileSync(outputPath, buffer);
            console.log(`Saved hero image: ${outputPath}`);
            return;
          }
        }
      }
      throw new Error("No image generated");
    } catch (error) {
      console.error("Error generating hero image:", error);
      throw error;
    }
  }

  // Save title and description to a JSON file
  async saveTextContent(title: string, description: string): Promise<void> {
    this.ensureOutputDir();
    const content = {
      title,
      description,
    };
    const outputPath = path.join(this.config.outputDir, "hero-content.json");
    fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));
    console.log(`Saved hero content: ${outputPath}`);
  }

  // Generate all hero section content
  async generateAll(): Promise<void> {
    console.log("Generating hero section title...");
    const title = await this.generateTitle();

    console.log("Generating hero section description...");
    const description = await this.generateDescription();

    console.log("Generating hero section image...");
    await this.generateHeroImage();

    console.log("Saving text content...");
    await this.saveTextContent(title, description);

    console.log("Hero section generation complete!");
  }
}

async function main() {
  const configPath = path.join(__dirname, "food-config.json");
  
  // Load config to get country name
  const configFile = fs.readFileSync(configPath, "utf-8");
  const config: FoodConfig = JSON.parse(configFile);
  
  // Create output directory with country name
  const outputDir = path.join(__dirname, "hero-section", config.country);

  const generator = new HeroSectionGenerator({
    configPath,
    outputDir,
  });

  await generator.generateAll();
}

main();

