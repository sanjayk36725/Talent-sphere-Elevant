import React, { useState, useEffect } from 'react';
import {
  Mail,
  Server,
  ShieldCheck,
  Zap,
  Terminal,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Lock,
  Cpu,
  Layers,
  FileText,
} from 'lucide-react';
import { ESMTPConfig, ESMTPTestResult, EmailLog } from '../types';
import { safeFetchJson } from '../lib/api';

interface ESMTPModelPanelProps {
  userEmail?: string;
}

export const ESMTPModelPanel: React.FC<ESMTPModelPanelProps> = ({ userEmail }) => {
  const [config, setConfig] = useState<ESMTPConfig>({
    host: 'smtp.gmail.com',
    port: 587,
    security: 'STARTTLS',
    authMethod: 'LOGIN',
    username: 'esmtp.user@talentsphere.ai',
    password: '',
    fromName: 'Talent Sphere Elevate (ESMTP)',
    fromEmail: 'noreply@talentsphere.ai',
    ehloName: 'mail.talentsphere.ai',
    timeoutSeconds: 10,
    enableDebugLogs: true,
    extensions: {
      eightBitMime: true,
      smtpUtf8: true,
      pipelining: true,
      dsn: true,
      sizeLimitMb: 25,
    },
  });

  const [testRecipient, setTestRecipient] = useState(userEmail || 'test.recipient@talentsphere.ai');
  const [testResult, setTestResult] = useState<ESMTPTestResult | null>(null);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [testingHandshake, setTestingHandshake] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchConfig();
    fetchLogs();
  }, []);

  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const { ok, data } = await safeFetchJson('/api/esmtp/config');
      if (ok && data.config) {
        setConfig(data.config);
      }
    } catch (err) {
      console.warn('Failed to load ESMTP config:', err);
    } finally {
      setLoadingConfig(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('ts_token');
      const { ok, data } = await safeFetchJson('/api/esmtp/logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ok && data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.warn('Failed to load ESMTP logs:', err);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setStatusMsg(null);
    try {
      const token = localStorage.getItem('ts_token');
      const { ok, data } = await safeFetchJson('/api/esmtp/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });
      if (ok) {
        setStatusMsg({ text: 'ESMTP Mail Model configuration updated successfully.', type: 'success' });
      } else {
        setStatusMsg({ text: data.error || 'Failed to update ESMTP configuration.', type: 'error' });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Error updating ESMTP settings.', type: 'error' });
    } finally {
      setSavingConfig(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleRunTest = async () => {
    setTestingHandshake(true);
    setTestResult(null);
    try {
      const token = localStorage.getItem('ts_token');
      const { ok, data } = await safeFetchJson('/api/esmtp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientEmail: testRecipient }),
      });
      if (ok && data.result) {
        setTestResult(data.result);
        fetchLogs();
      } else {
        setStatusMsg({ text: data.error || 'ESMTP handshake test failed.', type: 'error' });
      }
    } catch (err: any) {
      console.error('ESMTP Handshake Test Error:', err);
    } finally {
      setTestingHandshake(false);
    }
  };

  const applyPreset = (preset: 'gmail' | 'sendgrid' | 'ses' | 'mailgun' | 'outlook' | 'mailtrap') => {
    if (preset === 'gmail') {
      setConfig((prev) => ({
        ...prev,
        host: 'smtp.gmail.com',
        port: 587,
        security: 'STARTTLS',
        authMethod: 'LOGIN',
        ehloName: 'gmail.talentsphere.ai',
      }));
    } else if (preset === 'sendgrid') {
      setConfig((prev) => ({
        ...prev,
        host: 'smtp.sendgrid.net',
        port: 587,
        security: 'STARTTLS',
        authMethod: 'PLAIN',
        username: 'apikey',
        ehloName: 'sendgrid.talentsphere.ai',
      }));
    } else if (preset === 'ses') {
      setConfig((prev) => ({
        ...prev,
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 465,
        security: 'SSL',
        authMethod: 'LOGIN',
        ehloName: 'aws-ses.talentsphere.ai',
      }));
    } else if (preset === 'mailgun') {
      setConfig((prev) => ({
        ...prev,
        host: 'smtp.mailgun.org',
        port: 587,
        security: 'STARTTLS',
        authMethod: 'PLAIN',
        ehloName: 'mailgun.talentsphere.ai',
      }));
    } else if (preset === 'outlook') {
      setConfig((prev) => ({
        ...prev,
        host: 'smtp.office365.com',
        port: 587,
        security: 'STARTTLS',
        authMethod: 'LOGIN',
        ehloName: 'outlook.talentsphere.ai',
      }));
    } else if (preset === 'mailtrap') {
      setConfig((prev) => ({
        ...prev,
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        security: 'NONE',
        authMethod: 'PLAIN',
        ehloName: 'mailtrap.talentsphere.ai',
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Server className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                ESMTP MODEL ENGINE v2.6
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> OPERATIONAL
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Mail className="w-6 h-6 text-indigo-400" /> Extended SMTP (ESMTP) Server Model
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Configurable ESMTP dispatch engine supporting RFC 5321 EHLO greetings, STARTTLS encryption, AUTH mechanisms, and 8BITMIME / SMTPUTF8 extensions for automated notifications and 2FA OTPs.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                fetchConfig();
                fetchLogs();
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingConfig ? 'animate-spin' : ''}`} /> Refresh Status
            </button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase mr-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> ESMTP Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('gmail')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-200 border border-slate-700 text-[11px] font-mono font-bold transition-all cursor-pointer"
          >
            Gmail ESMTP
          </button>
          <button
            type="button"
            onClick={() => applyPreset('sendgrid')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-200 border border-slate-700 text-[11px] font-mono font-bold transition-all cursor-pointer"
          >
            SendGrid SMTP
          </button>
          <button
            type="button"
            onClick={() => applyPreset('ses')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-200 border border-slate-700 text-[11px] font-mono font-bold transition-all cursor-pointer"
          >
            AWS SES SSL
          </button>
          <button
            type="button"
            onClick={() => applyPreset('mailgun')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-200 border border-slate-700 text-[11px] font-mono font-bold transition-all cursor-pointer"
          >
            Mailgun ESMTP
          </button>
          <button
            type="button"
            onClick={() => applyPreset('outlook')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-200 border border-slate-700 text-[11px] font-mono font-bold transition-all cursor-pointer"
          >
            Outlook 365
          </button>
          <button
            type="button"
            onClick={() => applyPreset('mailtrap')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-200 border border-slate-700 text-[11px] font-mono font-bold transition-all cursor-pointer"
          >
            Mailtrap Sandbox
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          {statusMsg.text}
        </div>
      )}

      {/* Main Grid: Server Settings & Handshake Diagnostic */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Config Form */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" /> ESMTP Model Parameters
            </h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">RFC 5321 COMPLIANT</span>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">ESMTP Host / Server</label>
                <input
                  type="text"
                  value={config.host}
                  onChange={(e) => setConfig({ ...config, host: e.target.value })}
                  required
                  placeholder="e.g. smtp.gmail.com"
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Port</label>
                <input
                  type="number"
                  value={config.port}
                  onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value, 10) || 587 })}
                  required
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Security Transport</label>
                <select
                  value={config.security}
                  onChange={(e) => setConfig({ ...config, security: e.target.value as any })}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
                >
                  <option value="STARTTLS">STARTTLS (Port 587 / 25)</option>
                  <option value="SSL">SSL / TLS (Port 465)</option>
                  <option value="NONE">None / Plain (Port 2525)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Auth Mechanism</label>
                <select
                  value={config.authMethod}
                  onChange={(e) => setConfig({ ...config, authMethod: e.target.value as any })}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
                >
                  <option value="LOGIN">AUTH LOGIN (Standard)</option>
                  <option value="PLAIN">AUTH PLAIN</option>
                  <option value="CRAM-MD5">AUTH CRAM-MD5</option>
                  <option value="NONE">No Authentication</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username / SMTP User</label>
                <input
                  type="text"
                  value={config.username}
                  onChange={(e) => setConfig({ ...config, username: e.target.value })}
                  placeholder="user@domain.com"
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password / App Key</label>
                <input
                  type="password"
                  value={config.password || ''}
                  onChange={(e) => setConfig({ ...config, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">From Sender Name</label>
                <input
                  type="text"
                  value={config.fromName}
                  onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">From Email Address</label>
                <input
                  type="email"
                  value={config.fromEmail}
                  onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">EHLO Greeting Hostname</label>
              <input
                type="text"
                value={config.ehloName}
                onChange={(e) => setConfig({ ...config, ehloName: e.target.value })}
                placeholder="mail.talentsphere.ai"
                className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* ESMTP Extensions Checklist */}
            <div className="pt-2 space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider font-mono text-slate-500">
                ESMTP Service Extensions (RFC Negotiated)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={config.extensions.eightBitMime}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        extensions: { ...config.extensions, eightBitMime: e.target.checked },
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] font-mono font-bold text-slate-800">8BITMIME</span>
                </label>

                <label className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={config.extensions.smtpUtf8}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        extensions: { ...config.extensions, smtpUtf8: e.target.checked },
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] font-mono font-bold text-slate-800">SMTPUTF8</span>
                </label>

                <label className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={config.extensions.pipelining}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        extensions: { ...config.extensions, pipelining: e.target.checked },
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] font-mono font-bold text-slate-800">PIPELINING</span>
                </label>

                <label className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={config.extensions.dsn}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        extensions: { ...config.extensions, dsn: e.target.checked },
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] font-mono font-bold text-slate-800">DSN Status</span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingConfig}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                {savingConfig ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Save ESMTP Configuration
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Handshake Tester & Diagnostic Logs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" /> ESMTP Handshake & Test Dispatch
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Test Recipient Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="recipient@example.com"
                  className="flex-1 bg-slate-50 text-slate-900 text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleRunTest}
                  disabled={testingHandshake}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {testingHandshake ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Run EHLO Test
                </button>
              </div>
            </div>

            {/* Test Results Output */}
            {testResult && (
              <div className="space-y-3 pt-2">
                <div
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Handshake Passed ({testResult.latencyMs}ms)
                  </span>
                  <span className="font-mono text-[10px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded">
                    ID: {testResult.sentMessageId}
                  </span>
                </div>

                {/* Capabilities Badges */}
                <div className="flex flex-wrap gap-1">
                  {testResult.capabilitiesDetected.map((cap, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded"
                    >
                      {cap}
                    </span>
                  ))}
                </div>

                {/* Live ESMTP Terminal Logs */}
                <div className="bg-slate-950 text-emerald-400 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto space-y-1 border border-slate-800 shadow-inner">
                  <div className="text-slate-500 font-bold border-b border-slate-800 pb-1 mb-1">
                    --- ESMTP PROTOCOL CONVERSATION LOG ---
                  </div>
                  {testResult.handshakeLogs.map((log, index) => (
                    <div
                      key={index}
                      className={
                        log.startsWith('C:')
                          ? 'text-cyan-300 font-semibold'
                          : log.startsWith('S:')
                          ? 'text-emerald-400'
                          : log.startsWith('[TLS')
                          ? 'text-amber-300'
                          : 'text-slate-400'
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent ESMTP Mail Log History */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" /> Recent ESMTP Email Dispatches
          </h3>
          <span className="text-[10px] font-mono text-slate-400 font-bold">{logs.length} RECORDED DISPATCHES</span>
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4 text-center">No ESMTP email logs recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Dispatched At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.slice(0, 8).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-all">
                    <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-slate-700">{log.emailType}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-900">{log.recipient}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium truncate max-w-xs">{log.subject}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          log.status === 'SENT'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {log.status === 'SENT' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">
                      {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
