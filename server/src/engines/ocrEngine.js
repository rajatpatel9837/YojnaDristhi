const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

let pdfParse = null;
try {
  const pdfMod = require('pdf-parse');
  pdfParse = typeof pdfMod === 'function' ? pdfMod : (pdfMod && pdfMod.default) || null;
} catch (e) {
  console.warn('pdf-parse not installed.');
}

let Tesseract = null;
try {
  Tesseract = require('tesseract.js');
} catch (e) {
  console.warn('tesseract.js not installed.');
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY || '';
let genAI = null;
if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  } catch (e) {}
}

/**
 * 100% REAL AI & OCR Document Scanner with Indian Govt Regulatory Standards Validation
 */
const scanDocumentOCR = async (filePath, mimeType, requestedDocType = 'General') => {
  let rawText = '';
  let clarityScore = 0;
  let ocrConfidence = 0;
  let visionExtractedData = null;

  const fileBuffer = fs.readFileSync(filePath);
  const isImage = mimeType.includes('image') || mimeType.includes('png') || mimeType.includes('jpg') || mimeType.includes('jpeg') || mimeType.includes('webp');
  const isPdf = mimeType.includes('pdf');

  // 1. Try Gemini Vision API if key available (Fast 3-second timeout)
  if (genAI && fileBuffer && fileBuffer.length > 0) {
    for (const modelName of ['gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro']) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `Perform accurate OCR on this Indian document (${requestedDocType}).
Extract all visible text according to Indian Government verification standards.
Return a valid JSON object strictly matching this schema:
{
  "rawText": "full text extracted",
  "clarityScore": 90,
  "extractedFields": {
    "fullName": "Name if found or null",
    "idNumber": "Aadhaar/Certificate/ID Number if found or null",
    "state": "State if found or null",
    "familyIncome": 150000,
    "category": "SC/ST/OBC/EWS/General if found or null",
    "udyamNumber": "UDYAM-XX-00-0000000 if found or null",
    "panNumber": "PAN if found or null",
    "cinNumber": "CIN if found or null"
  }
}`;

        const imagePart = {
          inlineData: {
            data: fileBuffer.toString('base64'),
            mimeType: isPdf ? 'application/pdf' : mimeType
          }
        };

        const result = await Promise.race([
          model.generateContent([prompt, imagePart]),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini Vision Timeout')), 3000))
        ]);

        const textResp = result.response.text();
        const jsonMatch = textResp.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.rawText && parsed.rawText.trim().length > 5) {
            rawText = parsed.rawText;
            clarityScore = parsed.clarityScore || 90;
            if (parsed.extractedFields) visionExtractedData = parsed.extractedFields;
            break;
          }
        }
      } catch (e) {
        // Fallback to next model or native OCR
      }
    }
  }

  // 2. Native PDF Parsing (pdf-parse)
  if ((!rawText || rawText.trim().length === 0) && isPdf) {
    try {
      if (typeof pdfParse === 'function') {
        const pdfData = await pdfParse(fileBuffer);
        rawText = pdfData.text || '';
        if (rawText.trim().length > 15) {
          clarityScore = Math.min(98, Math.max(65, Math.round((rawText.trim().length / 200) * 100)));
          ocrConfidence = clarityScore;
        }
      }
    } catch (e) {
      console.warn('pdf-parse extraction error:', e.message);
    }
  }

  // 3. Native Image OCR (Tesseract.js — STRICTLY FOR IMAGES ONLY, NEVER PDFs)
  if ((!rawText || rawText.trim().length < 15) && isImage && Tesseract) {
    try {
      const tessResult = await Tesseract.recognize(filePath, 'eng');
      if (tessResult && tessResult.data) {
        rawText = tessResult.data.text || '';
        ocrConfidence = Math.round(tessResult.data.confidence || 0);
        clarityScore = ocrConfidence;
      }
    } catch (tessErr) {
      console.warn('Tesseract OCR image scanning warning:', tessErr.message);
    }
  }

  // Clean rawText formatting
  rawText = (rawText || '').trim();

  // If no text could be recognized from the actual file
  if (!rawText || rawText.length < 5) {
    return {
      success: true,
      isClear: false,
      clarityScore: 25,
      legibilityStatus: 'BLURRY_OR_UNREADABLE',
      documentType: requestedDocType,
      detectedType: 'Unreadable Document File',
      typeMismatch: false,
      warningMessage: 'No legible text could be recognized from this file via OCR. Please upload a clear, unblurred scan or text PDF/image.',
      indianGovCompliance: {
        isGovStandardCompliant: false,
        issuingAuthorityDetected: 'Unknown',
        complianceNotes: ['⚠ Document unreadable: Failed Indian Govt Standard Layout check']
      },
      extractedFields: {},
      rawTextSnippet: 'Unreadable file / No text recognized by OCR engine.'
    };
  }

  // 4. Real Pattern Extraction strictly from extracted text
  const extractedFields = visionExtractedData || parseFieldsFromExtractedText(rawText, requestedDocType);
  const typeVerification = checkTypeMatch(rawText, requestedDocType);
  const govStandards = validateIndianGovStandards(rawText, requestedDocType, extractedFields);

  const isClear = clarityScore >= 50 && !typeVerification.typeMismatch;
  const legibilityStatus = clarityScore >= 80 
    ? 'HIGHLY_LEGIBLE' 
    : clarityScore >= 50 
    ? 'ACCEPTABLE_CLARITY' 
    : 'BLURRY_OR_LOW_CONTRAST';

  return {
    success: true,
    isClear,
    clarityScore: Math.max(40, clarityScore),
    legibilityStatus,
    documentType: requestedDocType,
    detectedType: typeVerification.detectedType,
    typeMismatch: typeVerification.typeMismatch,
    warningMessage: typeVerification.warningMessage,
    indianGovCompliance: govStandards,
    extractedFields: sanitizeExtractedFields(extractedFields),
    rawTextSnippet: rawText.substring(0, 400).replace(/\s+/g, ' ')
  };
};

