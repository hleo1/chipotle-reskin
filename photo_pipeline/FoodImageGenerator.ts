import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

export type FoodItem = {
  fullName: string;
  shortName: string;
};

export class FoodImageGenerator {
  private countryName: string;
  private foodType: string;
  private ai: GoogleGenAI;
  private baseDir: string = "pictures";
  private foods: FoodItem[];
  private getPrompt: (food: FoodItem) => string;

  constructor(
    countryName: string,
    foodType: string,
    apiKey: string,
    foods: FoodItem[],
    getPrompt: (food: FoodItem) => string
  ) {
    this.countryName = countryName;
    this.foodType = foodType;
    this.ai = new GoogleGenAI({ apiKey });
    this.foods = foods;
    this.getPrompt = getPrompt;
  }

  private getOutputDir(): string {
    return path.join(this.baseDir, this.countryName, this.foodType);
  }

  private ensureOutputDir(): void {
    const outputDir = this.getOutputDir();
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  async generate(): Promise<void> {
    this.ensureOutputDir();

    for (const food of this.foods) {
      const prompt = this.getPrompt(food);
      
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
            if (part.text) {
              console.log(part.text);
            } else if (part.inlineData && part.inlineData.data) {
              const imageData = part.inlineData.data;
              const buffer = Buffer.from(imageData, "base64");
              const outputPath = path.join(this.getOutputDir(), `${food.shortName}.png`);
              fs.writeFileSync(outputPath, buffer);
              console.log(`Saved: ${outputPath}`);
            }
          }
        } else {
          console.error("No generated content found for", food.fullName);
        }
      } catch (error) {
        console.error(`Error generating image for ${food.fullName}:`, error);
      }
    }
  }
}

