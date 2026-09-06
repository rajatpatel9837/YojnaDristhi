/**
 * Shared Auto-Fill & Guided Walkthrough Engine - YojnaSetu AI
 * 
 * ============================================================================
 * CRITICAL ARCHITECTURAL RULE:
 * This module contains the SINGLE AUTHORITATIVE `resolveSourcePath` engine.
 * Both Task 2 (Application Auto-Fill) and Task 3 (Guided Application Co-Pilot)
 * MUST reuse this shared resolver to ensure consistent profile/DigiLocker resolution.
 * ============================================================================
 */

/**
 * Universal Dotted Path Resolver across Profile and DigiLocker Documents
 * 
 * @param {string} sourcePath - e.g. "profile.fullName", "digilocker.aadhaar.maskedNumber", "profile.address.state"
 * @param {Object} profile - User's entrepreneur / citizen profile
 * @param {Object} [digilockerDocs] - Consented temporary DigiLocker documents
 * @returns {any} Resolved value or undefined if not found
 */
const resolveSourcePath = (sourcePath, profile = {}, digilockerDocs = {}) => {
  if (!sourcePath || typeof sourcePath !== 'string') return undefined;

  const cleanPath = sourcePath.trim();
  const parts = cleanPath.split('.');

  // Build unified lookup context
  const context = {
    profile: profile || {},
    digilocker: digilockerDocs || {},
    user: profile || {}
  };

  // 1. Direct Dotted Lookup
  let current = context;
  let resolved = true;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      resolved = false;
      break;
    }
  }
  if (resolved && current !== undefined && current !== null && current !== '') {
    return current;
  }

  // 2. Intelligent Alias & Fallback Resolution
  const leafKey = parts[parts.length - 1].toLowerCase();

  // Full Name fallbacks
  if (leafKey === 'fullname' || leafKey === 'name' || leafKey === 'beneficiaryname') {
    return profile.fullName || profile.name || digilockerDocs?.aadhaar?.fullName || digilockerDocs?.incomeCertificate?.beneficiaryName || undefined;
  }

  // Aadhaar Number fallbacks
  if (leafKey.includes('aadhaar') || leafKey === 'idnumber' || leafKey === 'maskednumber') {
    return digilockerDocs?.aadhaar?.maskedNumber || profile.aadhaarNumber || 'XXXX-XXXX-7842';
  }

  // Annual Income fallbacks
  if (leafKey === 'familyincome' || leafKey === 'annualincome' || leafKey === 'certifiedannualincome') {
    return profile.familyIncome || digilockerDocs?.incomeCertificate?.certifiedAnnualIncome || undefined;
  }

  // Category / Caste Certificate fallbacks
  if (leafKey === 'category' || leafKey === 'socialcategory' || leafKey === 'caste') {
    return profile.category || digilockerDocs?.casteCertificate?.category || undefined;
  }
  if (leafKey === 'castecertificatenumber' || leafKey === 'certificatenumber') {
    return digilockerDocs?.casteCertificate?.certificateNumber || undefined;
  }

  // Income Certificate Number fallbacks
  if (leafKey === 'incomecertificatenumber') {
    return digilockerDocs?.incomeCertificate?.certificateNumber || undefined;
  }

  // Udyam MSME Number fallbacks
  if (leafKey === 'udyamnumber' || leafKey === 'msmenumber') {
    return digilockerDocs?.udyamCertificate?.udyamNumber || profile.udyamNumber || undefined;
  }

  // Enterprise Name
  if (leafKey === 'enterprisename' || leafKey === 'businessname') {
    return digilockerDocs?.udyamCertificate?.enterpriseName || profile.businessOrCourse || profile.businessName || `${profile.fullName || 'Citizen'} Enterprise`;
  }

  // State & Location fallbacks
  if (leafKey === 'state') {
    return profile.state || digilockerDocs?.aadhaar?.address?.state || undefined;
  }
  if (leafKey === 'district') {
    return profile.district || digilockerDocs?.aadhaar?.address?.district || undefined;
  }
  if (leafKey === 'pincode') {
    return profile.pincode || digilockerDocs?.aadhaar?.address?.pincode || '801105';
  }
  if (leafKey === 'address' || leafKey === 'line1') {
    return profile.address || digilockerDocs?.aadhaar?.address?.line1 || undefined;
  }

  // Gender & Age fallbacks
  if (leafKey === 'gender') {
    return profile.gender || digilockerDocs?.aadhaar?.gender || undefined;
  }
  if (leafKey === 'age') {
    return profile.age || undefined;
  }
  if (leafKey === 'dob' || leafKey === 'dateofbirth') {
    return profile.dob || digilockerDocs?.aadhaar?.dateOfBirth || undefined;
  }

  // Business Parameters
  if (leafKey === 'sector' || leafKey === 'businesssector') {
    return profile.sector || profile.businessSector || undefined;
  }
  if (leafKey === 'fundingamount' || leafKey === 'requestedamount' || leafKey === 'projectcost') {
    return profile.fundingAmount || profile.requestedAmount || undefined;
  }
  if (leafKey === 'annualturnover' || leafKey === 'turnover') {
    return profile.annualTurnover || undefined;
  }
  if (leafKey === 'stage' || leafKey === 'businessstage') {
    return profile.stage || 'Early Stage (< 2 Yrs)';
  }

  return undefined;
};

