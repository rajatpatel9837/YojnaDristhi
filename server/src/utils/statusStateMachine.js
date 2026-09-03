/**
 * Authoritative Backend State Machine for Scheme Application Lifecycle
 * Enforces valid transition paths and prevents arbitrary frontend jumps.
 */

const ALLOWED_TRANSITIONS = {
  SUBMITTED: ['DOCUMENT_VERIFICATION', 'REJECTED'],
  DOCUMENT_VERIFICATION: ['ELIGIBILITY_VERIFICATION', 'REJECTED'],
  ELIGIBILITY_VERIFICATION: ['APPROVED', 'REJECTED'],
  APPROVED: ['SANCTIONED'],
  SANCTIONED: ['RELEASED'],
  RELEASED: ['PAYMENT_SUCCESS', 'PAYMENT_FAILED'],
  PAYMENT_FAILED: ['PAYMENT_SUCCESS', 'REJECTED'],
  PAYMENT_SUCCESS: ['COMPLETED'],
  COMPLETED: [],
  REJECTED: []
};

const STAGE_METADATA = {
  SUBMITTED: { stageName: 'Application Submitted', progressPercentage: 15 },
  DOCUMENT_VERIFICATION: { stageName: 'Documents Verification', progressPercentage: 30 },
  ELIGIBILITY_VERIFICATION: { stageName: 'Eligibility Verification', progressPercentage: 45 },
  APPROVED: { stageName: 'Application Approved', progressPercentage: 60 },
  SANCTIONED: { stageName: 'Fund Sanctioned', progressPercentage: 75 },
  RELEASED: { stageName: 'Fund Released', progressPercentage: 85 },
  PAYMENT_SUCCESS: { stageName: 'Payment/Credit Successful', progressPercentage: 95 },
  COMPLETED: { stageName: 'Application Journey Completed', progressPercentage: 100 },
  REJECTED: { stageName: 'Application Rejected', progressPercentage: 100 },
  PAYMENT_FAILED: { stageName: 'Payment Processing Failed', progressPercentage: 85 }
};

const validateStatusTransition = (currentStatus, targetStatus) => {
  if (currentStatus === targetStatus) return true; // idempotency
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    throw new Error(`Invalid status transition from '${currentStatus}' to '${targetStatus}'. Allowed next states: [${allowed.join(', ')}]`);
  }
  return true;
};

const getStageMeta = (status) => {
  return STAGE_METADATA[status] || { stageName: status, progressPercentage: 50 };
};

module.exports = {
  ALLOWED_TRANSITIONS,
  STAGE_METADATA,
  validateStatusTransition,
  getStageMeta
};
