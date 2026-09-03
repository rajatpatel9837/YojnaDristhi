const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const EntrepreneurProfile = require('../models/EntrepreneurProfile');
const Scheme = require('../models/Scheme');
const Scholarship = require('../models/Scholarship');
const ChannelPartner = require('../models/ChannelPartner');
const Organization = require('../models/Organization');
const Opportunity = require('../models/Opportunity');
const VerificationAuditLog = require('../models/VerificationAuditLog');
const SchemeSource = require('../models/SchemeSource');
const Sponsorship = require('../models/Sponsorship');

const mockSchemes = [
  {
    name: 'Prime Minister Employment Generation Programme (PMEGP)',
    slug: 'pmegp-micro-units-grant-loan',
    provider: 'Khadi and Village Industries Commission (KVIC) / Ministry of MSME',
    ministry: 'Ministry of Micro, Small & Medium Enterprises',
    department: 'KVIC',
    sourceType: 'Central Government',
    description: 'Credit-linked subsidy program to generate self-employment opportunities through establishment of micro-enterprises in non-farm sector.',
    category: 'Subsidy',
    targetBeneficiaries: ['Entrepreneur', 'SC/ST', 'Woman', 'Rural Youth', 'Artisans'],
    businessTypes: ['Proprietary', 'Partnership', 'Individual'],
    sectors: ['Manufacturing', 'Services', 'Food processing', 'Textiles', 'Handicrafts', 'Dairy'],
    states: ['All'],
    areaEligibility: 'Both',
    categories: ['SC', 'ST', 'OBC', 'EWS', 'General'],
    genderEligibility: 'All',
    minAge: 18,
    maxAge: 65,
    maxFamilyIncome: 0, // No income cap
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 5000000,
    businessStages: ['New business', 'Expansion'],
    isUdyamRequired: true,
    fundingType: 'Subsidy',
    minimumSupport: 100000,
    maximumSupport: 5000000, // ₹50 Lakh for manufacturing, ₹20 Lakh for service
    financingPercentage: 90,
    interestRate: 8.5,
    subsidyPercentage: 35, // 35% for Special Category (SC/ST/OBC/Woman/Rural)
    subsidyDetails: '35% margin money subsidy in rural areas for SC/ST/OBC/Women/PwD; 25% in urban areas. 15-25% for general category.',
    marginMoneyPercentage: 5,
    moratoriumPeriodMonths: 6,
    repaymentPeriodYears: 7,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Income Certificate',
      'Category Certificate',
      'Business Registration',
      'Project Report',
      'Udyam Certificate'
    ],
    officialUrl: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
    sourceUrl: 'https://msme.gov.in/pmegp',
    sourceName: 'Official KVIC Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'Pradhan Mantri MUDRA Yojana (Kishore & Tarun Category)',
    slug: 'mudra-loan-micro-enterprise',
    provider: 'MUDRA Ltd / Micro Units Development & Refinance Agency',
    ministry: 'Ministry of Finance',
    department: 'Department of Financial Services',
    sourceType: 'PSB / Bank Scheme',
    description: 'Collateral-free business loans up to ₹10 Lakh for non-corporate, non-farm small/micro enterprises.',
    category: 'Micro Finance',
    targetBeneficiaries: ['Entrepreneur', 'SC/ST', 'Woman', 'Small Vendor'],
    businessTypes: ['Proprietary', 'Partnership', 'Self Employed'],
    sectors: ['Manufacturing', 'Services', 'Retail', 'Transport', 'Food processing', 'Trading'],
    states: ['All'],
    areaEligibility: 'Both',
    categories: ['SC', 'ST', 'OBC', 'EWS', 'General'],
    genderEligibility: 'All',
    minAge: 18,
    maxAge: 65,
    maxFamilyIncome: 0,
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 1000000,
    businessStages: ['Idea', 'New business', 'Existing business', 'Expansion'],
    isUdyamRequired: false,
    fundingType: 'Loan',
    minimumSupport: 50000,
    maximumSupport: 1000000, // ₹10 Lakh (Tarun category)
    financingPercentage: 100,
    interestRate: 9.25,
    subsidyPercentage: 0,
    subsidyDetails: 'No direct cash subsidy, but zero collateral and lower processing fee for micro-units.',
    marginMoneyPercentage: 10,
    moratoriumPeriodMonths: 6,
    repaymentPeriodYears: 5,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Bank Statement',
      'Business Registration'
    ],
    officialUrl: 'https://www.mudra.org.in/',
    sourceUrl: 'https://www.mudra.org.in/Offerings',
    sourceName: 'Official MUDRA Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'Stand-Up India Scheme for SC/ST and Women Entrepreneurs',
    slug: 'stand-up-india-sc-st-women',
    provider: 'Small Industries Development Bank of India (SIDBI)',
    ministry: 'Ministry of Finance / MoSJE',
    department: 'Financial Services',
    sourceType: 'MoSJE Program',
    description: 'Bank loans between ₹10 Lakh and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch.',
    category: 'Term Loan',
    targetBeneficiaries: ['SC/ST', 'Woman', 'Entrepreneur'],
    businessTypes: ['Proprietary', 'Partnership', 'Individual'],
    sectors: ['Manufacturing', 'Services', 'Agriculture allied', 'Trading'],
    states: ['All'],
    areaEligibility: 'Both',
    categories: ['SC', 'ST'],
    genderEligibility: 'Female Only', // Or SC/ST
    minAge: 18,
    maxAge: 65,
    maxFamilyIncome: 0,
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 10000000,
    businessStages: ['New business', 'Greenfield enterprise'],
    isUdyamRequired: true,
    fundingType: 'Loan',
    minimumSupport: 1000000,
    maximumSupport: 10000000, // ₹1 Crore
    financingPercentage: 85,
    interestRate: 8.1,
    subsidyPercentage: 0,
    subsidyDetails: 'Convergence with state credit guarantee funds & margin money assistance under government convergence programs.',
    marginMoneyPercentage: 15,
    moratoriumPeriodMonths: 18,
    repaymentPeriodYears: 7,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Category Certificate',
      'Business Registration',
      'Project Report',
      'Udyam Certificate'
    ],
    officialUrl: 'https://www.standupmitra.in/',
    sourceUrl: 'https://www.standupmitra.in/Home/SUIScheme',
    sourceName: 'Official Stand-Up Mitra Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'Venture Capital Fund for Scheduled Castes (VCF-SC)',
    slug: 'vcf-sc-mosje-entrepreneur-fund',
    provider: 'IFCI Venture Capital / Ministry of Social Justice and Empowerment',
    ministry: 'Ministry of Social Justice and Empowerment (MoSJE)',
    department: 'Department of Social Justice',
    sourceType: 'MoSJE Program',
    description: 'Concessional finance and equity support to Scheduled Caste entrepreneurs to promote entrepreneurship and economic empowerment.',
    category: 'Grant',
    targetBeneficiaries: ['SC', 'Entrepreneur', 'Technology'],
    businessTypes: ['Company', 'Partnership'],
    sectors: ['Manufacturing', 'Services', 'Technology', 'Food processing'],
    states: ['All'],
    areaEligibility: 'Both',
    categories: ['SC'],
    genderEligibility: 'All',
    minAge: 18,
    maxAge: 60,
    maxFamilyIncome: 0,
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 50000000,
    businessStages: ['Existing business', 'Expansion'],
    isUdyamRequired: true,
    fundingType: 'Grant',
    minimumSupport: 2000000,
    maximumSupport: 50000000, // ₹5 Crore
    financingPercentage: 75,
    interestRate: 4.0, // Highly subsidized for SC entrepreneurs
    subsidyPercentage: 20,
    subsidyDetails: 'Concessional rate of interest (4% p.a. for female SC entrepreneurs, 4.75% for male SC entrepreneurs).',
    marginMoneyPercentage: 10,
    moratoriumPeriodMonths: 24,
    repaymentPeriodYears: 8,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Category Certificate',
      'Income Certificate',
      'Business Registration',
      'Project Report',
      'Udyam Certificate'
    ],
    officialUrl: 'https://socialjustice.gov.in/schemes/42',
    sourceUrl: 'https://ifciventure.com/vcf-sc/',
    sourceName: 'MoSJE Official Schemes Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'Special Credit Linked Capital Subsidy Scheme (SCLCSS) for SC/ST MSMEs',
    slug: 'sclcss-capital-subsidy-machinery',
    provider: 'Ministry of MSME / National SC ST Hub (NSSH)',
    ministry: 'Ministry of Micro, Small & Medium Enterprises',
    department: 'National SC-ST Hub',
    sourceType: 'Central Government',
    description: '25% capital subsidy on institutional finance for procurement of plant and machinery to SC/ST entrepreneurs in manufacturing & services.',
    category: 'Equipment Finance',
    targetBeneficiaries: ['SC/ST', 'Entrepreneur'],
    businessTypes: ['Proprietary', 'Partnership', 'Individual'],
    sectors: ['Manufacturing', 'Services', 'Food processing', 'Textiles'],
    states: ['All'],
    areaEligibility: 'Both',
    categories: ['SC', 'ST'],
    genderEligibility: 'All',
    minAge: 18,
    maxAge: 65,
    maxFamilyIncome: 0,
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 10000000,
    businessStages: ['Existing business', 'Expansion'],
    isUdyamRequired: true,
    fundingType: 'Subsidy',
    minimumSupport: 500000,
    maximumSupport: 2500000, // Up to 25% of ₹1 Crore investment
    financingPercentage: 75,
    interestRate: 8.5,
    subsidyPercentage: 25,
    subsidyDetails: '25% upfront capital subsidy provided directly through primary lending institutions.',
    marginMoneyPercentage: 10,
    moratoriumPeriodMonths: 12,
    repaymentPeriodYears: 5,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Category Certificate',
      'Business Registration',
      'Project Report',
      'Udyam Certificate'
    ],
    officialUrl: 'https://www.scsthub.in/schemes/sclcss',
    sourceUrl: 'https://msme.gov.in/',
    sourceName: 'National SC ST Hub',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'PM Vishwakarma Scheme for Traditional Artisans and Craftspeople',
    slug: 'pm-vishwakarma-artisans-toolkit-loan',
    provider: 'Ministry of Micro, Small & Medium Enterprises (MoMSME)',
    ministry: 'Ministry of Micro, Small & Medium Enterprises',
    department: 'Development Commissioner MSME',
    sourceType: 'Central Government',
    description: 'Collateral-free credit support up to ₹3 Lakh at concessional 5% interest rate + ₹15,000 toolkit incentive for traditional artisans (weavers, potters, carpenters, blacksmiths, cobblers).',
    category: 'Subsidy',
    targetBeneficiaries: ['Artisans', 'Entrepreneur', 'SC/ST', 'Woman', 'Rural Youth'],
    businessTypes: ['Proprietary', 'Individual', 'Family Enterprise'],
    sectors: ['Handicrafts', 'Textiles', 'Services', 'Manufacturing'],
    states: ['All'],
    areaEligibility: 'Both',
    categories: ['SC', 'ST', 'OBC', 'EWS', 'General'],
    genderEligibility: 'All',
    minAge: 18,
    maxAge: 65,
    maxFamilyIncome: 0,
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 300000,
    businessStages: ['New business', 'Existing business', 'Expansion'],
    isUdyamRequired: false,
    fundingType: 'Subsidy',
    minimumSupport: 50000,
    maximumSupport: 300000, // ₹3 Lakh
    financingPercentage: 95,
    interestRate: 5.0, // Subsidized 5% interest
    subsidyPercentage: 15,
    subsidyDetails: '₹15,000 e-voucher for toolkit + 8% interest subvention by Ministry of MSME + skill training stipend of ₹500/day.',
    marginMoneyPercentage: 5,
    moratoriumPeriodMonths: 6,
    repaymentPeriodYears: 5,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Bank Statement',
      'Skill Verification Certificate'
    ],
    officialUrl: 'https://pmvishwakarma.gov.in/',
    sourceUrl: 'https://msme.gov.in/pm-vishwakarma-scheme',
    sourceName: 'PM Vishwakarma Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
    slug: 'pmfme-food-processing-micro-units',
    provider: 'Ministry of Food Processing Industries (MoFPI)',
    ministry: 'Ministry of Food Processing Industries',
    department: 'Micro Food Processing Division',
    sourceType: 'Central Government',
    description: 'Credit-linked capital subsidy of 35% up to ₹10 Lakh for individual micro food processing units (spice grinding, bakery, dairy, pickle, oil extraction, flour mill).',
    category: 'Subsidy',
    targetBeneficiaries: ['Entrepreneur', 'Woman', 'Rural Youth', 'Farmer Producer Org'],
    businessTypes: ['Proprietary', 'Partnership', 'SHG', 'FPO'],
    sectors: ['Food processing', 'Agriculture', 'Dairy'],
    states: ['All'],
    areaEligibility: 'Both',
    categories: ['SC', 'ST', 'OBC', 'EWS', 'General'],
    genderEligibility: 'All',
    minAge: 18,
    maxAge: 60,
    maxFamilyIncome: 0,
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 3000000,
    businessStages: ['New business', 'Existing business', 'Expansion'],
    isUdyamRequired: true,
    fundingType: 'Subsidy',
    minimumSupport: 100000,
    maximumSupport: 1000000, // ₹10 Lakh
    financingPercentage: 90,
    interestRate: 8.5,
    subsidyPercentage: 35,
    subsidyDetails: '35% capital subsidy of eligible project cost with maximum ceiling of ₹10 Lakh per unit.',
    marginMoneyPercentage: 10,
    moratoriumPeriodMonths: 12,
    repaymentPeriodYears: 7,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Income Certificate',
      'Business Registration',
      'FSSAI License',
      'Project Report',
      'Udyam Certificate'
    ],
    officialUrl: 'https://pmfme.mofpi.gov.in/',
    sourceUrl: 'https://mofpi.gov.in/pmfme',
    sourceName: 'MoFPI Official Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'Startup India Seed Fund Scheme (SISFS)',
    slug: 'startup-india-seed-fund-sisfs',
    provider: 'DPIIT / Ministry of Commerce and Industry',
    ministry: 'Ministry of Commerce and Industry',
    department: 'DPIIT',
    sourceType: 'Central Government',
    description: 'Financial assistance up to ₹50 Lakh to early-stage DPIIT-recognized startups for proof of concept, prototype development, product trials, and commercialization.',
    category: 'Grant',
    targetBeneficiaries: ['Entrepreneur', 'Technology', 'Innovation'],
    businessTypes: ['Private Limited Company', 'LLP'],
    sectors: ['Services', 'Manufacturing', 'Technology', 'Food processing', 'Healthcare'],
    states: ['All'],
    areaEligibility: 'Both',
    categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    genderEligibility: 'All',
    minAge: 18,
    maxAge: 55,
    maxFamilyIncome: 0,
    maxAnnualTurnover: 25000000,
    maxInvestmentLimit: 10000000,
    businessStages: ['Idea', 'New business'],
    isUdyamRequired: false,
    fundingType: 'Grant',
    minimumSupport: 500000,
    maximumSupport: 5000000, // ₹50 Lakh
    financingPercentage: 100,
    interestRate: 0.0,
    subsidyPercentage: 100,
    subsidyDetails: 'Grant up to ₹20 Lakh for validation of Proof of Concept/Prototype + Debt/Convertible Debentures up to ₹50 Lakh for market entry.',
    marginMoneyPercentage: 0,
    moratoriumPeriodMonths: 12,
    repaymentPeriodYears: 5,
    requiredDocuments: [
      'Aadhaar/Identity',
      'DPIIT Recognition Certificate',
      'Business Registration',
      'Project Pitch Deck'
    ],
    officialUrl: 'https://seedfund.startupindia.gov.in/',
    sourceUrl: 'https://www.startupindia.gov.in/',
    sourceName: 'Startup India Seed Fund Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'Deendayal Antyodaya Yojana - National Urban Livelihoods Mission (DAY-NULM)',
    slug: 'day-nulm-urban-micro-enterprise-loan',
    provider: 'Ministry of Housing and Urban Affairs (MoHUA)',
    ministry: 'Ministry of Housing and Urban Affairs',
    department: 'Urban Livelihoods Division',
    sourceType: 'Central Government',
    description: 'Subsidized bank credit up to ₹2 Lakh for individual micro-enterprises and ₹10 Lakh for group enterprises (7% interest subvention for urban poor & women).',
    category: 'Micro Finance',
    targetBeneficiaries: ['Urban Poor', 'Woman', 'SC/ST', 'Artisans', 'Street Vendor'],
    businessTypes: ['Proprietary', 'SHG Group'],
    sectors: ['Services', 'Retail', 'Handicrafts', 'Textiles'],
    states: ['All'],
    areaEligibility: 'Urban',
    categories: ['SC', 'ST', 'OBC', 'EWS', 'General'],
    genderEligibility: 'All',
    minAge: 18,
    maxAge: 55,
    maxFamilyIncome: 300000,
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 1000000,
    businessStages: ['New business', 'Existing business'],
    isUdyamRequired: false,
    fundingType: 'Loan',
    minimumSupport: 50000,
    maximumSupport: 1000000, // ₹10 Lakh group
    financingPercentage: 95,
    interestRate: 7.0, // 7% effective interest
    subsidyPercentage: 20,
    subsidyDetails: 'Interest subvention over and above 7% p.a. paid directly to bank accounts by MoHUA.',
    marginMoneyPercentage: 5,
    moratoriumPeriodMonths: 6,
    repaymentPeriodYears: 5,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Income Certificate',
      'Bank Statement',
      'Urban Residence Certificate'
    ],
    officialUrl: 'https://nulm.gov.in/',
    sourceUrl: 'https://mohua.gov.in/nulm',
    sourceName: 'NULM Official Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'Mukhyamantri Yuva Swarozgar Yojana (MYSY - Uttar Pradesh)',
    slug: 'mysy-up-youth-self-employment-subsidy',
    provider: 'Department of MSME & Export Promotion, Uttar Pradesh',
    ministry: 'Government of Uttar Pradesh',
    department: 'Directorate of Industries',
    sourceType: 'State Government',
    description: 'Bank loan up to ₹25 Lakh for manufacturing and ₹10 Lakh for service units with 25% margin money subsidy for educated youth in Uttar Pradesh.',
    category: 'Subsidy',
    targetBeneficiaries: ['Youth', 'Entrepreneur', 'SC/ST', 'Woman'],
    businessTypes: ['Proprietary', 'Partnership', 'Individual'],
    sectors: ['Manufacturing', 'Services', 'Food processing', 'Textiles'],
    states: ['Uttar Pradesh'],
    areaEligibility: 'Both',
    categories: ['SC', 'ST', 'OBC', 'EWS', 'General'],
    genderEligibility: 'All',
    minAge: 18,
    maxAge: 40,
    maxFamilyIncome: 0,
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 2500000,
    businessStages: ['New business', 'Expansion'],
    isUdyamRequired: true,
    fundingType: 'Subsidy',
    minimumSupport: 100000,
    maximumSupport: 2500000, // ₹25 Lakh
    financingPercentage: 90,
    interestRate: 8.5,
    subsidyPercentage: 25,
    subsidyDetails: '25% margin money subsidy (Max ₹6.25 Lakh for manufacturing, ₹2.5 Lakh for services) converted to grant after 2 years of successful operation.',
    marginMoneyPercentage: 10,
    moratoriumPeriodMonths: 12,
    repaymentPeriodYears: 7,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Domicile Certificate (UP)',
      'Educational Qualification (10th/12th)',
      'Project Report',
      'Udyam Certificate'
    ],
    officialUrl: 'https://diupmsme.upsdc.gov.in/',
    sourceUrl: 'https://diupmsme.upsdc.gov.in/scheme/mysy',
    sourceName: 'UP MSME Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'New Entrepreneur-cum-Enterprise Development Scheme (NEEDS - Tamil Nadu)',
    slug: 'needs-tamil-nadu-first-gen-entrepreneur',
    provider: 'Department of Industries and Commerce, Tamil Nadu',
    ministry: 'Government of Tamil Nadu',
    department: 'MSME Department TN',
    sourceType: 'State Government',
    description: '25% capital subsidy up to ₹75 Lakh and 3% interest subvention for first-generation educated youth entrepreneurs establishing manufacturing/service ventures in Tamil Nadu.',
    category: 'Subsidy',
    targetBeneficiaries: ['First Generation Entrepreneur', 'Youth', 'Woman', 'SC/ST'],
    businessTypes: ['Proprietary', 'Partnership'],
    sectors: ['Manufacturing', 'Services', 'Textiles', 'Food processing'],
    states: ['Tamil Nadu'],
    areaEligibility: 'Both',
    categories: ['SC', 'ST', 'OBC', 'EWS', 'General'],
    genderEligibility: 'All',
    minAge: 21,
    maxAge: 45,
    maxFamilyIncome: 0,
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 50000000,
    businessStages: ['New business', 'Greenfield enterprise'],
    isUdyamRequired: true,
    fundingType: 'Subsidy',
    minimumSupport: 1000000,
    maximumSupport: 7500000, // ₹75 Lakh
    financingPercentage: 90,
    interestRate: 8.0,
    subsidyPercentage: 25,
    subsidyDetails: '25% project cost subsidy (Max ₹75 Lakh) + 3% interest subvention throughout loan repayment period.',
    marginMoneyPercentage: 10,
    moratoriumPeriodMonths: 12,
    repaymentPeriodYears: 7,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Degree / Diploma Certificate',
      'Domicile Certificate (TN)',
      'Project Report',
      'Udyam Certificate'
    ],
    officialUrl: 'https://www.msmeonline.tn.gov.in/needs/',
    sourceUrl: 'https://www.msmeonline.tn.gov.in/',
    sourceName: 'Tamil Nadu MSME Online Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)',
    slug: 'cgtmse-collateral-free-credit-guarantee',
    provider: 'Ministry of MSME & SIDBI',
    ministry: 'Ministry of Micro, Small & Medium Enterprises',
    department: 'Credit Guarantee Division',
    sourceType: 'PSB / Bank Scheme',
    description: 'Collateral-free credit facility up to ₹2 Crore (₹200 Lakh) for micro and small enterprises with 85% credit guarantee cover for women and SC/ST entrepreneurs.',
    category: 'Term Loan',
    targetBeneficiaries: ['Entrepreneur', 'Woman', 'SC/ST', 'MSME'],
    businessTypes: ['Proprietary', 'Partnership', 'Company'],
    sectors: ['Manufacturing', 'Services', 'Food processing', 'Textiles', 'Retail'],
    states: ['All'],
    areaEligibility: 'Both',
    categories: ['SC', 'ST', 'OBC', 'EWS', 'General'],
    genderEligibility: 'All',
    minAge: 21,
    maxAge: 65,
    maxFamilyIncome: 0,
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 20000000,
    businessStages: ['Existing business', 'Expansion', 'New business'],
    isUdyamRequired: true,
    fundingType: 'Loan',
    minimumSupport: 500000,
    maximumSupport: 20000000, // ₹2 Crore
    financingPercentage: 100,
    interestRate: 8.5,
    subsidyPercentage: 0,
    subsidyDetails: '85% credit guarantee coverage for SC/ST/Women/ZED units; 75% for general category. Zero third-party collateral required.',
    marginMoneyPercentage: 10,
    moratoriumPeriodMonths: 12,
    repaymentPeriodYears: 7,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Business Registration',
      'Project Report',
      'Udyam Certificate'
    ],
    officialUrl: 'https://www.cgtmse.in/',
    sourceUrl: 'https://www.cgtmse.in/Aboutus/CGTMSE',
    sourceName: 'CGTMSE Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'Mukhyamantri Mahila Udyamita Yojana (Bihar)',
    slug: 'bihar-mukhyamantri-mahila-udyamita-yojana',
    provider: 'Department of Industries, Government of Bihar',
    ministry: 'Government of Bihar',
    department: 'Industries Department',
    sourceType: 'State Government',
    description: 'Financial assistance up to ₹10 Lakh (₹5 Lakh Interest-Free Loan + ₹5 Lakh 50% Subsidy/Grant) for women entrepreneurs in Bihar to start micro-units.',
    category: 'Subsidy',
    targetBeneficiaries: ['Woman', 'Entrepreneur', 'SC/ST', 'Rural Youth'],
    businessTypes: ['Proprietary', 'Individual'],
    sectors: ['Manufacturing', 'Services', 'Textiles', 'Food processing', 'Handicrafts'],
    states: ['Bihar'],
    areaEligibility: 'Both',
    categories: ['SC', 'ST', 'OBC', 'EWS', 'General'],
    genderEligibility: 'Female Only',
    minAge: 18,
    maxAge: 50,
    maxFamilyIncome: 0,
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 1000000,
    businessStages: ['New business', 'Greenfield enterprise'],
    isUdyamRequired: true,
    fundingType: 'Subsidy',
    minimumSupport: 200000,
    maximumSupport: 1000000, // ₹10 Lakh
    financingPercentage: 100,
    interestRate: 0.0, // 0% interest for women
    subsidyPercentage: 50, // 50% grant
    subsidyDetails: '₹5 Lakh direct grant/subsidy + ₹5 Lakh 0% interest-free loan repayable in 84 monthly installments.',
    marginMoneyPercentage: 0,
    moratoriumPeriodMonths: 12,
    repaymentPeriodYears: 7,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Domicile Certificate (Bihar)',
      '10th/12th Marksheet',
      'Project Report',
      'Udyam Certificate'
    ],
    officialUrl: 'https://udyami.bihar.gov.in/',
    sourceUrl: 'https://industries.bih.nic.in/',
    sourceName: 'Bihar Udyami Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  },
  {
    name: 'PM SVANidhi (Pradhan Mantri Street Vendor’s AtmaNirbhar Nidhi)',
    slug: 'pm-svanidhi-street-vendor-loan',
    provider: 'Ministry of Housing and Urban Affairs (MoHUA)',
    ministry: 'Ministry of Housing and Urban Affairs',
    department: 'Urban Livelihoods Division',
    sourceType: 'Central Government',
    description: 'Special micro-credit facility up to ₹50,000 for street vendors and micro-retailers with 7% interest subsidy and cashback incentives on digital transactions.',
    category: 'Micro Finance',
    targetBeneficiaries: ['Street Vendor', 'Small Vendor', 'Woman', 'Urban Poor'],
    businessTypes: ['Individual', 'Self Employed'],
    sectors: ['Retail', 'Services', 'Food processing'],
    states: ['All'],
    areaEligibility: 'Urban',
    categories: ['SC', 'ST', 'OBC', 'EWS', 'General'],
    genderEligibility: 'All',
    minAge: 18,
    maxAge: 65,
    maxFamilyIncome: 0,
    maxAnnualTurnover: 0,
    maxInvestmentLimit: 50000,
    businessStages: ['Existing business', 'New business'],
    isUdyamRequired: false,
    fundingType: 'Loan',
    minimumSupport: 10000,
    maximumSupport: 50000, // Up to ₹50,000 (Tranche 3)
    financingPercentage: 100,
    interestRate: 7.0,
    subsidyPercentage: 7,
    subsidyDetails: '7% p.a. interest subsidy credited directly to bank account on timely repayment + up to ₹1,200 annual digital transaction cashback.',
    marginMoneyPercentage: 0,
    moratoriumPeriodMonths: 3,
    repaymentPeriodYears: 3,
    requiredDocuments: [
      'Aadhaar/Identity',
      'Vending Certificate / Urban Livelihood ID',
      'Bank Account Details'
    ],
    officialUrl: 'https://pmsvanidhi.mohua.gov.in/',
    sourceUrl: 'https://pmsvanidhi.mohua.gov.in/Home/Schemes',
    sourceName: 'PM SVANidhi Official Portal',
    verificationStatus: 'VERIFIED',
    isDemoData: false
  }
];