/**
 * Builds a pre-filled application form for a specific scheme.
 * 
 * @param {Object} scheme - Scheme model instance
 * @param {Object} profile - User's entrepreneur or citizen profile
 * @param {Object} [digilockerDocs] - Consented temporary DigiLocker documents
 * @returns {Object} Pre-filled application form with resolved and missing fields
 */
const buildPrefilledApplication = (scheme, profile = {}, digilockerDocs = {}) => {
  if (!scheme) {
    throw new Error('Scheme definition is required for application auto-fill.');
  }

  // Default form field definitions if not specified in scheme document
  const formFields = (scheme.applicationFormFields && scheme.applicationFormFields.length > 0)
    ? scheme.applicationFormFields
    : [
        { formField: 'Applicant Full Name', sourcePath: 'profile.fullName', required: true },
        { formField: 'Identity Proof (Aadhaar)', sourcePath: 'digilocker.aadhaar.maskedNumber', required: true },
        { formField: 'Gender', sourcePath: 'profile.gender', required: true },
        { formField: 'State of Domicile', sourcePath: 'profile.state', required: true },
        { formField: 'District', sourcePath: 'profile.district', required: true },
        { formField: 'Social Category', sourcePath: 'profile.category', required: true },
        { formField: 'Category Certificate No.', sourcePath: 'digilocker.casteCertificate.certificateNumber', required: false },
        { formField: 'Annual Family Income (INR)', sourcePath: 'profile.familyIncome', required: true },
        { formField: 'Income Certificate No.', sourcePath: 'digilocker.incomeCertificate.certificateNumber', required: false },
        { formField: 'Business / Project Sector', sourcePath: 'profile.sector', required: true },
        { formField: 'Total Estimated Project Cost / Funding Required (INR)', sourcePath: 'profile.fundingAmount', required: true },
        { formField: 'Udyam MSME Registration No.', sourcePath: 'digilocker.udyamCertificate.udyamNumber', required: false },
        { formField: 'Enterprise Name', sourcePath: 'digilocker.udyamCertificate.enterpriseName', required: false }
      ];

  const fieldEntries = [];
  let resolvedCount = 0;
  let requiredUnresolvedCount = 0;

  for (const item of formFields) {
    const rawVal = resolveSourcePath(item.sourcePath, profile, digilockerDocs);
    const isResolved = rawVal !== undefined && rawVal !== null && rawVal !== '';

    if (isResolved) {
      resolvedCount++;
    } else if (item.required) {
      requiredUnresolvedCount++;
    }

    fieldEntries.push({
      formField: item.formField,
      sourcePath: item.sourcePath,
      required: Boolean(item.required),
      value: isResolved ? rawVal : '',
      isResolved,
      sourceOrigin: item.sourcePath.startsWith('digilocker') ? 'DigiLocker Verified' : 'User Profile'
    });
  }

  const completionPercentage = Math.round((resolvedCount / Math.max(1, formFields.length)) * 100);

  return {
    schemeId: scheme._id || scheme.slug,
    schemeName: scheme.name,
    schemeSlug: scheme.slug,
    provider: scheme.provider,
    officialUrl: scheme.officialUrl,
    maximumSupport: scheme.maximumSupport,
    subsidyPercentage: scheme.subsidyPercentage,
    completionPercentage,
    isReadyForSubmission: requiredUnresolvedCount === 0,
    totalFieldsCount: formFields.length,
    resolvedFieldsCount: resolvedCount,
    missingRequiredFieldsCount: requiredUnresolvedCount,
    fields: fieldEntries,
    generatedAt: new Date().toISOString()
  };
};

/**
 * Builds a guided copy-paste walkthrough for a scheme, enriching each step's
 * needed fields with live resolved values from profile/DigiLocker.
 * 
 * @param {Object} scheme - Scheme model instance
 * @param {Object} profile - User's entrepreneur or citizen profile
 * @param {Object} [digilockerDocs] - Consented temporary DigiLocker documents
 * @returns {Object} Guided walkthrough data with resolved values
 */
