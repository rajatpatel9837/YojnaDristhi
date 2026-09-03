/**
 * GovernmentProvider - Abstract Interface for Government & PFMS Integration
 * 
 * ARCHITECTURE DESIGN:
 * This interface defines the contract for synchronizing application milestones,
 * fund sanctions, and treasury disbursement statuses with official portals (PFMS / State Nodal Portals).
 * 
 * In development / demo mode, MockGovernmentProvider implements this interface.
 * When real authorized Government / PFMS APIs or webhooks are provisioned,
 * an AuthorizedGovernmentProvider class can implement this exact interface without modifying
 * controllers, business logic, or database schemas.
 */

class GovernmentProvider {
  /**
   * Fetch current application verification status from Government Nodal Registry
   * @param {string} applicationNumber 
   * @returns {Promise<{ applicationStatus: string, stage: string, remarks: string, lastVerifiedDate: Date }>}
   */
  async getApplicationStatus(applicationNumber) {
    throw new Error('Method getApplicationStatus() must be implemented by provider.');
  }

  /**
   * Fetch sanction status and sanction order details from Ministry / Nodal Bank
   * @param {string} applicationNumber 
   * @returns {Promise<{ status: string, amount: number, referenceId: string, date: Date }>}
   */
  async getSanctionStatus(applicationNumber) {
    throw new Error('Method getSanctionStatus() must be implemented by provider.');
  }

  /**
   * Fetch DBT payment credit and transaction settlement status from PFMS / RBI Gateway
   * @param {string} applicationNumber 
   * @returns {Promise<{ status: string, transactionReference: string, date: Date, amount: number }>}
   */
  async getPaymentStatus(applicationNumber) {
    throw new Error('Method getPaymentStatus() must be implemented by provider.');
  }

  /**
   * Sync complete application lifecycle state
   * @param {Object} application 
   * @returns {Promise<{ success: boolean, source: string, data: Object, lastSyncedAt: Date }>}
   */
  async syncApplication(application) {
    throw new Error('Method syncApplication() must be implemented by provider.');
  }
}

module.exports = GovernmentProvider;
