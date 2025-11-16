import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export resume to PDF using html2canvas and jsPDF
 * @param {HTMLElement} element - The resume element to export
 * @param {string} filename - The filename for the PDF
 * @returns {Promise<Object>} Success result
 */
export const exportToPDF = async (element, filename = 'resume.pdf') => {
  try {
    if (!element) {
      return {
        success: false,
        error: 'Resume element not found'
      };
    }

    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true, // Handle cross-origin images
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    // Get canvas dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: imgHeight > imgWidth ? 'portrait' : 'portrait'
    });

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');

    // If content is longer than one page, split it
    const pageHeight = 297; // A4 height in mm
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    pdf.save(filename);

    return {
      success: true,
      filename
    };
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return {
      success: false,
      error: 'Failed to export PDF. Please try again.'
    };
  }
};

/**
 * Generate PDF filename from resume data
 * @param {Object} resume - Resume object
 * @returns {string} Filename
 */
export const generatePDFFilename = (resume) => {
  const name = resume.personalInfo?.fullName || 'Resume';
  const role = resume.targetRole || '';

  // Create safe filename
  const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const safeRole = role.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  if (safeRole) {
    return `${safeName}_${safeRole}_resume.pdf`;
  }

  return `${safeName}_resume.pdf`;
};

/**
 * Preview PDF (open in new tab)
 * @param {HTMLElement} element - The resume element to preview
 * @returns {Promise<Object>} Success result
 */
export const previewPDF = async (element) => {
  try {
    if (!element) {
      return {
        success: false,
        error: 'Resume element not found'
      };
    }

    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Get canvas dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    const pageHeight = 297; // A4 height in mm
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Open in new window
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

    return {
      success: true
    };
  } catch (error) {
    console.error('Error previewing PDF:', error);
    return {
      success: false,
      error: 'Failed to preview PDF. Please try again.'
    };
  }
};

/**
 * Convert any JSON (object/array/string) to a downloadable PDF in the browser.
 * @param {any} json - JSON value (object/array/string)
 * @param {string} filename - filename to download (default: "data.pdf")
 * @param {object} [options] - optional settings: { fontSize, lineHeight, margin, pageSize }
 */
export const jsonToPdfBrowser = (json, filename = "data.pdf", options = {}) => {
  const {
    fontSize = 10,
    lineHeight = 1.2,
    margin = 20,
    pageSize = "a4",
    orientation = "portrait"
  } = options;

  const doc = new jsPDF({ unit: "pt", format: pageSize, orientation });
  doc.setFontSize(fontSize);

  // turn json into pretty multi-line string
  const jsonString = typeof json === "string" ? json : JSON.stringify(json, null, 2);

  // convert to lines that fit the page width
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - margin * 2;
  const lines = doc.splitTextToSize(jsonString, usableWidth);

  // line height in points
  const lineHeightPt = fontSize * lineHeight;

  let cursorY = margin;
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 0; i < lines.length; i++) {
    if (cursorY + lineHeightPt > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(lines[i], margin, cursorY);
    cursorY += lineHeightPt;
  }

  // trigger download
  doc.save(filename);
};