/**
 * Strict Regex Extractor — parses ONLY what is present in actual OCR text
 */
const parseFieldsFromExtractedText = (text, docType) => {
  const fields = {};
  const lowerText = text.toLowerCase();

  // Name extraction (e.g., "Name: Sunita Devi", "Shri Ramesh Kumar")
  const nameMatch = text.match(/(?:Name|Full Name|Holder|Applicant|Owner|Shri|Smt|Kumari)\s*[:|-]?\s*([A-Za-z\s]{3,30})/i);
  if (nameMatch && nameMatch[1] && nameMatch[1].trim().length > 2) {
    fields.fullName = nameMatch[1].trim();
  }

  // State extraction
  const indianStates = ['Bihar', 'Punjab', 'Uttar Pradesh', 'Jharkhand', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'Delhi', 'Haryana', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'West Bengal', 'Odisha', 'Assam', 'Kerala', 'Telangana', 'Andhra Pradesh'];
  for (const s of indianStates) {
    if (lowerText.includes(s.toLowerCase())) {
      fields.state = s;
      break;
    }
  }

  // 12-Digit Aadhaar Number extraction (UIDAI Standard)
  const aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
  if (aadhaarMatch) {
    const fullUid = aadhaarMatch[0].replace(/\s/g, '');
    fields.idNumber = `XXXX-XXXX-${fullUid.slice(8)}`;
    fields.rawId = fullUid;
  }

  // Annual Income extraction
  const incomeMatch = text.match(/(?:Rs\.?|INR|₹|Income)\s*[:|-]?\s*([\d,]{4,9})/i);
  if (incomeMatch && incomeMatch[1]) {
    const incomeVal = parseInt(incomeMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(incomeVal) && incomeVal > 1000) {
      fields.familyIncome = incomeVal;
    }
  }

  // Social Category extraction
  if (lowerText.includes('scheduled caste') || lowerText.match(/\bsc\b/)) fields.category = 'SC';
  else if (lowerText.includes('scheduled tribe') || lowerText.match(/\bst\b/)) fields.category = 'ST';
  else if (lowerText.includes('other backward') || lowerText.match(/\bobc\b/)) fields.category = 'OBC';
  else if (lowerText.includes('economically weaker') || lowerText.match(/\bews\b/)) fields.category = 'EWS';

  // Udyam Registration Number extraction (UDYAM-XX-00-0000000)
  const udyamMatch = text.match(/UDYAM-[A-Z]{2}-\d{2}-\d{7}/i);
  if (udyamMatch) {
    fields.udyamNumber = udyamMatch[0].toUpperCase();
    fields.udyamStatus = 'Registered';
  }

  // PAN / CIN extraction
  const panMatch = text.match(/[A-Z]{5}\d{4}[A-Z]{1}/);
  if (panMatch) fields.panNumber = panMatch[0];

  const cinMatch = text.match(/[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}/);
  if (cinMatch) fields.cinNumber = cinMatch[0];

  return fields;
};

/**
 * Validate Document Against Indian Government Regulatory Standards
 */
