
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

// Base encoding/decoding helper
export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const API_KEY = process.env.API_KEY || '';

export const getGeminiPro = () => new GoogleGenAI({ apiKey: API_KEY });

// 1. Intelligent Chat with Search Grounding
export async function getIntelligentResponse(prompt: string) {
  const ai = getGeminiPro();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "Tu es l'assistant intelligent de WANZCORP. Ton rôle est de conseiller les clients sur les technologies informatiques, le développement web/mobile et les services de WANZCORP. Utilise Google Search pour des infos à jour.",
    },
  });
  return {
    text: response.text || "Je n'ai pas pu générer de réponse.",
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })).filter((c: any) => c.title && c.uri) || []
  };
}

// 2. Image Analysis
export async function analyzeImage(base64Image: string, prompt: string) {
  const ai = getGeminiPro();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    },
    config: {
      systemInstruction: "Analyse cette image ou capture d'écran pour donner des conseils techniques pertinents dans le contexte de WANZCORP."
    }
  });
  return response.text;
}

// 3. Fast Response (Flash Lite)
export async function getQuickAdvice(prompt: string) {
  const ai = getGeminiPro();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: prompt,
    config: {
      systemInstruction: "Donne une réponse très courte et technique."
    }
  });
  return response.text;
}

// 4. TTS
export async function generateSpeech(text: string, voice: string = 'Kore') {
  const ai = getGeminiPro();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}
