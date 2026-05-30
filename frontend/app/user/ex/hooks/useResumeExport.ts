import { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';

export const useResumeExport = () => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState(1);

  // Responsive scaling to keep the A4 resume at a fixed width
  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current && wrapperRef.current.parentElement) {
        const parentWidth = wrapperRef.current.parentElement.offsetWidth;
        const availableWidth = parentWidth - 40;
        setScale(availableWidth < 840 ? availableWidth / 840 : 1);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleExportPDF = async () => {
    if (!resumeRef.current) return;
    setIsExporting(true);
    try {
      const element = resumeRef.current;

      // Force element to at least A4 aspect ratio so short resumes fill the paper
      const a4Ratio = 297 / 210;
      const targetMinHeight = element.offsetWidth * a4Ratio;
      const originalMinHeight = element.style.minHeight;
      element.style.minHeight = `${Math.max(element.offsetHeight, targetMinHeight)}px`;

      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 50));

      const imgData = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });

      // Restore original minHeight
      element.style.minHeight = originalMinHeight;

      const worker = new Worker(new URL('../../../../workers/pdf.worker.ts', import.meta.url));

      worker.onmessage = (event) => {
        if (event.data.status === 'success') {
          const pdfBlob = event.data.blob;
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Verified_Resume.pdf';
          a.click();
          URL.revokeObjectURL(url);
        } else {
          console.error("PDF generation failed:", event.data.error);
        }
        setIsExporting(false);
        worker.terminate();
      };

      worker.postMessage({ imgData });

    } catch (error) {
      console.error('Error exporting PDF:', error);
      setIsExporting(false);
    }
  };

  return {
    resumeRef,
    wrapperRef,
    isExporting,
    scale,
    handleExportPDF
  };
};
