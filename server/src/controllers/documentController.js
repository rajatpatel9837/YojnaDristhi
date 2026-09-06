const path = require('path');
const fs = require('fs');
const { scanDocumentOCR } = require('../engines/ocrEngine');

/**
 * Handle Single Document File Upload & AI OCR Scanning
 */
const scanDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No document file uploaded.'
      });
    }

    const requestedDocType = req.body.documentType || 'General Document';
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const relativeUrl = `/uploads/${req.file.filename}`;

    // Perform AI OCR scanning and detail extraction
    const ocrResult = await scanDocumentOCR(filePath, mimeType, requestedDocType);

    res.json({
      success: true,
      message: 'Document uploaded and AI OCR scan completed.',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        fileUrl: relativeUrl
      },
      ocr: ocrResult
    });
  } catch (error) {
    console.error('Document OCR controller error:', error);
    // Clean up uploaded file if processing failed
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.warn('Failed to clean up orphaned file:', unlinkErr.message);
      }
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to scan document.'
    });
  }
};

module.exports = {
  scanDocument
};