const validateIndianGovStandards = (text, docType, extractedFields) => {
  const lower = text.toLowerCase();
  const standards = {
    isGovStandardCompliant: true,
    issuingAuthorityDetected: 'Government Nodal Agency',
    complianceNotes: []
  };

  // 1. Aadhaar (UIDAI Standard - Govt of India)
  if (docType.includes('Aadhaar')) {
    if (lower.includes('government of india') || lower.includes('भारत सरकार') || lower.includes('unique identification authority of india') || lower.includes('uidai')) {
      standards.complianceNotes.push('✓ Verified UIDAI Header: Government of India / Unique Identification Authority of India');
      standards.issuingAuthorityDetected = 'UIDAI (Government of India)';
    } else {
      standards.isGovStandardCompliant = false;
      standards.complianceNotes.push('⚠ Missing UIDAI Official Header ("Government of India" / "UIDAI")');
    }

    if (extractedFields.rawId && /^\d{12}$/.test(extractedFields.rawId)) {
      standards.complianceNotes.push('✓ Verified 12-Digit Indian National UID Standard');
    } else if (!extractedFields.idNumber) {
      standards.isGovStandardCompliant = false;
      standards.complianceNotes.push('⚠ Missing 12-digit Aadhaar UID string format');
    }
  }

  // 2. Udyam MSME Registration (Ministry of MSME Standard)
  if (docType.includes('Udyam')) {
    if (lower.includes('ministry of micro') || lower.includes('msme') || lower.includes('सूक्ष्म, लघु और मध्यम उद्यम')) {
      standards.complianceNotes.push('✓ Verified Ministry of MSME Official Header');
      standards.issuingAuthorityDetected = 'Ministry of MSME (Govt. of India)';
    } else {
      standards.complianceNotes.push('⚠ Missing Ministry of MSME Official Header');
    }

    if (extractedFields.udyamNumber && /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/.test(extractedFields.udyamNumber)) {
      standards.complianceNotes.push('✓ Complies with Official Udyam Registration Standard (UDYAM-XX-00-0000000)');
    } else {
      standards.isGovStandardCompliant = false;
      standards.complianceNotes.push('⚠ Udyam Registration Number format mismatch');
    }
  }

  // 3. PAN / Business Registration (Income Tax Dept / NSDL / MCA Standard)
  if (docType.includes('Business') || docType.includes('PAN')) {
    if (extractedFields.panNumber && /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(extractedFields.panNumber)) {
      const char4 = extractedFields.panNumber[3];
      const entityType = char4 === 'P' ? 'Individual' : char4 === 'C' ? 'Company' : char4 === 'F' ? 'Firm' : char4 === 'T' ? 'Trust' : 'Entity';
      standards.complianceNotes.push(`✓ Complies with Income Tax Department PAN Standard (${entityType} PAN)`);
      standards.issuingAuthorityDetected = 'Income Tax Department (CBDT / NSDL)';
    }

    if (extractedFields.cinNumber && /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(extractedFields.cinNumber)) {
      standards.complianceNotes.push('✓ Complies with MCA 21-Digit Corporate Identification Number (CIN) Standard');
      standards.issuingAuthorityDetected = 'Ministry of Corporate Affairs (MCA)';
    }
  }

  // 4. Income Certificate (State Revenue Dept / e-District Standard)
  if (docType.includes('Income')) {
    if (lower.includes('tehsildar') || lower.includes('tahsildar') || lower.includes('sdm') || lower.includes('collector') || lower.includes('revenue officer')) {
      standards.complianceNotes.push(`✓ Verified Competent Authority Issue (${extractedFields.issuingAuthority || 'Tehsildar / SDM'})`);
      standards.issuingAuthorityDetected = `State Revenue Department (${extractedFields.state || 'State Govt'})`;
    } else {
      standards.complianceNotes.push('⚠ Missing Competent Revenue Officer Designation (Tehsildar/SDM)');
    }
  }

  // 5. Category / Caste Certificate (Social Justice Dept Standard)
  if (docType.includes('Category') || docType.includes('Caste')) {
    if (lower.includes('scheduled caste') || lower.includes('scheduled tribe') || lower.includes('backward class') || lower.includes('economically weaker')) {
      standards.complianceNotes.push('✓ Complies with Central / State Social Welfare Category Order Standards');
      standards.issuingAuthorityDetected = 'District Magistrate / Social Welfare Dept';
    } else {
      standards.complianceNotes.push('⚠ Category classification does not match standard SC/ST/OBC/EWS gazette terminology');
    }
  }

  return standards;
};

/**
 * Check if extracted text matches requested document type
 */
const checkTypeMatch = (text, requestedDocType) => {
  const lower = text.toLowerCase();

  if (requestedDocType.includes('Aadhaar') && !lower.includes('aadhaar') && !lower.includes('unique identification') && !lower.includes('government of india') && !text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/)) {
    return {
      typeMismatch: true,
      detectedType: 'General Document',
      warningMessage: 'Uploaded file layout does not match standard Aadhaar Card or missing 12-digit UID.'
    };
  }

  if (requestedDocType.includes('Udyam') && !lower.includes('udyam') && !lower.includes('msme')) {
    return {
      typeMismatch: true,
      detectedType: 'Non-MSME Document',
      warningMessage: 'Uploaded file missing official Udyam Registration number format.'
    };
  }

  return { typeMismatch: false, detectedType: requestedDocType, warningMessage: null };
};

/**
 * Remove null / undefined / empty string values
 */
const sanitizeExtractedFields = (obj) => {
  if (!obj || typeof obj !== 'object') return {};
  const clean = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      clean[key] = obj[key];
    }
  });
  return clean;
};

module.exports = {
  scanDocumentOCR
};
