const GovernmentProvider = require('./GovernmentProvider');

/**
 * MockGovernmentProvider
 * 
 * Simulates real PFMS / Central Nodal Treasury API behaviors.
 * Clearly demarcated as demo / prototype data.
 */

const DEMO_GOVERNMENT_DATABASE = {
  // Scenario 1: Application Approved, Fund Not Yet Sanctioned
  'APP-DEMO-001': {
    applicationId: 'APP-DEMO-001',
    applicationStatus: 'APPROVED',
    currentStage: 'Application Approved',
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

  // Scenario 2: Application Approved, ₹50,000 Sanctioned, Fund Release Pending
  'APP-DEMO-002': {
    applicationId: 'APP-DEMO-002',
    applicationStatus: 'SANCTIONED',
    currentStage: 'Fund Sanctioned',
    sanction: {
      status: 'SANCTIONED',
      amount: 50000,
      referenceId: 'SAN-98765',
      date: new Date('2026-08-20')
    },
    release: {
      status: 'RELEASE_PENDING',
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

  // Scenario 3: ₹75,000 Sanctioned, ₹75,000 Released, Payment Successful
  'APP-DEMO-003': {
    applicationId: 'APP-DEMO-003',
    applicationStatus: 'PAYMENT_SUCCESS',
    currentStage: 'Payment/Credit Successful',
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
      status: 'PAYMENT_SUCCESS',
      transactionReference: 'TXN****7821',
      date: new Date('2026-08-26')
    },
    remarks: 'Direct Benefit Transfer (DBT) credit of ₹75,000 successfully settled via Reserve Bank of India Nodal Payment Gateway.'
  }
};

class MockGovernmentProvider extends GovernmentProvider {
  constructor() {
    super();
    this.name = 'MockGovernmentPFMSProvider';
    this.isMock = true;
  }

  async getApplicationStatus(applicationNumber) {
    const record = DEMO_GOVERNMENT_DATABASE[applicationNumber];
    if (record) {
      return {
        applicationStatus: record.applicationStatus,
        stage: record.currentStage,
        remarks: record.remarks,
        lastVerifiedDate: new Date()
      };
    }
    return {
      applicationStatus: 'SUBMITTED',
      stage: 'Application Submitted',
      remarks: 'Application under review in sandbox registry.',
      lastVerifiedDate: new Date()
    };
  }

  async getSanctionStatus(applicationNumber) {
    const record = DEMO_GOVERNMENT_DATABASE[applicationNumber];
    if (record && record.sanction) {
      return record.sanction;
    }
    return { status: 'NOT_SANCTIONED', amount: 0, referenceId: null, date: null };
  }

  async getPaymentStatus(applicationNumber) {
    const record = DEMO_GOVERNMENT_DATABASE[applicationNumber];
    if (record && record.payment) {
      return record.payment;
    }
    return { status: 'PENDING', transactionReference: null, date: null, amount: 0 };
  }

  async syncApplication(application) {
    const appNo = application.applicationNumber;

    // 1. Return pre-configured mock record if available
    if (DEMO_GOVERNMENT_DATABASE[appNo]) {
      const mockRes = DEMO_GOVERNMENT_DATABASE[appNo];
      return {
        success: true,
        source: 'MOCK_GOVERNMENT',
        providerType: 'DEMO_PFMS_SANDBOX',
        data: mockRes,
        lastSyncedAt: new Date()
      };
    }

    // 2. Realistic dynamic lifecycle progression simulation for custom applications
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
        status: 'PAYMENT_SUCCESS',
        transactionReference: `TXN****${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date()
      };
    } else if (nextStatus === 'PAYMENT_SUCCESS') {
      nextStatus = 'COMPLETED';
    }

    return {
      success: true,
      source: 'MOCK_GOVERNMENT',
      providerType: 'DEMO_PFMS_SANDBOX',
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
  }
}

module.exports = {
  MockGovernmentProvider,
  DEMO_GOVERNMENT_DATABASE
};
