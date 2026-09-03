/**
 * Mock Government / PFMS Integration Adapter
 * 
 * ARCHITECTURE NOTE FOR PRODUCTION DEPLOYMENT:
 * This layer abstracts external Government & PFMS (Public Financial Management System) API integrations.
 * Currently returns mock government responses for SIH demonstration.
 * In a live production environment, this service adapter is replaced with authorized government OAuth/REST/SOAP endpoints.
 */

const DEMO_GOVERNMENT_DATABASE = {
  'APP-DEMO-001': {
    applicationId: 'APP-DEMO-001',
    applicationStatus: 'APPROVED',
    sanction: {
      status: 'NOT_SANCTIONED',
      amount: 0,
      referenceId: null,
      date: null
    },
    release: {
      status: 'NOT_RELEASED',
      amount: 0,
      date: null
    },
    payment: {
      status: 'PENDING',
      transactionReference: null,
      date: null
    },
    remarks: 'Application approved by State Nodal Committee. Awaiting PFMS fund sanction allocation.'
  },

  'APP-DEMO-002': {
    applicationId: 'APP-DEMO-002',
    applicationStatus: 'SANCTIONED',
    sanction: {
      status: 'SANCTIONED',
      amount: 50000,
      referenceId: 'SAN-98765',
      date: new Date('2026-08-20')
    },
    release: {
      status: 'NOT_RELEASED',
      amount: 0,
      date: null
    },
    payment: {
      status: 'PENDING',
      transactionReference: null,
      date: null
    },
    remarks: 'Fund of ₹50,000 sanctioned by Ministry Nodal Treasury. Release order pending bank account validation.'
  },

  'APP-DEMO-003': {
    applicationId: 'APP-DEMO-003',
    applicationStatus: 'PAYMENT_SUCCESS',
    sanction: {
      status: 'SANCTIONED',
      amount: 75000,
      referenceId: 'SAN-48291',
      date: new Date('2026-08-15')
    },
    release: {
      status: 'RELEASED',
      amount: 75000,
      date: new Date('2026-08-22')
    },
    payment: {
      status: 'SUCCESS',
      transactionReference: 'TXN****7821',
      date: new Date('2026-08-26')
    },
    remarks: 'Direct Benefit Transfer (DBT) credit of ₹75,000 successfully settled via Reserve Bank of India Nodal Payment Gateway.'
  }
};

/**
 * Perform Government / PFMS Synchronization
 */
const syncWithGovernmentPFMS = async (application) => {
  const appNo = application.applicationNumber;

  // 1. Return pre-configured mock record if available
  if (DEMO_GOVERNMENT_DATABASE[appNo]) {
    const mockRes = DEMO_GOVERNMENT_DATABASE[appNo];
    return {
      success: true,
      source: 'MOCK_GOVERNMENT',
      data: mockRes,
      lastSyncedAt: new Date()
    };
  }

  // 2. Dynamic state progression simulation for custom applications
  let nextStatus = application.applicationStatus || 'SUBMITTED';
  let sanctionObj = application.financialStatus?.sanction || { status: 'NOT_SANCTIONED', amount: 0 };
  let releaseObj = application.financialStatus?.release || { status: 'NOT_RELEASED', amount: 0 };
  let paymentObj = application.financialStatus?.payment || { status: 'PENDING' };

  const requestedAmt = application.requestedAmount || 50000;

  if (nextStatus === 'SUBMITTED') {
    nextStatus = 'DOCUMENT_VERIFICATION';
  } else if (nextStatus === 'DOCUMENT_VERIFICATION') {
    nextStatus = 'ELIGIBILITY_VERIFICATION';
  } else if (nextStatus === 'ELIGIBILITY_VERIFICATION') {
    nextStatus = 'APPROVED';
  } else if (nextStatus === 'APPROVED') {
    nextStatus = 'SANCTIONED';
    sanctionObj = {
      status: 'SANCTIONED',
      amount: requestedAmt,
      referenceId: `SAN-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date()
    };
  } else if (nextStatus === 'SANCTIONED') {
    nextStatus = 'RELEASED';
    releaseObj = {
      status: 'RELEASED',
      amount: sanctionObj.amount || requestedAmt,
      date: new Date()
    };
  } else if (nextStatus === 'RELEASED') {
    nextStatus = 'PAYMENT_SUCCESS';
    paymentObj = {
      status: 'SUCCESS',
      transactionReference: `TXN****${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date()
    };
  } else if (nextStatus === 'PAYMENT_SUCCESS') {
    nextStatus = 'COMPLETED';
  }

  return {
    success: true,
    source: 'MOCK_GOVERNMENT',
    data: {
      applicationId: appNo,
      applicationStatus: nextStatus,
      sanction: sanctionObj,
      release: releaseObj,
      payment: paymentObj,
      remarks: `Synchronized with Mock Government/PFMS Registry. Status updated to ${nextStatus}.`
    },
    lastSyncedAt: new Date()
  };
};

module.exports = {
  syncWithGovernmentPFMS,
  DEMO_GOVERNMENT_DATABASE
};
