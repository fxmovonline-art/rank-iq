"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PdfExportButtonProps {
  /**
   * Array of element IDs to capture in the PDF.
   * Each element will be rendered on a new page if needed.
   */
  targetElementIds: string[];
  
  /**
   * Filename for the downloaded PDF (without .pdf extension)
   */
  fileName: string;
  
  /**
   * Title to display at the top of the PDF
   */
  pdfTitle?: string;
  
  /**
   * Optional subtitle (e.g., project name, date)
   */
  pdfSubtitle?: string;

  /**
   * Optional plain-text sections. When provided, PDF is generated from text
   * directly (no DOM screenshot capture).
   */
  textSections?: Array<{
    title: string;
    body: string;
  }>;
}

export default function PdfExportButton({
  targetElementIds,
  fileName,
  pdfTitle = "RankIQ - Professional SEO Audit",
  pdfSubtitle,
  textSections,
}: PdfExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const sanitizeFileName = (name: string) =>
    name
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120) || "seo-report";

  const isUnsupportedColorError = (error: unknown) => {
    if (!(error instanceof Error)) {
      return false;
    }

    const message = error.message.toLowerCase();
    return (
      message.includes("unsupported color function") ||
      message.includes("parse an unsupported color") ||
      message.includes("oklch") ||
      message.includes("lab")
    );
  };

  const sanitizeUnsupportedColorFunctions = (doc: Document) => {
    const colorFunctionRegex = /(oklch|oklab|lch|lab)\([^\)]*\)/gi;

    doc.querySelectorAll("style").forEach((styleTag) => {
      if (!styleTag.textContent) {
        return;
      }

      // Replace unsupported modern color functions with a safe neutral color.
      styleTag.textContent = styleTag.textContent.replace(colorFunctionRegex, "rgb(71, 85, 105)");
    });

    doc.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
      const inlineStyle = el.getAttribute("style");
      if (!inlineStyle) {
        return;
      }

      el.setAttribute("style", inlineStyle.replace(colorFunctionRegex, "rgb(71, 85, 105)"));
    });
  };

  const isCanvasEffectivelyBlank = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return false;
    }

    const { width, height } = canvas;
    if (width === 0 || height === 0) {
      return true;
    }

    const sampleSize = 24;
    const stepX = Math.max(1, Math.floor(width / sampleSize));
    const stepY = Math.max(1, Math.floor(height / sampleSize));

    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width; x += stepX) {
        const pixel = context.getImageData(x, y, 1, 1).data;
        const alpha = pixel[3];
        const isNonWhite = pixel[0] < 245 || pixel[1] < 245 || pixel[2] < 245;
        if (alpha > 0 && isNonWhite) {
          return false;
        }
      }
    }

    return true;
  };

  const captureElement = async (element: HTMLElement) => {
    const baseOptions = {
      scale: Math.min(2, window.devicePixelRatio || 1.5),
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: -window.scrollY,
    } as const;

    try {
      const canvas = await html2canvas(element, baseOptions);
      if (!isCanvasEffectivelyBlank(canvas)) {
        return canvas;
      }

      // If capture is blank, retry with sanitized CSS in cloned document.
      return await html2canvas(element, {
        ...baseOptions,
        onclone: (clonedDoc) => {
          sanitizeUnsupportedColorFunctions(clonedDoc);
        },
      });
    } catch (error) {
      if (!isUnsupportedColorError(error)) {
        throw error;
      }

      // Fallback #1: sanitize modern color functions in cloned styles.
      const sanitizedCanvas = await html2canvas(element, {
        ...baseOptions,
        onclone: (clonedDoc) => {
          sanitizeUnsupportedColorFunctions(clonedDoc);
        },
      });

      if (!isCanvasEffectivelyBlank(sanitizedCanvas)) {
        return sanitizedCanvas;
      }

      // Fallback #2: rely on browser rendering path for modern color functions.
      const foreignObjectCanvas = await html2canvas(element, {
        ...baseOptions,
        foreignObjectRendering: true,
      });

      return foreignObjectCanvas;
    }
  };

  const renderTextSectionsPdf = (
    pdf: jsPDF,
    margin: number,
    pageHeight: number,
    contentWidth: number,
    startY: number,
    sections: Array<{ title: string; body: string }>
  ) => {
    let y = startY;

    const ensureSpace = (neededHeight: number) => {
      if (y + neededHeight <= pageHeight - margin) {
        return;
      }

      pdf.addPage();
      y = margin;
    };

    sections.forEach((section, index) => {
      if (index > 0) {
        ensureSpace(12);
        y += 4;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);

      const titleLines = pdf.splitTextToSize(section.title, contentWidth);
      ensureSpace(titleLines.length * 6 + 4);
      pdf.text(titleLines, margin, y);
      y += titleLines.length * 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      y += 2;

      const paragraphs = section.body.split("\n");
      for (const paragraph of paragraphs) {
        const lineText = paragraph.trim().length === 0 ? " " : paragraph;
        const wrappedLines = pdf.splitTextToSize(lineText, contentWidth);
        ensureSpace(wrappedLines.length * 5 + 2);
        pdf.text(wrappedLines, margin, y);
        y += wrappedLines.length * 5;
      }
    });
  };

  const handleDownloadPdf = async () => {
    setIsGenerating(true);

    try {
      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 25; // p-10 equivalent (10 * 2.5mm ≈ 25mm)
      const contentWidth = pdfWidth - 2 * margin;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add header to first page
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(pdfTitle, margin, margin);

      if (pdfSubtitle) {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 100, 100);
        pdf.text(pdfSubtitle, margin, margin + 7);
      }

      // Add generation date
      pdf.setFontSize(9);
      pdf.setTextColor(120, 120, 120);
      const dateStr = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      pdf.text(`Generated on ${dateStr}`, margin, margin + (pdfSubtitle ? 13 : 7));

      let currentY = margin + (pdfSubtitle ? 20 : 14);

      if (textSections && textSections.length > 0) {
        renderTextSectionsPdf(
          pdf,
          margin,
          pdfHeight,
          contentWidth,
          currentY,
          textSections
        );
        pdf.save(`${sanitizeFileName(fileName)}.pdf`);
        return;
      }

      const availablePageHeight = pdfHeight - 2 * margin;
      const existingElements = targetElementIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el));

      if (existingElements.length === 0) {
        throw new Error("No export sections found on this page.");
      }

      // Process each target element
      for (let i = 0; i < existingElements.length; i++) {
        const element = existingElements[i];

        // Capture element as canvas
        const canvas = await captureElement(element);

        const pxPerMm = canvas.width / contentWidth;
        let sourceY = 0;
        let firstSlice = true;

        while (sourceY < canvas.height) {
          const remainingHeightMm = pdfHeight - currentY - margin;

          if (remainingHeightMm < 20) {
            pdf.addPage();
            currentY = margin;
          }

          const drawableHeightMm = Math.min(
            pdfHeight - currentY - margin,
            availablePageHeight
          );
          const sliceHeightPx = Math.min(
            canvas.height - sourceY,
            Math.floor(drawableHeightMm * pxPerMm)
          );

          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceHeightPx;

          const sliceContext = sliceCanvas.getContext("2d");
          if (!sliceContext) {
            throw new Error("Failed to render PDF canvas.");
          }

          sliceContext.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sliceHeightPx,
            0,
            0,
            canvas.width,
            sliceHeightPx
          );

          const sliceData = sliceCanvas.toDataURL("image/png");
          const sliceHeightMm = sliceHeightPx / pxPerMm;

          pdf.addImage(sliceData, "PNG", margin, currentY, contentWidth, sliceHeightMm);

          sourceY += sliceHeightPx;
          currentY += sliceHeightMm;

          if (sourceY < canvas.height) {
            pdf.addPage();
            currentY = margin;
          } else if (i < existingElements.length - 1) {
            currentY += firstSlice ? 10 : 8;
          }

          firstSlice = false;
        }

        if (i < existingElements.length - 1 && currentY + 40 > pdfHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
      }

      // Save PDF
      pdf.save(`${sanitizeFileName(fileName)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownloadPdf}
      disabled={isGenerating}
      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download SEO Report
        </>
      )}
    </button>
  );
}
