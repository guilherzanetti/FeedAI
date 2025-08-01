// src/components/uiController.js
import { dom } from '../utils/domElements.js';

export const uiController = {
  showLoading() { dom.loading.style.display = 'block'; },
  hideLoading() { dom.loading.style.display = 'none'; },
  showPopup() { dom.popupRender.style.display = 'flex'; },
  hidePopup() { dom.popupRender.style.display = 'none'; },
  showCanvas() { dom.canvasDiv.style.display = 'block'; },
  hideCanvas() { dom.canvasDiv.style.display = 'none'; },
};