const mockScholarships = [
  {
    title: 'Post-Matric Scholarship for Scheduled Caste Students (PMS-SC)',
    slug: 'post-matric-scholarship-sc-students',
    provider: 'Ministry of Social Justice and Empowerment (MoSJE)',
    providerType: 'Government',
    description: 'Financial assistance for SC students pursuing post-matriculation or post-secondary courses in recognized institutions.',
    educationLevels: ['Undergraduate', 'Postgraduate', 'Higher Secondary', 'Doctorate'],
    courses: ['B.Tech', 'B.Sc', 'B.Com', 'BA', 'MBBS', 'Diploma', 'M.Tech', 'MBA'],
    states: ['All'],
    categories: ['SC'],
    genderEligibility: 'All',
    minMarksPercentage: 50,
    maxFamilyIncome: 250000, // ₹2.5 Lakh per annum
    amountPerYear: 35000,
    benefitDetails: 'Full maintenance allowance, non-refundable compulsory fees reimbursement, and book allowance.',
    requiredDocuments: [
      'Income Certificate',
      'Category Certificate',
      'Aadhaar/Identity',
      'Bank Statement'
    ],
    officialUrl: 'https://scholarships.gov.in/',
    verificationStatus: 'VERIFIED'
  },
  {
    title: 'National Overseas Scholarship for SC/ST Candidates',
    slug: 'national-overseas-scholarship-mosje',
    provider: 'Ministry of Social Justice and Empowerment (MoSJE)',
    providerType: 'Government',
    description: 'Financial assistance to low-income SC, De-notified Nomadic & Semi-Nomadic Tribes, Landless Agricultural Labourers and Traditional Artisans students for higher studies abroad.',
    educationLevels: ['Postgraduate', 'Doctorate'],
    courses: ['Engineering', 'Management', 'Medicine', 'Pure Sciences', 'Humanities'],
    states: ['All'],
    categories: ['SC', 'ST'],
    genderEligibility: 'All',
    minMarksPercentage: 60,
    maxFamilyIncome: 800000, // ₹8 Lakh per annum
    amountPerYear: 1500000, // High support for international tuition + living
    benefitDetails: 'Tuition fees, annual maintenance allowance ($15,400 USD), contingency grant, and air passage cost.',
    requiredDocuments: [
      'Income Certificate',
      'Category Certificate',
      'Aadhaar/Identity',
      'Bank Statement'
    ],
    officialUrl: 'https://nosmsje.gov.in/',
    verificationStatus: 'VERIFIED'
  }
];

