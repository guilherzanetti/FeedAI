import { API_URLS } from "../utils/constants";


async function fetchAndProcessText(url, prompt) {
    const data = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('Erro na API de texto:', error);
        return null;
    }
}

async function getAiImagePromptResponse() {
    const prompt = `Gere um único prompt para criação de imagem de background para capa na dimensão 1080x1350px sem texto com base nisso: ${AIwrite}`;
    promptDeImg = await fetchAndProcessText(apiTextUrl, prompt);
    console.log('Resposta da API geração de :', promptDeImg);
}


const geminiService = {
    

}