const ChannelPartner = require('../models/ChannelPartner');
const { mockPartners } = require('../seed/seedData');
const { predictMLPartnerMatchScore } = require('../engines/mlPredictorEngine');

// Haversine formula for distance calculation in kilometers
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

const getNearbyPartners = async (req, res) => {
  try {
    const { lat, lng, state, schemeSlug } = req.query;

    const userLat = parseFloat(lat) || 25.6115; // Default Patna coordinates
    const userLng = parseFloat(lng) || 85.144;

    let partners = [];
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        partners = await ChannelPartner.find({});
      } catch (err) {
        console.warn('Partners DB query failed, fallback to mock.');
      }
    }

    if (!partners || partners.length === 0) {
      partners = mockPartners.map((p, idx) => ({ ...p, _id: `mock_partner_${idx + 1}` }));
    }

    const partnersWithDistance = partners.map(partner => {
      const pLat = partner.location ? partner.location.lat : 25.6115;
      const pLng = partner.location ? partner.location.lng : 85.144;
      const distance = calculateHaversineDistance(userLat, userLng, pLat, pLng);

      const supportsMatchedScheme = schemeSlug 
        ? (partner.supportedSchemeSlugs && partner.supportedSchemeSlugs.includes(schemeSlug))
        : true;

      // Invoke ML Partner Match Predictor
      const mlPartnerRes = predictMLPartnerMatchScore(partner, distance, supportsMatchedScheme);
      const suitabilityScore = mlPartnerRes.mlPartnerMatchScore;

      return {
        ...partner.toObject ? partner.toObject() : partner,
        distanceKm: distance,
        supportsMatchedScheme,
        suitabilityScore,
        mlMatchScore: suitabilityScore,
        evaluatedByML: true
      };
    });


    // Filter by state if provided and not 'All'
    let filtered = partnersWithDistance;
    if (state && state !== 'All') {
      filtered = partnersWithDistance.filter(p => p.state === state || p.distanceKm < 50);
    }

    filtered.sort((a, b) => b.suitabilityScore - a.suitabilityScore || a.distanceKm - b.distanceKm);

    res.json({
      success: true,
      count: filtered.length,
      userLocation: { lat: userLat, lng: userLng, state },
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNearbyPartners };
