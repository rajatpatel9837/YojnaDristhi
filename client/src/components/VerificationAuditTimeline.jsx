import React from 'react';
import { History, CheckCircle2, XCircle, AlertCircle, Clock, UserCheck, FileText } from 'lucide-react';

/**
 * Verification Audit Timeline Component
 * Displays full audit history of verification submissions and administrator decisions.
 */
export default function VerificationAuditTimeline({ auditLogs = [] }) {
  if (!auditLogs || auditLogs.length === 0) {
    return (
      <div className="p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center text-slate-500 text-xs">
        <History className="w-6 h-6 text-slate-400 mx-auto mb-2" />
        No audit log history recorded yet for this entity.
      </div>
    );
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />;
      case 'REJECTED':
      case 'SUSPENDED':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'INFORMATION_REQUESTED':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'DOCUMENT_ADDED':
        return <FileText className="w-4 h-4 text-[#0F766E]" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold text-[#173B57] uppercase tracking-wider">
        <History className="w-4 h-4 text-[#0F766E]" />
        Verification Audit Trail ({auditLogs.length})
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {auditLogs.map((log, idx) => (
          <div key={idx} className="relative group">
            
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1 p-1 rounded-full bg-white border border-slate-200 shadow-sm">
              {getActionIcon(log.action)}
            </div>

            {/* Audit Log Card */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 text-xs space-y-1.5 shadow-sm text-[#173B57]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#173B57] uppercase text-[11px] tracking-wide">
                  {log.action?.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(log.timestamp).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {log.notes && (
                <p className="text-slate-600 text-xs">{log.notes}</p>
              )}

              {log.rejectionReason && (
                <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[11px]">
                  <strong>Reason:</strong> {log.rejectionReason}
                </div>
              )}

              <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
                <span>By: {log.performedBy?.name || 'System / Admin'}</span>
                {log.previousStatus && (
                  <span>Status: {log.previousStatus} → <strong>{log.newStatus}</strong></span>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
