import { GoogleGenerativeAI } from "@google/generative-ai";
import { text } from "stream/consumers";

class GeminiApiService {
  private genAI: GoogleGenerativeAI;
  private readonly key: string;
  private readonly prompt: string;

  constructor() {
    this.key = process.env.GEMINI_API_KEY!;
    this.genAI = new GoogleGenerativeAI(this.key);
    this.prompt =
      "Analyze the provided image and extract the numeric value from the meter reading. The image shows a water or gas meter. Ensure to accurately identify the measurement from the image. Provide the extracted value in the response (value in cubic meters). Very importan: show only numbers)";
  }

  public async analyzeImage(base64Img: string): Promise<string | any> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const generatedContent = await model.generateContent([
        this.prompt,
        base64Img,
      ]);

      console.log(generatedContent.response.text());

      const text = generatedContent.response.text() ?? "";
      const match = text.match(/\d+/);
      let number;

      if (match && match[0]) {
        number = Number(match[0]);
        return { value: number, error: null };
      } else {
        return {
          value: null,
          error: "Failed to analyze the image. Please try again later.",
        };
      }
    } catch (error) {
      return {
        value: null,
        error:
          "The service is temporarily unavailable. This may be due to maintenance, high load, or internal server issues. Please try again later or contact support if the problem persists.",
      };
    }
  }
}

export default new GeminiApiService();