const mockPartners = [
  {
    name: 'State Bank of India (SBI) — Main Branch',
    partnerType: 'Public Sector Bank',
    branchName: 'Patna Main Branch',
    address: 'Near Gandhi Maidan, Exhibition Road, Patna, Bihar - 800001',
    state: 'Bihar',
    district: 'Patna',
    city: 'Patna',
    pincode: '800001',
    location: { lat: 25.6115, lng: 85.144 },
    supportedSchemeSlugs: [
      'pmegp-micro-units-grant-loan',
      'mudra-loan-micro-enterprise',
      'stand-up-india-sc-st-women',
      'pm-vishwakarma-artisans-toolkit-loan',
      'pmfme-food-processing-micro-units',
      'startup-india-seed-fund-sisfs',
      'cgtmse-collateral-free-credit-guarantee',
      'bihar-mukhyamantri-mahila-udyamita-yojana',
      'pm-svanidhi-street-vendor-loan'
    ],
    supportedLoanTypes: ['Term Loan', 'Micro Finance', 'Subsidy'],
    contactPhone: '0612-2201928',
    contactEmail: 'sbi.patna.main@sbi.co.in',
    routingStatus: 'RECOMMENDED',
    verificationStatus: 'VERIFIED'
  },
  {
    name: 'Bihar State Financial Corporation (BSFC) / SCA Office',
    partnerType: 'State Channelizing Agency',
    branchName: 'Headquarters Patna',
    address: 'Fraser Road, Patna, Bihar - 800001',
    state: 'Bihar',
    district: 'Patna',
    city: 'Patna',
    pincode: '800001',
    location: { lat: 25.608, lng: 85.138 },
    supportedSchemeSlugs: [
      'vcf-sc-mosje-entrepreneur-fund',
      'sclcss-capital-subsidy-machinery',
      'bihar-mukhyamantri-mahila-udyamita-yojana',
      'pm-vishwakarma-artisans-toolkit-loan'
    ],
    supportedLoanTypes: ['Equity Support', 'Capital Subsidy', 'Grant'],
    contactPhone: '0612-2223849',
    contactEmail: 'contact@bsfc.bihar.gov.in',
    routingStatus: 'RECOMMENDED',
    verificationStatus: 'VERIFIED'
  },
  {
    name: 'Punjab National Bank (PNB) — Micro Care Branch',
    partnerType: 'Public Sector Bank',
    branchName: 'Ludhiana Central Branch',
    address: 'Clock Tower, Ludhiana, Punjab - 141008',
    state: 'Punjab',
    district: 'Ludhiana',
    city: 'Ludhiana',
    pincode: '141008',
    location: { lat: 30.901, lng: 75.8573 },
    supportedSchemeSlugs: [
      'pmegp-micro-units-grant-loan',
      'mudra-loan-micro-enterprise',
      'sclcss-capital-subsidy-machinery',
      'pm-vishwakarma-artisans-toolkit-loan',
      'pmfme-food-processing-micro-units',
      'cgtmse-collateral-free-credit-guarantee',
      'pm-svanidhi-street-vendor-loan'
    ],

    supportedLoanTypes: ['Micro Finance', 'Equipment Finance'],
    contactPhone: '0161-2401829',
    contactEmail: 'bo0218@pnb.co.in',
    routingStatus: 'RECOMMENDED',
    verificationStatus: 'VERIFIED'
  }
];

