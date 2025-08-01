const api_Key = process.env.ApiKeyGeminiDev;

const apiKey = api_Key;
const apiTextUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;
const apiImageUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;

// Cache de elementos do DOM
const domElements = {
    title: document.querySelector('.title'),
    subTitle: document.querySelector('.subTitle'),
    renderTemplate: document.querySelector('.renderTemplate'),
    group: document.querySelector('.group'),
    closePopup: document.getElementById('closePopup'),
    popupRender: document.getElementById('popupRender'),
    btnBaixar: document.querySelector('.btnBaixar'),
    btnEnviar: document.querySelector(".btnEnviar"),
    nomeEmpresa: document.querySelector('#nomeEmpresa'),
    publicoAlvo: document.querySelector('#publicoAlvo'),
    objetivoEmpresa: document.querySelector('#objetivoEmpresa'),
    logoEmpresaInput: document.querySelector('#logoEmpresa'),
    logoImgRender: document.querySelector('.logoImgRender'),
    imagemGerada: document.getElementById('imagemGerada'),
    loading: document.querySelector('.loading'),
    canvasDiv: document.querySelector('.canvasDiv'),
    divisor: document.querySelector('.divisor')
};

// Estilos em CSS in JS
const styles = {
    title: {
        alignSelf: 'stretch',
        color: '#FFF',
        fontFamily: 'Rubik',
        fontSize: '42px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: '42px'
    },
    subTitle: {
        width: '350px',
        fontSize: '20px',
        color: '#FFF',
        fontFamily: 'Rubik',
        fontStyle: 'italic',
        fontWeight: '400',
        lineHeight: '20px'
    },
    renderTemplate: {
        backgroundSize: 'cover',
        padding: '100px'
    },
    group: {
        display: 'flex',
        width: '450px',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    divisor: {
        marginTop: '10px',
        marginBottom: '10px',
        width: '3px',
        height: '99px',
        backgroundColor: '#ddd'
    },
    btnBaixar: {
        display: 'block'
    }
};

// Aplica estilos
Object.assign(domElements.title.style, styles.title);
Object.assign(domElements.subTitle.style, styles.subTitle);
Object.assign(domElements.renderTemplate.style, styles.renderTemplate);
Object.assign(domElements.group.style, styles.group);

// Variável de usuário
var user = {
    nome: "",
    publicoAlvo: "",
    objetivo: ""
};

// Templates
const templates = [
    {
        templateName: "Insta 01",
        title: "",
        subTitle: "",
        width: 1080 / 2,
        height: 1350 / 2,
        logo: "",
        generatedImage: ""
    },
    {
        templateName: "Insta 02",
        title: "",
        subTitle: "",
        width: 1080 / 2,
        height: 1080 / 2,
        logo: "",
        generatedImage: ""
    }
];

// Variáveis globais
var AIwrite = "";
var AIimage = "";
var promptDeImg = "";

// Event listeners
domElements.closePopup.addEventListener('click', () => {
    domElements.popupRender.style.display = 'none';
});

domElements.btnBaixar.addEventListener('click', () => {
    saveDivAsPng('renderTemplate', 'teste.png');
});

domElements.btnEnviar.addEventListener("click", () => {
    user.nome = domElements.nomeEmpresa.value;
    user.publicoAlvo = domElements.publicoAlvo.value;
    user.objetivo = domElements.objetivoEmpresa.value;

    const file = domElements.logoEmpresaInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            domElements.logoImgRender.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    domElements.logoImgRender.style.width = "100px";
    main();
});

// Função para salvar a div como PNG
function saveDivAsPng(divId, filename = 'div-image.png') {
    const element = document.getElementById(divId);

    if (!element) {
        console.error('Div não encontrada.');
        return;
    }

    html2canvas(element, { scale: 4 })
        .then((canvas) => {
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch((error) => {
            console.error('Erro ao salvar a div como PNG:', error);
        });
}

// Função para renderizar a imagem no template
function renderImage(templateId) {
    domElements.renderTemplate.style.width = templates[templateId].width + 'px';
    domElements.renderTemplate.style.height = templates[templateId].height + 'px';
    domElements.renderTemplate.style.backgroundImage = `
        linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)),
        url(${templates[0].generatedImage})
    `;

    domElements.title.textContent = templates[templateId].title;
    domElements.subTitle.textContent = templates[templateId].subTitle;

    Object.assign(domElements.divisor.style, styles.divisor);
    Object.assign(domElements.btnBaixar.style, styles.btnBaixar);
}

// Funções de chamada à API
async function getAiTextResponse() {
    const prompt = `Gere apenas 1 frase curta e impactante para a empresa ${user.nome}, no estilo de chamada para redes sociais, relacionada ao publico-alvo: ${user.publicoAlvo} e objetivo: ${user.objetivo}. A frase deve ser direta, instigante e profissional — sem explicações ou texto adicional, sem negrito ou decorações no texto. Apenas a frase mas adapte ao nicho`;
    AIwrite = await fetchAndProcessText(apiTextUrl, prompt);
    templates[0].title = AIwrite;
    templates[1].title = AIwrite;
    console.log('Resposta da API de texto:', AIwrite);
}

async function getAiSubTitleResponse() {
    const prompt = `Gere apenas 1 subtitulo com base nesse titulo ${AIwrite} a e impactante para a empresa ${user.nome}, no estilo de chamada para redes sociais, relacionada ao publico-alvo: ${user.publicoAlvo} e objetivo: ${user.objetivo}. A frase deve ser direta, instigante e profissional e não pode ser genérica — sem explicações ou texto adicional, sem negrito ou decorações no texto. Apenas a frase mas adapte ao nicho`;
    const subTitleText = await fetchAndProcessText(apiTextUrl, prompt);
    templates[0].subTitle = subTitleText;
    templates[1].subTitle = subTitleText;
    console.log('Resposta da API de texto:', subTitleText);
}

async function getAiImagePromptResponse() {
    const prompt = `Gere um único prompt para criação de imagem de background para capa na dimensão 1080x1350px sem texto com base nisso: ${AIwrite}`;
    promptDeImg = await fetchAndProcessText(apiTextUrl, prompt);
    console.log('Resposta da API geração de :', promptDeImg);
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
        return result.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('Erro na API de texto:', error);
        return null;
    }
}

async function getAiImageResponse() {
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
                templates[0].generatedImage = imageUrl;

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

async function main() {
    domElements.popupRender.style.display = 'flex';
    domElements.canvasDiv.style.display = "none";
    domElements.loading.style.display = 'block';

    await getAiTextResponse();
    await getAiSubTitleResponse();
    await getAiImagePromptResponse();
    await getAiImageResponse();

    domElements.loading.style.display = 'none';
    renderImage(1);
    domElements.canvasDiv.style.display = "block";
}