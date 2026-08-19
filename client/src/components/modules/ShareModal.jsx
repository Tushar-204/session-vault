import React, { useState, useEffect } from 'react';
import { X, Copy, Share2, Check, Link2, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { shareTargets } from './shareTargets';

export const ShareModal = ({ isOpen, onClose, workspaceId, workspaceTitle, tabs = [] }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [workspaceTabs, setWorkspaceTabs] = useState(tabs);

  // The list endpoint omits the tabs array; fetch full details so the share
  // message can include the original links.
  useEffect(() => {
    if (!isOpen || !workspaceId) return;
    let cancelled = false;
    api
      .get(`/workspaces/${workspaceId}`)
      .then((res) => {
        if (!cancelled) setWorkspaceTabs(res.data?.data?.tabs || tabs);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isOpen, workspaceId]);

  if (!isOpen) return null;

  const shareText = workspaceTitle
    ? `Check out this session on SessionVault: ${workspaceTitle}`
    : 'Check out this session on SessionVault';

  // Compose the message with the ORIGINAL tab URLs so recipients get the real links.
  const buildMessage = () => {
    const links = workspaceTabs.map((t) => t.url).filter(Boolean);
    const parts = [shareText];
    if (links.length > 0) {
      parts.push('', 'Original links:', ...links.map((u) => `• ${u}`));
    }
    parts.push('', `Shared link: ${shareUrl}`);
    return parts.join('\n');
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/shared/workspace/${workspaceId}`, { accessLevel: 'view' });
      const shareCode = res.data?.data?.shareCode;
      if (!shareCode) {
        throw new Error('No share code returned.');
      }
      setShareUrl(`${window.location.origin}/share/${shareCode}`);
      toast.success('Share link created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create share link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Share link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link.');
    }
  };

  const handleShareTo = (target) => {
    window.open(
      target.build(shareUrl, buildMessage(), shareText),
      '_blank',
      'noopener,noreferrer,width=680,height=520'
    );
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: shareText, text: buildMessage(), url: shareUrl });
    } catch (err) {
      // User closed the share sheet — nothing to do.
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Share2 className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Share Workspace</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 pt-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate a secure public link to share this session's browser tabs with your team or community.
          </p>

          {!shareUrl ? (
            <button
              onClick={handleGenerateLink}
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              {loading ? 'Creating link...' : 'Create Public Share Link'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Public Share URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-purple-300 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <p className="text-xs font-semibold text-slate-300 mb-3">Share to</p>
                <div className="grid grid-cols-3 gap-2">
                  {shareTargets.map((target) => (
                    <button
                      key={target.key}
                      onClick={() => handleShareTo(target)}
                      className="flex flex-col items-center gap-1.5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
                    >
                      <span
                        className="h-9 w-9 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: target.color }}
                      >
                        {target.icon}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-300">{target.label}</span>
                    </button>
                  ))}
                  {navigator.share && (
                    <button
                      onClick={handleNativeShare}
                      className="flex flex-col items-center gap-1.5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
                    >
                      <span className="h-9 w-9 rounded-lg flex items-center justify-center bg-slate-700 text-white">
                        <Share2 className="h-4 w-4" />
                      </span>
                      <span className="text-[10px] font-semibold text-slate-300">More...</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
