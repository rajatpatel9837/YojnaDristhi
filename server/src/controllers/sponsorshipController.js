const Sponsorship = require('../models/Sponsorship');

const getSponsorshipCampaigns = async (req, res) => {
  try {
    let campaigns = [];
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        campaigns = await Sponsorship.find({});
      } catch (e) {}
    }

    if (!campaigns || campaigns.length === 0) {
      campaigns = [
        {
          _id: 'sp_101',
          title: 'Solar Powered Grain Mill for Rural Women Group',
          beneficiaryCode: 'YS-BEN-1024',
          businessCategory: 'Food processing / Rural Tech',
          story: 'Sunita Devi wants to upgrade her village flour mill with a zero-emission solar processing unit to serve 400 local farmers in Patna district.',
          targetAmount: 50000,
          raisedAmount: 32000,
          state: 'Bihar',
          status: 'ACTIVE',
          contributions: [
            { sponsorName: 'Anand Kumar', amount: 20000, isAnonymous: false, date: new Date() },
            { sponsorName: 'Anonymous Sponsor', amount: 12000, isAnonymous: true, date: new Date() }
          ]
        },
        {
          _id: 'sp_102',
          title: 'Weaving Handloom Expansion for Artisan Cooperative',
          beneficiaryCode: 'YS-BEN-1088',
          businessCategory: 'Textiles & Handicrafts',
          story: 'Rameshwar Mahato needs upgraded handloom machinery to train 12 tribal youth weavers in Ranchi.',
          targetAmount: 40000,
          raisedAmount: 18000,
          state: 'Jharkhand',
          status: 'ACTIVE',
          contributions: [
            { sponsorName: 'Rohan Sharma', amount: 18000, isAnonymous: false, date: new Date() }
          ]
        }
      ];
    }

    res.json({ success: true, count: campaigns.length, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const contributeSponsorship = async (req, res) => {
  try {
    const { campaignId, amount, sponsorName, isAnonymous } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid sponsorship amount required.' });
    }

    const transactionId = 'TXN_DEMO_' + Math.floor(100000 + Math.random() * 900000);

    let campaign;
    try {
      campaign = await Sponsorship.findById(campaignId);
      if (campaign) {
        campaign.raisedAmount += Number(amount);
        campaign.contributions.push({
          sponsorName: isAnonymous ? 'Anonymous Sponsor' : (sponsorName || 'Sponsor'),
          amount: Number(amount),
          isAnonymous: !!isAnonymous,
          transactionId,
          date: new Date()
        });
        if (campaign.raisedAmount >= campaign.targetAmount) {
          campaign.status = 'FULFILLED';
        }
        await campaign.save();
      }
    } catch (e) {}

    res.json({
      success: true,
      transactionId,
      message: 'Demo payment successful! Thank you for empowering this beneficiary.',
      receipt: {
        campaignId,
        amount,
        sponsorName: isAnonymous ? 'Anonymous' : sponsorName,
        transactionId,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSponsorshipCampaigns, contributeSponsorship };
