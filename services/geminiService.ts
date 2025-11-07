
import { GoogleGenAI } from "@google/genai";
import type { Answer } from '../types';

const PRODUCT_INFO = `
"Pep Tonic" is a health drink designed to revitalize the body and mind.
- Revitalizes Aging Cells: Activates autophagy to clear out "zombie cells" that cause fatigue.
- Supercharges Energy Production: Recharges mitochondria for sustained energy without crashes.
- Nourishes Your Entire Body: Contains over 50 fruits, vegetables, prebiotics, and superfoods.
- Expected Benefits: More energy within days, a clearer mind, faster physical recovery, better sleep and digestion, and a stronger immune system.
- Key Ingredients: Puremidine® (cell renewal), MitoPrime® (mitochondrial protection), Quercetin (anti-inflammatory), Fiber Blend, and over 50 superfoods.
`;

export const generateMotivationalMessage = async (answers: Answer[]): Promise<string> => {
    if (!process.env.API_KEY) {
        console.warn("API_KEY is not set. Returning a mock response.");
        return new Promise(resolve => setTimeout(() => resolve(
`Thank you for sharing your experience. It sounds like you're ready to boost your energy and feel your best. The great news is there's a path forward to reclaim your vitality. Discover how a targeted approach can help you feel revitalized from the inside out.`), 1000));
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const formattedAnswers = answers.map(a => `- ${a.question}\n  Answer: ${a.answer}`).join('\n');

    const prompt = `
    You are a friendly and motivational wellness advisor. A user has just completed a survey about their vitality. Their answers are:
    ${formattedAnswers}

    Based on their answers and the following information about the product "Pep Tonic", generate a concise (1 paragraph, around 50-70 words), positive, and motivational message. The message must:
    1. Subtly acknowledge their potential difficulties (without being negative or alarmist) based on their answers.
    2. Connect those difficulties with the benefits of a solution like Pep Tonic in a hopeful way.
    3. DO NOT give medical advice, diagnoses, or use overly technical language.
    4. Maintain an inspiring and encouraging tone.
    5. Do not promise results, but suggest there is a potential solution to explore.
    6. The message must be in English.

    Pep Tonic Product Information:
    ${PRODUCT_INFO}

    Example tone: "Thank you for sharing. It's common to feel that your energy isn't what it used to be. The great thing is that there are ways to support your body in regaining its vitality..."
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate motivational message from Gemini.");
    }
};