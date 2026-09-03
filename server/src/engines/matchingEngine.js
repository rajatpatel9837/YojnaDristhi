/**
 * Matching Engine - YojnaSetu AI
 * Calculates a weighted compatibility score (0-100%) for candidate schemes.
 * Weights:
 * - Eligibility fit: 40%
 * - Business/sector fit: 20%
 * - Funding requirement fit: 15%
 * - Beneficiary/profile fit: 10%
 * - Location fit: 10%
 * - Data completeness: 5%
 */

const calculateMatchScore = (profile, scheme, eligibilityResult) => {
  if (!profile || !scheme) return { matchScore: 0, breakdown: {} };

  // If hard eligibility fails completely, return a low/zero score
  if (eligibilityResult.status === 'NOT_ELIGIBLE') {
    return {
      matchScore: 15,
      breakdown: {
        eligibilityFit: 0,
        sectorFit: 10,
        fundingFit: 5,
        profileFit: 0,
        locationFit: 0,
        completenessFit: 0
      }
    };
  }

  // 1. Eligibility Fit (Max 40 points)
  let eligibilityFit = 40;
  if (eligibilityResult.status === 'VERIFY') {
    const penalty = eligibilityResult.verifyCriteria.length * 8;
    eligibilityFit = Math.max(15, 40 - penalty);
  }

  // 2. Business / Sector Fit (Max 20 points)
  let sectorFit = 10;
  if (scheme.sectors && scheme.sectors.length > 0) {
    if (scheme.sectors.includes('All') || (profile.sector && scheme.sectors.includes(profile.sector))) {
      sectorFit = 20;
    } else {
      sectorFit = 5;
    }
  } else {
    sectorFit = 15;
  }

  // 3. Funding Requirement Fit (Max 15 points)
  let fundingFit = 10;
  if (profile.fundingAmount && profile.fundingAmount > 0) {
    const min = scheme.minimumSupport || 0;
    const max = scheme.maximumSupport || 10000000;
    if (profile.fundingAmount >= min && profile.fundingAmount <= max) {
      fundingFit = 15;
    } else if (profile.fundingAmount < min) {
      fundingFit = 8;
    } else {
      fundingFit = 10;
    }
  }

  // 4. Beneficiary / Social Profile Fit (Max 10 points)
  let profileFit = 5;
  if (profile.category && scheme.categories && scheme.categories.includes(profile.category)) {
    profileFit += 3;
  }
  if (profile.isWomanEntrepreneur && (scheme.genderEligibility === 'Female Only' || scheme.name.includes('Woman') || scheme.name.includes('Mahila'))) {
    profileFit += 2;
  }
  profileFit = Math.min(10, profileFit + 2);

  // 5. Location Fit (Max 10 points)
  let locationFit = 5;
  if (scheme.states && (scheme.states.includes('All') || scheme.states.includes(profile.state))) {
    locationFit = 10;
  }

  // 6. Data Completeness (Max 5 points)
  let completenessCount = 0;
  if (profile.age) completenessCount++;
  if (profile.state) completenessCount++;
  if (profile.sector) completenessCount++;
  if (profile.annualTurnover !== undefined) completenessCount++;
  if (profile.fundingAmount) completenessCount++;
  const completenessFit = Math.min(5, Math.round((completenessCount / 5) * 5));

  const totalScore = Math.min(99, eligibilityFit + sectorFit + fundingFit + profileFit + locationFit + completenessFit);

  return {
    matchScore: totalScore,
    breakdown: {
      eligibilityFit,
      sectorFit,
      fundingFit,
      profileFit,
      locationFit,
      completenessFit
    }
  };
};

module.exports = { calculateMatchScore };
