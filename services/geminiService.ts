
import { GoogleGenAI, Modality } from "@google/genai";
import { UploadedImage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

export const alignImages = async (
    companyNameImage: UploadedImage,
    logoImage: UploadedImage
): Promise<string> => {
    const companyNameImagePart = {
        inlineData: {
            data: companyNameImage.base64.split(',')[1],
            mimeType: companyNameImage.file.type,
        },
    };

    const logoImagePart = {
        inlineData: {
            data: logoImage.base64.split(',')[1],
            mimeType: logoImage.file.type,
        },
    };

    const textPart = {
        text: `
            Analyze the first image which contains a company name ('TACTICSO SECURITY') on a dark background.
            Analyze the second image which contains a logo on a transparent background.
            Your task is to take the logo from the second image and place it to the left of the company name in the first image.
            The final result should be a single, high-quality image that looks like a professional logo lockup.
            Ensure the logo and text are vertically centered and have appropriate spacing.
            The background of the final image must match the background of the first image exactly.
            Output only the final combined image.
        `,
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    textPart,
                    companyNameImagePart,
                    logoImagePart,
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const mimeType = part.inlineData.mimeType;
                    const base64Data = part.inlineData.data;
                    return `data:${mimeType};base64,${base64Data}`;
                }
            }
        }
        
        throw new Error("The AI did not return an image. Please try again.");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to align images with the AI service. Check the console for more details.");
    }
};
