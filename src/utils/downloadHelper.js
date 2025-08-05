export function saveDivAsPng(divId, filename = 'div-image.png', quality) {
  const element = document.getElementById(divId);

  if (!element) {
    console.error('Div não encontrada.');
    return;
  }

  html2canvas(element, { scale: quality})
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