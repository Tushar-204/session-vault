import React, { useState } from 'react';
import { Download, Upload, FileJson, Copy, Check, AlertTriangle } from 'lucide-react';
import { useWorkspaces } from '../hooks/useWorkspaces';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ImportExport = () => {
  const { workspaces } = useWorkspaces({ limit: 100 });
  const [exportFormat, setExportFormat] = useState('json');
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleExportJSON = () => {
    const exportData = {
      appName: 'SessionVault',
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      sessions: workspaces.map((ws) => ({
        title: ws.title,
        description: ws.description,
        color: ws.color,
        tags: ws.tags,
        tabs: ws.tabs?.map((t) => ({
          title: t.title,
          url: t.url,
          favIconUrl: t.favIconUrl,
          pinned: t.pinned,
        })) || [],
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sessionvault-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Workspace exported successfully!');
  };

  const handleCopyJSON = async () => {
    const exportData = {
      appName: 'SessionVault',
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      sessions: workspaces.map((ws) => ({
        title: ws.title,
        description: ws.description,
        color: ws.color,
        tags: ws.tags,
        tabs: ws.tabs?.map((t) => ({
          title: t.title,
          url: t.url,
          favIconUrl: t.favIconUrl,
          pinned: t.pinned,
        })) || [],
      })),
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    await navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    toast.success('JSON copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(importText);

      if (parsed.appName !== 'SessionVault' || !Array.isArray(parsed.sessions)) {
        throw new Error('Invalid SessionVault export format.');
      }

      setImportStatus({ loading: true, message: 'Importing sessions...' });

      const importPayload = { sessions: parsed.sessions };
      const res = await api.post('/import', importPayload);

      if (res.status !== 200 && res.status !== 201) {
        throw new Error(res.data?.message || 'Import failed.');
      }

      setImportStatus({ loading: false, message: 'Sessions imported successfully!', success: true });
      setImportText('');
      toast.success('Sessions imported successfully!');
    } catch (err) {
      setImportStatus({ loading: false, message: err.message, success: false });
      toast.error(err.message || 'Import failed.');
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImportText(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-800/80">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <FileJson className="h-5 w-5 text-blue-400" />
          <span>Import / Export</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Backup, migrate, and share your workspace sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Download className="h-4 w-4 text-blue-400" /> Export Sessions
          </h3>
          <p className="text-xs text-slate-400">Download all your workspaces as a JSON file for backup or migration.</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <div>
                <p className="text-xs font-semibold text-slate-200">Workspaces to export</p>
                <p className="text-[11px] text-slate-500">{workspaces.length} workspace(s) ready</p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-400 text-[10px] font-bold">{exportFormat.toUpperCase()}</span>
            </div>

            <button onClick={handleExportJSON} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2">
              <Download className="h-4 w-4" /> Export as JSON
            </button>

            <button onClick={handleCopyJSON} className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied!' : 'Copy JSON to Clipboard'}
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Upload className="h-4 w-4 text-emerald-400" /> Import Sessions
          </h3>
          <p className="text-xs text-slate-400">Restore previously exported workspace sessions from a JSON file.</p>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Select JSON File
              <input type="file" accept=".json" onChange={handleFileImport} className="mt-1 block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:bg-slate-800 file:text-slate-200 file:text-xs file:font-semibold file:hover:bg-slate-700 cursor-pointer" />
            </label>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='Paste SessionVault JSON export here...'
              className="w-full h-32 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500 resize-none"
            />

            {importStatus && (
              <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${importStatus.success ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-600/20 text-rose-400 border border-rose-500/30'}`}>
                {importStatus.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {importStatus.message}
              </div>
            )}

            <button
              onClick={handleImport}
              disabled={!importText.trim() || importStatus?.loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Upload className="h-4 w-4" /> Import Sessions
            </button>
          </div>
        </div>
      </div>

      {/* Auto Save Notice */}
      <div className="glass-card border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-amber-600/20 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">Auto-Save is Enabled</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Sessions are automatically detected and saved when you use the SessionVault Chrome Extension.
            You can also manually save any open browser window from the extension popup or right-click context menu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;