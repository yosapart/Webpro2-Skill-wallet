// frontend/workers/pdf.worker.ts
import jsPDF from 'jspdf';

self.addEventListener('message', (event: MessageEvent) => {
  const { imgData } = event.data;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgProps = pdf.getImageProperties(imgData);
    
    // Scale image to fit exactly within one single A4 page boundaries (both width and height)
    const widthRatio = pdfWidth / imgProps.width;
    const heightRatio = pdfHeight / imgProps.height;
    
    const ratio = Math.min(widthRatio, heightRatio);
    
    const finalWidth = imgProps.width * ratio;
    const finalHeight = imgProps.height * ratio;
    
    // Center the image horizontally and vertically on the A4 page
    const marginX = (pdfWidth - finalWidth) / 2;
    const marginY = (pdfHeight - finalHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', marginX, marginY, finalWidth, finalHeight);
    
    // Output as Blob
    const pdfBlob = pdf.output('blob');
    self.postMessage({ status: 'success', blob: pdfBlob });
  } catch (error: any) {
    self.postMessage({ status: 'error', error: error.message });
  }
});
