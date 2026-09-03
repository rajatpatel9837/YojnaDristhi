const { getStageMeta } = require('../../utils/statusStateMachine');
const AuditLog = require('../../models/AuditLog');

class StatusProcessor {
  /**
   * Process Government / PFMS sync response and apply to application entity
   */
  static async processSyncResult(application, syncResult) {
    if (!syncResult || !syncResult.success || !syncResult.data) {
      throw new Error('Invalid or failed synchronization payload.');
    }

    const govData = syncResult.data;
    const oldStatus = application.applicationStatus;
    const nextStatus = govData.applicationStatus || oldStatus;
    const meta = getStageMeta(nextStatus);

    // 1. Update Application Core Status & Stage
    application.applicationStatus = nextStatus;
    application.currentStage = meta.stageName;
    application.progressPercentage = meta.progressPercentage;

    // 2. Update Financial Status (Sanction != Release != Payment)
    if (!application.financialStatus) {
      application.financialStatus = {};
    }

    application.financialStatus = {
      sanction: govData.sanction || application.financialStatus.sanction || { status: 'NOT_SANCTIONED', amount: 0 },
      release: govData.release || application.financialStatus.release || { status: 'NOT_RELEASED', amount: 0 },
      payment: govData.payment || application.financialStatus.payment || { status: 'PENDING' },
      source: syncResult.source || 'MOCK_GOVERNMENT',
      providerType: syncResult.providerType || 'DEMO_PFMS_SANDBOX',
      lastSyncedAt: new Date()
    };

    // 3. Append to Timeline Audit Trail
    if (!application.timeline) {
      application.timeline = [];
    }

    application.timeline.push({
      stage: meta.stageName,
      status: nextStatus === 'REJECTED' ? 'REJECTED' : 'COMPLETED',
      date: new Date(),
      remarks: govData.remarks || `Synced with Government / PFMS Nodal Registry.`,
      source: syncResult.source || 'MOCK_GOVERNMENT',
      updatedBy: 'PFMS Nodal Engine'
    });

    application.updatedAt = new Date();

    // 4. Save to DB if application has save function (Mongoose document)
    if (typeof application.save === 'function') {
      try {
        await application.save();
      } catch (dbErr) {
        console.warn('DB save warning in StatusProcessor:', dbErr.message);
      }
    }

    // 5. Create Authoritative Audit Log Entry
    try {
      if (AuditLog && typeof AuditLog.create === 'function') {
        await AuditLog.create({
          applicationId: application._id,
          applicationNumber: application.applicationNumber,
          event: `GOVT_PFMS_SYNC_${nextStatus}`,
          oldStatus,
          newStatus: nextStatus,
          amount: govData.sanction?.amount || 0,
          source: syncResult.source || 'MOCK_GOVERNMENT',
          changedBy: 'PFMS Nodal Engine',
          action: 'SYNC_GOVERNMENT_PFMS',
          resource: 'GovernmentIntegration',
          details: govData.remarks || `Synchronized status to ${nextStatus}`
        });
      }
    } catch (auditErr) {
      console.warn('Audit log write warning:', auditErr.message);
    }

    return application;
  }
}

module.exports = StatusProcessor;
