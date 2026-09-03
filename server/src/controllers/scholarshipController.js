const Scholarship = require('../models/Scholarship');
const { mockScholarships } = require('../seed/seedData');

const mongoose = require('mongoose');

const getActiveScholarships = async () => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const dbData = await Scholarship.find({});
      if (dbData && dbData.length > 0) return dbData;
    }
  } catch (err) {
    console.warn('Scholarship DB fetch failed, using fallback.');
  }
  return mockScholarships.map((s, idx) => ({ ...s, _id: `mock_schol_${idx + 1}` }));
};

const matchScholarships = async (req, res) => {
  try {
    const studentProfile = req.body;
    const scholarships = await getActiveScholarships();

    const results = scholarships.map(sch => {
      let isEligible = true;
      const reasons = [];
      const failed = [];

      // Category check
      if (sch.categories && sch.categories.length > 0 && !sch.categories.includes('All')) {
        if (studentProfile.category && sch.categories.includes(studentProfile.category)) {
          reasons.push(`Social category (${studentProfile.category}) qualifies.`);
        } else if (studentProfile.category) {
          isEligible = false;
          failed.push(`Requires ${sch.categories.join('/')} category.`);
        }
      }

      // Income limit check
      if (sch.maxFamilyIncome > 0 && studentProfile.familyIncome > 0) {
        if (studentProfile.familyIncome <= sch.maxFamilyIncome) {
          reasons.push(`Income (₹${(studentProfile.familyIncome/100000).toFixed(2)}L) within limit.`);
        } else {
          isEligible = false;
          failed.push(`Income exceeds cap of ₹${(sch.maxFamilyIncome/100000).toFixed(2)}L.`);
        }
      }

      // Marks check
      if (studentProfile.marksPercentage > 0 && studentProfile.marksPercentage >= sch.minMarksPercentage) {
        reasons.push(`Academic marks (${studentProfile.marksPercentage}%) meet cutoff (${sch.minMarksPercentage}%).`);
      }

      const matchScore = isEligible ? 92 : 35;

      return {
        scholarship: sch,
        isEligible,
        matchScore,
        reasons,
        failed
      };
    });

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllScholarships = async (req, res) => {
  try {
    const data = await getActiveScholarships();
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { matchScholarships, getAllScholarships };
