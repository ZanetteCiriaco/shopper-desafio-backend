import {
  GoogleAIFileManager,
  UploadFileResponse,
} from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import * as path from "path";

class GeminiApiService {
  private genAI: GoogleGenerativeAI;
  private fileManager: GoogleAIFileManager;
  private readonly key: string = process.env.GEMINI_API_KEY!;
  private readonly prompt: string =
    "Analyze the provided image and extract the numeric value from the meter reading. The image shows a water or gas meter. Ensure to accurately identify the measurement from the image. Provide the extracted value in the response (value in cubic meters). Very importan: show only numbers)";

  constructor() {
    this.genAI = new GoogleGenerativeAI(this.key);
    this.fileManager = new GoogleAIFileManager(this.key);
  }

  private saveBase64ToFile(base64String: string, mimeType: string): string {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");
    const tempFilePath = path.join(
      __dirname,
      "temp_image." + mimeType.split("/")[1]
    );
    fs.writeFileSync(tempFilePath, imageBuffer);

    return tempFilePath;
  }
  public async uploadImage(
    base64String: string,
    displayName: string
  ): Promise<UploadFileResponse> {
    const mimeTypeMatch = base64String.match(/^data:(image\/\w+);base64,/);

    if (!mimeTypeMatch) {
      throw new Error("Invalid base64 image string");
    }

    const mimeType = mimeTypeMatch[1];

    const filePath = this.saveBase64ToFile(base64String, mimeType);

    const uploadResponse = await this.fileManager.uploadFile(filePath, {
      mimeType,
      displayName,
    });

    fs.unlinkSync(filePath);

    return uploadResponse;
  }

  public async analyzeImage(
    mimeType: string,
    uri: string
  ): Promise<string | any> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const generatedContent = await model.generateContent([
        {
          fileData: {
            mimeType: mimeType,
            fileUri: uri,
          },
        },
        { text: this.prompt },
      ]);

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
