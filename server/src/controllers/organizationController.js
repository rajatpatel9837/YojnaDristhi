const Organization = require('../models/Organization');
const VerificationAuditLog = require('../models/VerificationAuditLog');

/**
 * Get My Organization Profile
 */
const getMyOrganization = async (req, res) => {
  try {
    let org = null;
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      if (req.user && req.user._id) {
        org = await Organization.findOne({ createdBy: req.user._id });
      }
      if (!org) {
        org = await Organization.findOne({ 'contact.officialEmail': 'csr@tatasustainable.org' });
      }
      if (!org) {
        org = await Organization.findOne({});
      }
    }
    
    // Fallback demo org if DB is empty or disconnected
    if (!org) {
      org = {
        _id: 'org_demo_fallback_1',
        name: 'Tata Sustainability Foundation',
        legalName: 'Tata Sustainability Foundation (India) Limited',
        organizationType: 'CSR_FOUNDATION',
        verification: { status: 'VERIFIED_LEGAL_ENTITY' },
        governmentRelationship: { claimed: true, relationshipType: 'GOVERNMENT_PARTNER', departmentName: 'Ministry of MSME' },
        registrationDetails: { pan: 'AAACT2024L', cin: 'U85300MH2024NPL123456', csrRegistrationNumber: 'CSR00012345' },
        contact: { officialEmail: 'csr@tatasustainable.org', phone: '+91 22 6665 8282' },
        verificationDossier: [
          { documentType: 'PAN_CARD', documentName: 'Organization PAN Card', verificationStatus: 'VERIFIED' },
          { documentType: 'INCORPORATION_CERTIFICATE', documentName: 'MCA Certificate of Incorporation', verificationStatus: 'VERIFIED' },
          { documentType: 'CSR_1_REGISTRATION', documentName: 'MCA Form CSR-1 Approval', verificationStatus: 'VERIFIED' }
        ]
      };
    }

    res.json({ success: true, data: org });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create or Update Organization Profile
 */
const createOrUpdateOrganization = async (req, res) => {
  try {
    const {
      name,
      legalName,
      organizationType,
      registrationDetails,
      address,
      contact,
      authorizedRepresentative,
      governmentRelationship
    } = req.body;

    if (!legalName || !contact?.officialEmail) {
      return res.status(400).json({ success: false, message: 'Legal organization name and official email are required.' });
    }

    let org = null;
    if (req.user && req.user._id) {
      org = await Organization.findOne({ createdBy: req.user._id });
    }

    if (!org && contact.officialEmail) {
      org = await Organization.findOne({ 'contact.officialEmail': contact.officialEmail });
    }

    if (org) {
      // Update existing
      if (name) org.name = name;
      if (legalName) org.legalName = legalName;
      if (organizationType) org.organizationType = organizationType;
      if (registrationDetails) org.registrationDetails = { ...org.registrationDetails, ...registrationDetails };
      if (address) org.address = { ...org.address, ...address };
      if (contact) org.contact = { ...org.contact, ...contact };
      if (authorizedRepresentative) org.authorizedRepresentative = { ...org.authorizedRepresentative, ...authorizedRepresentative };
      if (governmentRelationship) org.governmentRelationship = { ...org.governmentRelationship, ...governmentRelationship };
      
      org.verification.lastUpdatedAt = new Date();
      await org.save();
    } else {
      // Create new
      org = new Organization({
        name: name || legalName,
        legalName,
        organizationType: organizationType || 'PRIVATE_COMPANY',
        registrationDetails: registrationDetails || {},
        address: address || {},
        contact: contact || {},
        authorizedRepresentative: authorizedRepresentative || {},
        governmentRelationship: governmentRelationship || { claimed: false },
        createdBy: req.user?._id || null,
        verification: {
          status: 'PENDING',
          verificationLevel: 'Unverified'
        }
      });
      await org.save();

      // Log Audit
      await VerificationAuditLog.create({
        entityType: 'ORGANIZATION',
        entityId: org._id,
        entityName: org.legalName,
        action: 'SUBMITTED',
        previousStatus: 'NONE',
        newStatus: 'PENDING',
        performedBy: req.user?.name || 'Organization Representative',
        notes: 'Organization profile initiated'
      });
    }

    res.json({ success: true, message: 'Organization profile saved successfully.', data: org });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Upload Document Handler
 */
const uploadDocument = async (req, res) => {
  try {
    const { documentType, documentName, documentUrl, orgId } = req.body;

    if (!documentType) {
      return res.status(400).json({ success: false, message: 'Document type is required.' });
    }

    let finalUrl = documentUrl;
    let finalDocName = documentName;

    if (req.file) {
      finalUrl = `/uploads/${req.file.filename}`;
      if (!finalDocName) {
        finalDocName = req.file.originalname;
      }
    }

    if (!finalUrl) {
      return res.status(400).json({ success: false, message: 'Please select a file or provide a valid document URL.' });
    }

    let org = null;
    if (orgId) {
      org = await Organization.findById(orgId);
    } else if (req.user && req.user._id) {
      org = await Organization.findOne({ createdBy: req.user._id });
    }

    if (!org) {
      org = await Organization.findOne({});
    }

    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found.' });
    }

    // Add or update document in array
    const existingDocIdx = org.documents.findIndex(d => d.documentType === documentType);
    const newDoc = {
      documentType,
      documentUrl: finalUrl,
      documentName: finalDocName || `${documentType}.pdf`,
      uploadedAt: new Date(),
      verificationStatus: 'Uploaded'
    };

    if (existingDocIdx >= 0) {
      org.documents[existingDocIdx] = newDoc;
    } else {
      org.documents.push(newDoc);
    }

    org.verification.lastUpdatedAt = new Date();
    await org.save();

    await VerificationAuditLog.create({
      entityType: 'ORGANIZATION',
      entityId: org._id,
      entityName: org.legalName,
      action: 'DOCUMENT_ADDED',
      previousStatus: org.verification.status,
      newStatus: org.verification.status,
      performedBy: req.user?.name || 'Organization User',
      notes: `Uploaded document file: ${newDoc.documentName}`
    });

    res.json({ success: true, message: 'Document uploaded successfully to local server storage.', data: org.documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Submit Organization for Admin Verification
 */
const submitVerification = async (req, res) => {
  try {
    const { orgId } = req.body;
    let org = null;
    
    if (orgId) {
      org = await Organization.findById(orgId);
    } else if (req.user && req.user._id) {
      org = await Organization.findOne({ createdBy: req.user._id });
    }

    if (!org) {
      org = await Organization.findOne({});
    }

    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found.' });
    }

    const prevStatus = org.verification.status;
    org.verification.status = 'DOCUMENTS_SUBMITTED';
    org.verification.submittedAt = new Date();
    org.verification.lastUpdatedAt = new Date();
    await org.save();

    await VerificationAuditLog.create({
      entityType: 'ORGANIZATION',
      entityId: org._id,
      entityName: org.legalName,
      action: 'STATUS_CHANGED',
      previousStatus: prevStatus,
      newStatus: 'DOCUMENTS_SUBMITTED',
      performedBy: req.user?.name || 'Organization Representative',
      notes: 'Submitted verification dossier for admin review'
    });

    res.json({
      success: true,
      message: 'Verification dossier submitted successfully for admin review.',
      data: org
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyOrganization,
  createOrUpdateOrganization,
  uploadDocument,
  submitVerification
};
