import React, { useState, useEffect } from 'react';
import { X, Copy, Share2, Check, Link2, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ICON = {
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.445 4.437-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.445-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.358.101 11.94c0 2.096.548 4.16 1.595 5.986L0 24l6.19-1.625a11.9 11.9 0 005.79 1.474h.005c6.582 0 11.94-5.358 11.943-11.94A11.86 11.86 0 0020.52 3.449" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07" />
    </svg>
  ),
};

const shareTargets = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    color: '#25D366',
    icon: ICON.whatsapp,
    build: (url, message) => `https://wa.me/?text=${encodeURIComponent(message)}`,
  },
  {
    key: 'telegram',
    label: 'Telegram',
    color: '#229ED9',
    icon: ICON.telegram,
    build: (url, message) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`,
  },
  {
    key: 'email',
    label: 'Email',
    color: '#64748b',
    icon: ICON.email,
    build: (url, message, subject) => `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`,
  },
  {
    key: 'x',
    label: 'X',
    color: '#000000',
    icon: ICON.x,
    build: (url, message) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    color: '#0A66C2',
    icon: ICON.linkedin,
    build: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    color: '#1877F2',
    icon: ICON.facebook,
    build: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
];

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
