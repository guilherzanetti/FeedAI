import { API_URLS } from "../utils/constants.js";

// Funções de chamada à API

const apiTextUrl = API_URLS.text;
// const apiImageUrl = API_URLS.IMAGE_API;

// Variável de usuário
var user = {
    nome: "",
    publicoAlvo: "",
    objetivo: ""
};

// Variáveis globais
var AIwrite = "";
var AIimage = "";
var promptDeImg = "";


const geminiServiceAPI = {
    async getAiTextResponse() {
        const prompt = `Gere apenas 1 frase curta e impactante para a empresa ${user.nome}, no estilo de chamada para redes sociais, relacionada ao publico-alvo: ${user.publicoAlvo} e objetivo: ${user.objetivo}. A frase deve ser direta, instigante e profissional — sem explicações ou texto adicional, sem negrito ou decorações no texto. Apenas a frase mas adapte ao nicho`;
        AIwrite = await fetchAndProcessText(apiTextUrl, prompt);
        // templates[0].title = AIwrite;
        // templates[1].title = AIwrite;
        console.log('Resposta da API de texto:', AIwrite);
    },

    async getAiSubTitleResponse() {
        const prompt = `Gere apenas 1 subtitulo com base nesse titulo ${AIwrite} a e impactante para a empresa ${user.nome}, no estilo de chamada para redes sociais, relacionada ao publico-alvo: ${user.publicoAlvo} e objetivo: ${user.objetivo}. A frase deve ser direta, instigante e profissional e não pode ser genérica — sem explicações ou texto adicional, sem negrito ou decorações no texto. Apenas a frase mas adapte ao nicho`;
        const subTitleText = await fetchAndProcessText(apiTextUrl, prompt);
        // templates[0].subTitle = subTitleText;
        // templates[1].subTitle = subTitleText;
        console.log('Resposta da API de texto:', subTitleText);
    },

    async getAiImageResponse() {
        const prompt = `Gere uma imagem: ${promptDeImg}`;

        const data = {
            "contents": [{
                "parts": [
                    { "text": prompt }
                ]
            }],
            "generationConfig": { "responseModalities": ["TEXT", "IMAGE"] }
        };

        try {
            const response = await fetch(apiImageUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Resposta completa da API de imagem:', responseData);
            console.log(prompt);

            let imageData = null;
            let imageMimeType = null;

            if (responseData.candidates && responseData.candidates.length > 0) {
                for (const part of responseData.candidates[0].content.parts) {
                    if (part.inlineData) {
                        imageData = part.inlineData.data;
                        imageMimeType = part.inlineData.mimeType;
                        break;
                    }
                }

                if (imageData && imageMimeType) {
                    const byteCharacters = atob(imageData);
                    const byteArrays = [];

                    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                        const slice = byteCharacters.slice(offset, offset + 512);
                        const byteNumbers = new Array(slice.length);
                        for (let i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        byteArrays.push(byteArray);
                    }

                    const blob = new Blob(byteArrays, { type: imageMimeType });
                    const imageUrl = URL.createObjectURL(blob);

                    AIimage = imageUrl;
                    // templates[0].generatedImage = imageUrl;

                    console.log('URL da imagem gerada:', imageUrl);

                    domElements.imagemGerada.src = imageUrl;

                } else {
                    console.error('A API não retornou uma imagem. Verifique a resposta completa acima.');
                }
            } else {
                console.error('A API não retornou candidatos. Verifique a resposta completa acima.');
            }

        } catch (error) {
            console.error('Houve um erro na API de imagem:', error);
        }
    }
}

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
        console.log('Resposta completa da API de texto:', result.candidates[0].content.parts[0].text);

        return result.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('Erro na API de texto:', error);
        return null;
    }
}



//------------- TESTE ---------------
//resultado: "fetchAndProcessText()" -> sucesso em resposta
//resultado: "geminiServiceAPI.getAiTextResponse()" -> sucesso em resposta
//resultado: "geminiServiceAPI.getAiSubTitleResponse()" -> sucesso em resposta
//resultado: "geminiServiceAPI.getAiImageResponse()" -> falha em resposta **Configurar a entrega da: apiImageUrl**
//geminiServiceAPI.getAiImageResponse();
