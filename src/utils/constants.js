// src/utils/constants.js
export const API_KEY = process.env.ApiKeyGeminiDev;

export const API_URLS = {
  text: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`,
  image: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${API_KEY}`
};

export const TEMPLATES = [
  { templateName: "Insta 01", width: 1080 / 2, height: 1350 / 2 },
  { templateName: "Insta 02", width: 1080 / 2, height: 1080 / 2 }
];