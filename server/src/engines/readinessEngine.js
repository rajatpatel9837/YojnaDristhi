/**
 * Application Readiness Engine - YojnaSetu AI
 * Analyzes document readiness, profile completeness, missing requirements,
 * and gap analyses ("You are close to qualifying").
 */

const calculateReadiness = (profile, scheme) => {
  if (!scheme || !scheme.requiredDocuments) {
    return {
      readinessScore: 60,
      availableDocuments: [],
      missingDocuments: [],
      missingRequirements: [],
      gapAnalysis: []
    };
  }

  const userDocs = profile.documentsAvailable || [];
  const required = scheme.requiredDocuments || [];

  const availableDocuments = [];
  const missingDocuments = [];

  required.forEach(doc => {
    // Check if user has this document or similar substring
    const hasDoc = userDocs.some(userDoc => 
      userDoc.toLowerCase().includes(doc.toLowerCase()) || 
      doc.toLowerCase().includes(userDoc.toLowerCase())
    );

    if (hasDoc) {
      availableDocuments.push(doc);
    } else {
      missingDocuments.push(doc);
    }
  });

  // Calculate Document Readiness %
  const totalRequired = Math.max(1, required.length);
  const docReadinessScore = Math.round((availableDocuments.length / totalRequired) * 100);

  // Profile readiness factors
  let profileFactors = 0;
  let totalFactors = 4;
  if (profile.businessName) profileFactors++;
  if (profile.udyamStatus && profile.udyamStatus === 'Registered') profileFactors++;
  if (profile.hasIncomeCertificate) profileFactors++;
  if (profile.fundingPurpose) profileFactors++;

  const overallReadinessScore = Math.min(100, Math.round((docReadinessScore * 0.7) + ((profileFactors / totalFactors) * 30)));

  // Generate Gap Analysis ("You are close to qualifying")
  const gapAnalysis = [];
  if (missingDocuments.includes('Udyam Certificate') || (profile.udyamStatus && profile.udyamStatus !== 'Registered')) {
    gapAnalysis.push({
      item: 'Udyam Business Registration',
      action: 'Register for free on the Udyam portal to fulfill business registration requirement.',
      impact: '+15% Readiness'
    });
  }

  if (missingDocuments.includes('Project Report')) {
    gapAnalysis.push({
      item: 'Detailed Project Report (DPR)',
      action: 'Prepare project report detailing proposed machinery, cost estimates, and financial projections.',
      impact: '+20% Readiness'
    });
  }

  if (missingDocuments.includes('Income Certificate')) {
    gapAnalysis.push({
      item: 'Income Certificate',
      action: 'Obtain Income Certificate from Revenue Department / Tehsildar office.',
      impact: '+15% Readiness'
    });
  }

  return {
    readinessScore: overallReadinessScore,
    docReadinessScore,
    availableDocuments,
    missingDocuments,
    gapAnalysis
  };
};

module.exports = { calculateReadiness };
