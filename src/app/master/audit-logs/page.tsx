'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Calendar,
  Filter,
  Shield,
  Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ActionBadge } from '@/components/ui/Badge';
import { useMasterData } from '@/context/MasterDataContext';
import { useToast } from '@/context/ToastContext';

export default function AuditLogsPage() {
  const { auditLogs } = useMasterData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('All');
  const [selectedActionType, setSelectedActionType] = useState('All');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const orgList = Array.from(new Set(auditLogs.map((l) => l.targetOrganization)));
  const actionList = Array.from(new Set(auditLogs.map((l) => l.action)));

  // Filter logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.targetOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchesOrg = selectedOrg === 'All' || log.targetOrganization === selectedOrg;
    const matchesAction = selectedActionType === 'All' || log.action === selectedActionType;

    return matchesSearch && matchesOrg && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Action', 'Target Organization', 'Details', 'Performed By', 'IP Address'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.action}"`,
      `"${l.targetOrganization}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.performedBy}"`,
      `"${l.ipAddress}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cody_master_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Audit log CSV exported successfully', 'success', 'Exported');
  };

  const handleCopyJson = (payload: Record<string, unknown>, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    showToast('Raw JSON payload copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Audit Logs
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Immutable chronological ledger of Super Admin configuration changes and security events
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={handleExportCSV}
          icon={<Download size={15} />}
        >
          Export CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '16px',
          alignItems: 'center'
        }}
      >
        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 16px'
          }}
        >
          <Search size={15} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search details, organization, or IP address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>

        {/* Organization Filter */}
        <select
          className="select-field"
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: 'var(--radius-pill)' }}
        >
          <option value="All">All Organizations</option>
          {orgList.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {/* Action Type Filter */}
        <select
          className="select-field"
          value={selectedActionType}
          onChange={(e) => setSelectedActionType(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: 'var(--radius-pill)' }}
        >
          <option value="All">All Action Types</option>
          {actionList.map((act) => (
            <option key={act} value={act}>
              {act.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Audit Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', maxHeight: '680px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead
              style={{
                position: 'sticky',
                top: 0,
                backgroundColor: '#111916',
                borderBottom: '1px solid var(--border-strong)',
                color: 'var(--text-muted)',
                zIndex: 10
              }}
            >
              <tr>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Timestamp</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Action</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Target Organization</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Details</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Performed By</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>IP Address</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Payload</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No audit records match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          cursor: 'pointer',
                          backgroundColor: isExpanded ? 'var(--bg-elevated)' : 'transparent',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {log.timestamp}
                        </td>

                        <td style={{ padding: '14px 20px' }}>
                          <ActionBadge action={log.action} />
                        </td>

                        <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {log.targetOrganization}
                        </td>

                        <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', maxWidth: '340px' }}>
                          {log.details}
                        </td>

                        <td style={{ padding: '14px 20px' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: 'var(--primary-soft)',
                              color: 'var(--primary)',
                              fontSize: '11px',
                              fontWeight: 600
                            }}
                          >
                            {log.performedBy}
                          </span>
                        </td>

                        <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                          {log.ipAddress}
                        </td>

                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                            <span style={{ fontSize: '11px' }}>{isExpanded ? 'Hide' : 'Inspect'}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable JSON Payload Viewer */}
                      {isExpanded && (
                        <tr style={{ backgroundColor: '#0c120f', borderBottom: '1px solid var(--border)' }}>
                          <td colSpan={7} style={{ padding: '16px 24px' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '10px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}>
                                <Terminal size={14} />
                                <span>Raw Event Payload Snapshot (JSON)</span>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyJson(log.payload, log.id);
                                }}
                                style={{
                                  background: 'var(--bg-elevated)',
                                  border: '1px solid var(--border)',
                                  color: 'var(--text-secondary)',
                                  borderRadius: 'var(--radius-pill)',
                                  padding: '4px 12px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                {copiedId === log.id ? <Check size={12} color="var(--primary)" /> : <Copy size={12} />}
                                <span>{copiedId === log.id ? 'Copied' : 'Copy Payload'}</span>
                              </button>
                            </div>

                            <pre
                              style={{
                                backgroundColor: '#080d0b',
                                border: '1px solid var(--border-strong)',
                                borderRadius: 'var(--radius-md)',
                                padding: '14px',
                                color: '#71ebb8',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                lineHeight: '1.5',
                                overflowX: 'auto',
                                margin: 0
                              }}
                            >
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
