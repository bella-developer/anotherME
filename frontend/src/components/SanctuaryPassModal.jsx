import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  X,
  Volume2,
  Bookmark,
  Shield,
  Star,
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
      addToast('ESO Pass activated. Thank you for your support!', 'success');
    }, 600);
  };

  const handleCancel = () => {
    dispatch(cancelPatron());
    addToast('Pass cancelled.', 'info');
  };

  const perks = [
    {
      icon: Volume2,
      title: 'Background sounds',
      desc: 'Calm audio for deep focus',
    },
    {
      icon: Bookmark,
      title: 'Saved posts & drafts',
      desc: 'Keep thoughts and private drafts',
    },
    {
      icon: Star,
      title: 'Supporter badge',
      desc: 'Subtle supporter icon on profile',
    },
    {
      icon: Shield,
      title: 'No ads, ever',
      desc: 'Pure quiet with zero tracking',
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
      aria-labelledby="supporter-pass-title"
      style={{
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        animation: prefersReducedMotion ? 'none' : 'fadeIn 180ms ease-out',
      }}
    >
      <div
        className="w-full max-w-sm my-6 overflow-hidden text-left"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.95)',
          animation: prefersReducedMotion
            ? 'none'
            : 'slideUp 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#21262d]">
          <div>
            <h2
              id="supporter-pass-title"
              className="text-base font-sans font-medium text-[#ffffff]"
            >
              ESO Pass
            </h2>
            <p className="text-xs font-mono text-[#8b949e] mt-0.5">
              Support a quiet, ad-free space
            </p>
          </div>
          <button
            onClick={() => dispatch(closeMembershipModal())}
            disabled={isProcessing}
            className="text-[#6e7681] hover:text-[#e6edf3] transition-colors p-1"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-4 py-3.5">
          {/* Billing Cycle Toggle */}
          <div className="flex border border-[#21262d] rounded p-0.5 bg-[rgba(255,255,255,0.02)] mb-3">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-1 text-xs font-mono transition-all rounded ${
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
              className={`flex-1 py-1 text-xs font-mono transition-all rounded flex items-center justify-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-[#21262d] text-[#e6edf3] font-medium'
                  : 'text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              <span>Annual ($39.99)</span>
              <span className="text-[9px] uppercase font-mono text-[#DC2626] border border-[#DC2626]/30 px-1 rounded">
                -33%
              </span>
            </button>
          </div>

          {/* Perks */}
          <div className="space-y-2.5 py-2.5 border-t border-b border-[#21262d]">
            {perks.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="flex items-start gap-2.5">
                  <Icon size={14} className="text-[#8b949e] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-mono font-medium text-[#e6edf3]">
                      {p.title}
                    </h4>
                    <p className="text-[11px] font-mono text-[#6e7681] mt-0.5 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#21262d] bg-[rgba(255,255,255,0.01)]">
          <span className="text-xs font-mono text-[#8b949e]">
            {isPatron ? `Active (${patronTier})` : 'Free account'}
          </span>

          <div className="flex items-center gap-2">
            {isPatron ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-2.5 py-1 rounded text-xs font-mono text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(closeMembershipModal())}
                  className="px-3 py-1 rounded text-xs font-mono text-[#e6edf3] border border-[#21262d] hover:border-[#8b949e] transition-colors"
                >
                  Close
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleActivate}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-mono font-medium uppercase tracking-wider text-black bg-[#e6edf3] hover:bg-white active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={11} />
                    <span>
                      Get Pass ({billingCycle === 'annual' ? '$39.99/yr' : '$4.99/mo'})
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
