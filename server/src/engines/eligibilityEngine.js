/**
 * Eligibility Matching Engine - YojnaSetu AI
 * Evaluates mandatory (Hard) criteria for a given profile against a specific scheme's rules.
 * 
 * Result States:
 * 🟢 POTENTIALLY_ELIGIBLE: All mandatory criteria are satisfied or flexible.
 * 🟡 VERIFY: Key criteria are missing in profile or need official verification.
 * 🔴 NOT_ELIGIBLE: At least one mandatory criterion explicitly fails.
 */

const evaluateEligibility = (profile, scheme) => {
  const failedCriteria = [];
  const verifyCriteria = [];
  const matchedCriteria = [];

  if (!profile || !scheme) {
    return {
      status: 'VERIFY',
      matchedCriteria: [],
      failedCriteria: [],
      verifyCriteria: ['Profile or scheme definition missing.']
    };
  }

  // 1. AGE CHECK
  if (profile.age) {
    const minAge = scheme.minAge || 18;
    const maxAge = scheme.maxAge || 65;
    if (profile.age < minAge || profile.age > maxAge) {
      failedCriteria.push({
        field: 'Age',
        required: `${minAge} - ${maxAge} years`,
        actual: `${profile.age} years`,
        reason: `Age must be between ${minAge} and ${maxAge}.`
      });
    } else {
      matchedCriteria.push(`Age (${profile.age}) meets required range (${minAge}-${maxAge} years).`);
    }
  } else {
    verifyCriteria.push('Age not provided in profile.');
  }

  // 2. GENDER ELIGIBILITY
  if (scheme.genderEligibility && scheme.genderEligibility !== 'All') {
    if (scheme.genderEligibility === 'Female Only' && profile.gender !== 'Female' && !profile.isWomanEntrepreneur) {
      failedCriteria.push({
        field: 'Gender Eligibility',
        required: 'Female Entrepreneur',
        actual: profile.gender || 'Not specified',
        reason: 'Scheme is exclusively reserved for female entrepreneurs.'
      });
    } else if (profile.gender === 'Female' || profile.isWomanEntrepreneur) {
      matchedCriteria.push('Female entrepreneur preference satisfied.');
    }
  }

  // 3. SOCIAL CATEGORY ELIGIBILITY
  if (scheme.categories && scheme.categories.length > 0 && !scheme.categories.includes('All')) {
    if (profile.category) {
      if (!scheme.categories.includes(profile.category)) {
        failedCriteria.push({
          field: 'Category',
          required: scheme.categories.join(', '),
          actual: profile.category,
          reason: `Targeted specifically at ${scheme.categories.join(', ')} applicants.`
        });
      } else {
        matchedCriteria.push(`Social category (${profile.category}) qualifies for this scheme.`);
      }
    } else {
      verifyCriteria.push(`Category certification verification required for ${scheme.categories.join(', ')}.`);
    }
  }

  // 4. STATE / GEOGRAPHY ELIGIBILITY
  if (scheme.states && scheme.states.length > 0 && !scheme.states.includes('All')) {
    if (profile.state) {
      if (!scheme.states.includes(profile.state)) {
        failedCriteria.push({
          field: 'State Location',
          required: scheme.states.join(', '),
          actual: profile.state,
          reason: `Scheme is restricted to beneficiaries in ${scheme.states.join(', ')}.`
        });
      } else {
        matchedCriteria.push(`Location (${profile.state}) falls within supported state region.`);
      }
    } else {
      verifyCriteria.push('State location needs confirmation.');
    }
  }

  // 5. AREA TYPE (RURAL / URBAN)
  if (scheme.areaEligibility && scheme.areaEligibility !== 'Both') {
    if (profile.areaType) {
      if (scheme.areaEligibility !== profile.areaType) {
        failedCriteria.push({
          field: 'Area Type',
          required: `${scheme.areaEligibility} area`,
          actual: profile.areaType,
          reason: `Scheme applies strictly to ${scheme.areaEligibility} businesses.`
        });
      } else {
        matchedCriteria.push(`Business location area type (${profile.areaType}) matches.`);
      }
    }
  }

  // 6. ANNUAL FAMILY INCOME LIMIT
  if (scheme.maxFamilyIncome && scheme.maxFamilyIncome > 0) {
    if (profile.familyIncome && profile.familyIncome > 0) {
      if (profile.familyIncome > scheme.maxFamilyIncome) {
        failedCriteria.push({
          field: 'Annual Family Income',
          required: `Up to ₹${(scheme.maxFamilyIncome / 100000).toFixed(2)} Lakh`,
          actual: `₹${(profile.familyIncome / 100000).toFixed(2)} Lakh`,
          reason: `Family annual income exceeds upper limit of ₹${(scheme.maxFamilyIncome / 100000).toFixed(2)} Lakh.`
        });
      } else {
        matchedCriteria.push(`Family income (₹${(profile.familyIncome / 100000).toFixed(2)}L) is within stated limit of ₹${(scheme.maxFamilyIncome / 100000).toFixed(2)}L.`);
      }
    } else {
      verifyCriteria.push(`Requires income certificate showing income <= ₹${(scheme.maxFamilyIncome / 100000).toFixed(2)} Lakh.`);
    }
  }

  // 7. ANNUAL BUSINESS TURNOVER LIMIT
  if (scheme.maxAnnualTurnover && scheme.maxAnnualTurnover > 0) {
    if (profile.annualTurnover && profile.annualTurnover > scheme.maxAnnualTurnover) {
      failedCriteria.push({
        field: 'Annual Turnover Limit',
        required: `Up to ₹${(scheme.maxAnnualTurnover / 100000).toFixed(2)} Lakh`,
        actual: `₹${(profile.annualTurnover / 100000).toFixed(2)} Lakh`,
        reason: `Annual business turnover exceeds maximum allowed threshold.`
      });
    }
  }

  // 8. BUSINESS STAGE
  if (scheme.businessStages && scheme.businessStages.length > 0) {
    if (profile.stage) {
      if (!scheme.businessStages.includes(profile.stage)) {
        failedCriteria.push({
          field: 'Business Stage',
          required: scheme.businessStages.join(' or '),
          actual: profile.stage,
          reason: `Scheme is tailored for ${scheme.businessStages.join('/')} enterprises.`
        });
      } else {
        matchedCriteria.push(`Business stage (${profile.stage}) matches target criteria.`);
      }
    } else {
      verifyCriteria.push('Business stage needs verification.');
    }
  }

  // Determine overall status
  let status = 'POTENTIALLY_ELIGIBLE';
  if (failedCriteria.length > 0) {
    status = 'NOT_ELIGIBLE';
  } else if (verifyCriteria.length > 0) {
    status = 'VERIFY';
  }

  return {
    status,
    matchedCriteria,
    failedCriteria,
    verifyCriteria
  };
};

module.exports = { evaluateEligibility };
