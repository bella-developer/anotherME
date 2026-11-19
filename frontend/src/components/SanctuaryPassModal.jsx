import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  X,
  Headphones,
  Feather,
  BookmarkCheck,
  ShieldCheck,
  Crown,
  Lock,
} from 'lucide-react';
import {
  closeMembershipModal,
  upgradeToPatron,
  cancelPatron,
} from '../features/sanctuarySlice';
import { useToast } from '../contexts/ToastContext';
import useReducedMotion from '../hooks/useReducedMotion';

export default function SanctuaryPassModal() {
  const dispatch = useDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { isMembershipModalOpen, isPatron, patronTier } = useSelector(
    (state) => state.sanctuary
  );
  const { addToast } = useToast();

  const [billingCycle, setBillingCycle] = useState('annual'); // 'annual' | 'monthly'
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isMembershipModalOpen) return null;

  const handleActivate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      dispatch(upgradeToPatron({ tier: billingCycle }));
      setIsProcessing(false);
      addToast({
        type: 'success',
        title: 'Welcome to the Sanctuary',
        message: 'Your ESO Sanctuary Pass is active. Enjoy soundscapes, vault storage & studio privileges.',
      });
    }, 700);
  };

  const handleCancel = () => {
    dispatch(cancelPatron());
    addToast({
      type: 'info',
      title: 'Pass Updated',
      message: 'Your Sanctuary Pass was deactivated.',
    });
  };

  const perks = [
    {
      icon: Headphones,
      title: 'Generative Soundscapes',
      desc: 'Binaural theta frequencies, hearth embers, and Kyoto rain synthesized directly in-browser.',
    },
    {
      icon: Feather,
      title: 'Sanctuary Post Studio',
      desc: 'Distraction-free focus writer with contemplation prompts and draft autosave.',
    },
    {
      icon: BookmarkCheck,
      title: 'Private Sanctuary Vault',
      desc: 'Offline-ready private thought archiving, drafts staging, and one-click JSON export.',
    },
    {
      icon: Crown,
      title: 'Quiet Aura Badge',
      desc: 'Subtle patron mark honoring your support for quiet, ad-free culture.',
    },
    {
      icon: ShieldCheck,
      title: 'Ad-Free & Solitude-First',
      desc: 'Zero behavioral tracking, zero attention traps, and zero sponsored noise.',
    },
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isProcessing) {
      dispatch(closeMembershipModal());
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sanctuary-pass-title"
      style={{
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(8px)',
        animation: prefersReducedMotion ? 'none' : 'fadeIn 180ms ease-out',
      }}
    >
      <div
        className="w-full max-w-md my-6 overflow-hidden text-left"
        style={{
          background: '#0a0a0a',
          borderRadius: '8px',
          border: '1px solid #21262d',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.95)',
          animation: prefersReducedMotion
            ? 'none'
            : 'slideUp 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#21262d]">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#8b949e] font-mono">
              Membership
            </div>
            <h2
              id="sanctuary-pass-title"
              className="text-base sm:text-lg font-medium text-[#e6edf3] font-mono mt-0.5"
            >
              The Sanctuary Pass
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeMembershipModal())}
            disabled={isProcessing}
            className="text-[#6b7280] hover:text-[#e6edf3] transition-colors p-1"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-xs text-[#8b949e] font-mono leading-relaxed mb-4">
            Support an ad-free digital space built exclusively for quiet minds, solitary creators, and deep contemplation.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex border border-[#21262d] rounded p-0.5 bg-[rgba(255,255,255,0.02)] mb-4">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-1.5 text-xs font-mono transition-all rounded ${
                billingCycle === 'monthly'
                  ? 'bg-[#21262d] text-[#e6edf3] font-medium'
                  : 'text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              Monthly ($4.99)
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`flex-1 py-1.5 text-xs font-mono transition-all rounded flex items-center justify-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-[#21262d] text-[#e6edf3] font-medium'
                  : 'text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              <span>Annual ($39.99)</span>
              <span className="text-[9px] uppercase tracking-wider text-[#2EE6FF] border border-[#2EE6FF]/30 px-1 py-0.2 rounded">
                -33%
              </span>
            </button>
          </div>

          {/* Perks List */}
          <div className="space-y-3 py-3 border-t border-b border-[#21262d]">
            {perks.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <Icon className="w-3.5 h-3.5 text-[#8b949e] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-medium text-[#e6edf3] font-mono leading-tight">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-[#6e7681] font-mono leading-relaxed mt-0.5">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Solitary quote */}
          <div className="mt-3.5 text-center">
            <p className="text-[11px] text-[#6e7681] font-mono italic leading-relaxed">
              &ldquo;The only social space that does not demand my nervous system.&rdquo;
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#21262d] bg-[rgba(255,255,255,0.01)]">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#6e7681] font-mono block">
              Current
            </span>
            <span className="text-xs text-[#8b949e] font-mono">
              {isPatron ? `Patron (${patronTier})` : 'Free Tier'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isPatron ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded text-xs font-mono text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(closeMembershipModal())}
                  className="px-3 py-1.5 rounded text-xs font-mono text-[#e6edf3] border border-[#21262d] hover:border-[#8b949e] transition-colors"
                >
                  Close
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleActivate}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium uppercase tracking-wider text-black bg-[#e6edf3] hover:bg-white active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={12} />
                    <span>
                      Activate {billingCycle === 'annual' ? '$39.99/yr' : '$4.99/mo'}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