const mockOrganization = {
  name: 'Future India Social Impact Foundation (Demo CSR)',
  legalName: 'Future India Social Impact Foundation Private Limited',
  organizationType: 'CSR_IMPLEMENTING_AGENCY',
  website: 'https://futureindiafoundation.demo.org',
  contact: {
    officialEmail: 'csr@futureindiafoundation.demo.org',
    phone: '+91 98765 43210',
    website: 'https://futureindiafoundation.demo.org'
  },
  email: 'csr@futureindiafoundation.demo.org',
  phone: '+91 98765 43210',
  address: {
    addressLine: 'Sector 62, Institutional Area, Noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    postalCode: '201301'
  },
  registrationDetails: {
    cin: 'U74999UP2020NPL123456',
    pan: 'AAATF1234F',
    csrRegistrationNumber: 'CSR00098765'
  },
  verification: {
    status: 'VERIFIED_LEGAL_ENTITY',
    verificationLevel: 'Verified Legal Entity'
  },
  verificationStatus: 'VERIFIED_LEGAL_ENTITY',
  verifiedBadge: true
};

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/yojnasetu';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log('Seeding data to MongoDB...');

    // Clear existing
    await User.deleteMany({});
    await EntrepreneurProfile.deleteMany({});
    await Scheme.collection.dropIndexes().catch(() => {});
    await Scheme.deleteMany({});
    await Scholarship.deleteMany({});
    await ChannelPartner.deleteMany({});
    await Organization.deleteMany({});
    await SchemeSource.deleteMany({});
    await Sponsorship.deleteMany({});

    // Seed Organization
    const createdOrg = await Organization.create(mockOrganization);

    // Seed Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password@123', salt);

    const adminUser = await User.create({
      name: 'YojnaSetu Admin Officer',
      email: 'admin@yojnasetu.in',
      password: hashedPassword,
      role: 'ADMIN',
      state: 'Delhi'
    });

    const demoBeneficiary = await User.create({
      name: 'Sunita Devi (Demo Beneficiary)',
      email: 'sunita.entrepreneur@demo.in',
      password: hashedPassword,
      role: 'BENEFICIARY',
      state: 'Bihar',
      district: 'Patna'
    });

    const providerUser = await User.create({
      name: 'Rajeswari Rao (CSR Manager)',
      email: 'provider@futureindia.demo.org',
      password: hashedPassword,
      role: 'PROVIDER',
      organizationId: createdOrg._id,
      state: 'Uttar Pradesh'
    });

    // Seed Entrepreneur Profile for Demo Beneficiary
    await EntrepreneurProfile.create({
      userId: demoBeneficiary._id,
      fullName: 'Sunita Devi',
      age: 28,
      gender: 'Female',
      state: 'Bihar',
      district: 'Patna',
      city: 'Patna',
      pincode: '800001',
      areaType: 'Rural',
      businessName: 'Sunita Food Products & Dairy',
      businessType: 'Proprietary',
      sector: 'Food processing',
      stage: 'Existing business',
      yearsInOperation: 2,
      annualTurnover: 400000, // ₹4 Lakh
      employeesCount: 3,
      investmentAmount: 150000,
      udyamStatus: 'Registered',
      familyIncome: 250000, // ₹2.5 Lakh
      existingLoans: false,
      existingEMI: 0,
      ownContribution: 50000,
      hasIncomeCertificate: true,
      category: 'SC',
      isWomanEntrepreneur: true,
      isMinority: false,
      isPwD: false,
      isFirstGeneration: true,
      isRuralEntrepreneur: true,
      fundingType: ['Loan', 'Subsidy', 'Equipment'],
      fundingAmount: 500000, // ₹5 Lakh
      fundingPurpose: 'Machinery procurement and dairy processing expansion',
      documentsAvailable: ['Income Certificate', 'Category Certificate', 'Business Registration', 'Aadhaar/Identity', 'Udyam Certificate']
    });

    // Seed Schemes
    const createdSchemes = await Scheme.insertMany(mockSchemes);

    // Seed Scholarships
    await Scholarship.insertMany(mockScholarships);

    // Seed Channel Partners linked to Schemes
    const schemeMap = {};
    createdSchemes.forEach(s => { schemeMap[s.slug] = s._id; });

    const partnersToInsert = mockPartners.map(p => {
      const ids = (p.supportedSchemeSlugs || []).map(slug => schemeMap[slug]).filter(Boolean);
      return {
        ...p,
        supportedSchemeIds: ids
      };
    });

    await ChannelPartner.insertMany(partnersToInsert);

    // Seed Scheme Sources
    await SchemeSource.insertMany([
      {
        name: 'Ministry of MSME Official Scheme Portal',
        url: 'https://msme.gov.in/schemes',
        authority: 'MoMSME',
        sourceType: 'Official Website',
        priority: 1,
        status: 'ACTIVE',
        contentHash: 'hash_msme_v1_2026'
      },
      {
        name: 'Ministry of Social Justice & Empowerment (MoSJE)',
        url: 'https://socialjustice.gov.in/',
        authority: 'MoSJE',
        sourceType: 'Official Notification',
        priority: 1,
        status: 'ACTIVE',
        contentHash: 'hash_mosje_v1_2026'
      }
    ]);

    // Seed Sponsorship Campaign
    await Sponsorship.create({
      title: 'Solar Powered Grain Mill for Rural Women Group',
      beneficiaryId: demoBeneficiary._id,
      beneficiaryCode: 'YS-BEN-1024',
      businessCategory: 'Food processing / Rural Tech',
      story: 'Sunita Devi wants to upgrade her village flour mill with a zero-emission solar processing unit to serve 400 local farmers.',
      targetAmount: 50000,
      raisedAmount: 32000,
      state: 'Bihar',
      status: 'ACTIVE',
      contributions: [
        { sponsorName: 'Anand Kumar', amount: 20000, isAnonymous: false, transactionId: 'TXN99281' },
      ]
    });

    // Seed Organizations with Verification Statuses
    await Organization.deleteMany({});
    const orgs = await Organization.insertMany([
      {
        name: 'Tata Sustainable Development Society',
        legalName: 'Tata Sustainable Development Society Private Limited',
        organizationType: 'PRIVATE_COMPANY',
        registrationDetails: { cin: 'U74999MH2018PTC305899', pan: 'AAACG1234F', gstin: '27AAACG1234F1Z5', csrRegistrationNumber: 'CSR00018492' },
        address: { addressLine: 'Tata Centre, 43 Jawaharlal Nehru Road', city: 'Kolkata', state: 'West Bengal', postalCode: '700071' },
        contact: { officialEmail: 'csr@tatasustainable.org', phone: '033-66123456', website: 'https://tatasustainable.org' },
        authorizedRepresentative: { name: 'Rohan Deshmukh', designation: 'Head of CSR & Social Impact', email: 'rohan.d@tatasustainable.org', phone: '+919876543210' },
        documents: [
          { documentType: 'INCORPORATION_CERTIFICATE', documentUrl: 'https://yojnasetu.in/docs/coi_tata.pdf', documentName: 'COI_Tata_Sustainable.pdf', verificationStatus: 'Verified' },
          { documentType: 'PAN_DOCUMENT', documentUrl: 'https://yojnasetu.in/docs/pan_tata.pdf', documentName: 'PAN_Tata.pdf', verificationStatus: 'Verified' },
          { documentType: 'CSR_REGISTRATION_PROOF', documentUrl: 'https://yojnasetu.in/docs/csr1_tata.pdf', documentName: 'CSR1_Registration.pdf', verificationStatus: 'Verified' }
        ],
        governmentRelationship: { claimed: false },
        verification: { status: 'VERIFIED_LEGAL_ENTITY', verificationLevel: 'Verified Legal Entity', reviewedBy: 'Lead Verification Admin', reviewedAt: new Date() }
      },
      {
        name: 'Gramin Vikas Kalyan Trust',
        legalName: 'Gramin Vikas Kalyan Charitable Trust',
        organizationType: 'NGO',
        registrationDetails: { ngoDarpanId: 'BR/2023/0348921', pan: 'AAATG5678K' },
        address: { addressLine: 'Gandhi Maidan Main Road', city: 'Patna', state: 'Bihar', postalCode: '800001' },
        contact: { officialEmail: 'contact@graminvikas.org', phone: '0612-2501234', website: 'https://graminvikas.org' },
        authorizedRepresentative: { name: 'Suresh Chandra', designation: 'Managing Trustee', email: 'suresh@graminvikas.org', phone: '+919835012345' },
        documents: [
          { documentType: 'REGISTRATION_CERTIFICATE', documentUrl: 'https://yojnasetu.in/docs/trust_deed.pdf', documentName: 'TrustDeed.pdf', verificationStatus: 'Under Review' },
          { documentType: 'NGO_DARPAN_PROOF', documentUrl: 'https://yojnasetu.in/docs/darpan_cert.pdf', documentName: 'Darpan_BR.pdf', verificationStatus: 'Under Review' }
        ],
        governmentRelationship: { claimed: true, relationshipType: 'GOVERNMENT_SCHEME_IMPLEMENTER', departmentName: 'Ministry of Rural Development', referenceNumber: 'MORD-BR-9921', relationshipDescription: 'Empanelled for Bihar watershed micro grant distribution.' },
        verification: { status: 'UNDER_REVIEW', verificationLevel: 'Under Review', submittedAt: new Date() }
      },
      {
        name: 'National Small Industries Corporation (NSIC)',
        legalName: 'National Small Industries Corporation Limited',
        organizationType: 'GOVERNMENT_BODY',
        registrationDetails: { cin: 'U74140DL1955GOI002481', pan: 'AAACN1234L' },
        address: { addressLine: 'NSIC Bhavan, Okhla Industrial Estate', city: 'New Delhi', state: 'Delhi', postalCode: '110020' },
        contact: { officialEmail: 'info@nsic.co.in', phone: '011-26926161', website: 'https://nsic.co.in' },
        authorizedRepresentative: { name: 'Dr. V. K. Sharma', designation: 'General Manager (Schemes)', email: 'vk.sharma@nsic.co.in', phone: '+919810012345' },
        documents: [
          { documentType: 'GOVERNMENT_NOTIFICATION', documentUrl: 'https://yojnasetu.in/docs/nsic_gazette.pdf', documentName: 'NSIC_Gazette_Act.pdf', verificationStatus: 'Verified' }
        ],
        governmentRelationship: { claimed: true, relationshipType: 'OFFICIAL_GOVERNMENT_BODY', departmentName: 'Ministry of MSME', relationshipDescription: 'Official Government PSU under Ministry of MSME.' },
        verification: { status: 'GOVERNMENT_REGISTERED_OR_RECOGNIZED', verificationLevel: 'Government Body / PSU', reviewedBy: 'Super Admin', reviewedAt: new Date() }
      }
    ]);

    // Seed Opportunities
    await Opportunity.deleteMany({});
    await Opportunity.insertMany([
      {
        title: 'Tata Future India Women Entrepreneurship CSR Grant 2026',
        slug: 'tata-future-india-women-csr-grant-2026',
        description: 'Direct financial support and machinery equipment grant for female SC/ST micro-entrepreneurs in Bihar & Jharkhand.',
        providerOrganizationId: orgs[0]._id,
        providerName: orgs[0].name,
        opportunityType: 'CSR_GRANT',
        category: 'Grant',
        fundingAmount: 2500000,
        maxGrantAmount: 500000,
        eligibilityCriteriaSummary: 'Female entrepreneurs operating in Bihar or Jharkhand with annual income < ₹3 Lakh.',
        targetStates: ['Bihar', 'Jharkhand'],
        targetSectors: ['Food processing', 'Handicrafts', 'Textiles'],
        officialApplicationUrl: 'https://tatasustainable.org/apply-csr-2026',
        sourceInformation: { officialSourceName: 'Tata Corporate CSR Portal', sourceUrl: 'https://tatasustainable.org/apply-csr-2026' },
        governmentClaim: { isGovernmentScheme: false },
        verification: { status: 'VERIFIED_PRIVATE_OR_CSR_OPPORTUNITY', reviewedBy: 'Compliance Admin', reviewedAt: new Date() }
      },
      {
        title: 'Gramin Skill Development Fellowship 2026',
        slug: 'gramin-skill-development-fellowship-2026',
        description: 'Stipend and seed grant for rural youth establishing agro-processing micro units in Bihar.',
        providerOrganizationId: orgs[1]._id,
        providerName: orgs[1].name,
        opportunityType: 'INCUBATION_FUNDING',
        category: 'Grant',
        fundingAmount: 1500000,
        maxGrantAmount: 200000,
        targetStates: ['Bihar'],
        targetSectors: ['Agriculture', 'Food processing'],
        officialApplicationUrl: 'https://graminvikas.org/skill-fellowship',
        sourceInformation: { officialSourceName: 'Gramin Vikas Kalyan Trust Portal', sourceUrl: 'https://graminvikas.org/skill-fellowship' },
        governmentClaim: { isGovernmentScheme: true, governmentDepartment: 'Ministry of Rural Development' },
        verification: { status: 'SOURCE_REQUIRES_REVIEW', adminNotes: 'Awaiting MORD official sanction letter verification.' }
      }
    ]);

    // Seed Audit Logs
    await VerificationAuditLog.deleteMany({});
    await VerificationAuditLog.create({
      entityType: 'ORGANIZATION',
      entityId: orgs[0]._id,
      entityName: orgs[0].legalName,
      action: 'APPROVED',
      previousStatus: 'DOCUMENTS_SUBMITTED',
      newStatus: 'VERIFIED_LEGAL_ENTITY',
      performedBy: 'Lead Verification Admin',
      performedByEmail: 'admin@yojnasetu.in',
      notes: 'COI, PAN, and Form CSR-1 verified against MCA portal.'
    });

    console.log('Seeding completed successfully with Organization & Opportunity Verification data!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = { mockSchemes, mockScholarships, mockPartners, mockOrganization };