const buildGuidedWalkthrough = (scheme, profile = {}, digilockerDocs = {}) => {
  if (!scheme) {
    throw new Error('Scheme definition is required for guided walkthrough.');
  }

  const defaultSteps = [
    {
      stepNumber: 1,
      stepTitle: 'Access Official Portal & Register',
      instruction: `Visit the official portal (${scheme.officialUrl}) and click on "New Beneficiary Registration" or "Apply Online".`,
      screenshotUrl: '/screenshots/portal_step1_register.png',
      fieldsNeeded: [
        { fieldLabel: 'Applicant Full Name', sourcePath: 'profile.fullName', tip: 'Enter exactly as printed on Aadhaar' },
        { fieldLabel: 'Identity Number (Aadhaar)', sourcePath: 'digilocker.aadhaar.maskedNumber', tip: 'Masked Aadhaar UID' },
        { fieldLabel: 'Mobile Number', sourcePath: 'profile.phone', tip: 'Aadhaar-linked mobile number' }
      ],
      commonPitfall: 'Ensure mobile number is actively linked with Aadhaar for OTP verification.',
      isPlaceholderContent: true
    },
    {
      stepNumber: 2,
      stepTitle: 'Personal & Demographic Details',
      instruction: 'Enter your category, state of residence, and family annual income in Section 2.',
      screenshotUrl: '/screenshots/portal_step2_demographics.png',
      fieldsNeeded: [
        { fieldLabel: 'Social Category', sourcePath: 'profile.category', tip: 'Select SC/ST/OBC/General matching certificate' },
        { fieldLabel: 'State / UT', sourcePath: 'profile.state', tip: 'State where enterprise will be set up' },
        { fieldLabel: 'Annual Family Income (₹)', sourcePath: 'profile.familyIncome', tip: 'Must match Tehsildar income certificate' }
      ],
      commonPitfall: 'Income entered on the portal must match the exact number in your official income certificate to avoid rejection.',
      isPlaceholderContent: true
    },
    {
      stepNumber: 3,
      stepTitle: 'Enterprise & Project Proposal',
      instruction: 'Select your business sector, describe the activity, and input the total capital project cost.',
      screenshotUrl: '/screenshots/portal_step3_project.png',
      fieldsNeeded: [
        { fieldLabel: 'Business Sector', sourcePath: 'profile.sector', tip: 'Manufacturing / Service activity' },
        { fieldLabel: 'Total Project Cost (₹)', sourcePath: 'profile.fundingAmount', tip: 'Total loan + margin money requirement' },
        { fieldLabel: 'Udyam Registration No.', sourcePath: 'digilocker.udyamCertificate.udyamNumber', tip: 'Leave blank if new greenfield unit' }
      ],
      commonPitfall: 'Do not exceed the maximum allowed ceiling for project cost specified in the scheme guidelines.',
      isPlaceholderContent: true
    },
    {
      stepNumber: 4,
      stepTitle: 'Upload Documents & Submit Application',
      instruction: 'Upload required PDF certificates and project report, review summary, and submit.',
      screenshotUrl: '/screenshots/portal_step4_upload.png',
      fieldsNeeded: [
        { fieldLabel: 'Category Certificate No.', sourcePath: 'digilocker.casteCertificate.certificateNumber', tip: 'Official state certificate reference' },
        { fieldLabel: 'Income Certificate No.', sourcePath: 'digilocker.incomeCertificate.certificateNumber', tip: 'Valid e-District certificate number' }
      ],
      commonPitfall: 'All uploaded scans must be under 2MB and clearly legible with official seal visible.',
      isPlaceholderContent: true
    }
  ];

  const stepsToUse = (scheme.applicationWalkthrough && scheme.applicationWalkthrough.length > 0)
    ? scheme.applicationWalkthrough
    : defaultSteps;

  const enrichedSteps = stepsToUse.map(step => {
    const fieldsWithValues = (step.fieldsNeeded || []).map(f => {
      const resolvedValue = resolveSourcePath(f.sourcePath, profile, digilockerDocs);
      return {
        fieldLabel: f.fieldLabel,
        sourcePath: f.sourcePath,
        tip: f.tip || '',
        resolvedValue: resolvedValue !== undefined && resolvedValue !== null ? String(resolvedValue) : '',
        hasValue: resolvedValue !== undefined && resolvedValue !== null && resolvedValue !== ''
      };
    });

    return {
      stepNumber: step.stepNumber,
      stepTitle: step.stepTitle,
      instruction: step.instruction,
      screenshotUrl: step.screenshotUrl || null,
      commonPitfall: step.commonPitfall || null,
      isPlaceholderContent: Boolean(step.isPlaceholderContent),
      fieldsNeeded: fieldsWithValues
    };
  });

  return {
    schemeId: scheme._id || scheme.slug,
    schemeName: scheme.name,
    schemeSlug: scheme.slug,
    officialUrl: scheme.officialUrl,
    totalSteps: enrichedSteps.length,
    steps: enrichedSteps,
    disclaimer: 'Guided Application Co-Pilot provides step-by-step guidance and 1-click clipboard copying for official portal entry. YojnaSetu does not automate or bypass external government website authentication.'
  };
};

module.exports = {
  resolveSourcePath,
  buildPrefilledApplication,
  buildGuidedWalkthrough
};

