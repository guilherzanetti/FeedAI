// src/components/templateRenderer.js
import { dom } from '../utils/domElements.js';

const styles = { /* Seus estilos CSS-in-JS aqui */ };

export function applyBaseStyles() {
    // Sua lógica de Object.assign para os estilos iniciais
}

export function renderTemplate(templateData) {
  // Sua função renderImage, mas agora recebe os dados como parâmetro
  dom.renderTemplate.style.width = templateData.width + 'px';
  dom.renderTemplate.style.height = templateData.height + 'px';
  // ... etc
  dom.title.textContent = templateData.title;
  dom.subTitle.textContent = templateData.subTitle;
  dom.renderTemplate.style.backgroundImage = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)),
    url(${templateData.generatedImage})
  `;
}