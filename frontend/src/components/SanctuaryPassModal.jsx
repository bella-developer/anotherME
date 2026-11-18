import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Sparkles,
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

export default function SanctuaryPassModal() {
  const dispatch = useDispatch();
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
        message: 'Your ESO Sanctuary Pass is active. Enjoy generative audio, vault storage & studio privileges.',
      });
    }, 900);
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
      title: 'Zenith Generative Soundscapes',
      desc: 'Binaural theta frequencies, warm hearths, Kyoto rain & ambient drones synthesised directly in-browser with zero latency.',
    },
    {
      icon: Feather,
      title: 'Sanctuary Post Studio',
      desc: 'Distraction-free focus writer, introspection prompts, live tranquility metrics, and auto-saving drafts.',
    },
    {
      icon: BookmarkCheck,
      title: 'Private Sanctuary Vault',
      desc: 'Unlimited offline-ready private bookmarking, draft staging, and thought archiving with one-click export.',
    },
    {
      icon: Crown,
      title: 'Quiet Aura Badges',
      desc: 'Exclusive subtle glowing patron insignia honoring your patronage of quiet culture.',
    },
    {
      icon: ShieldCheck,
      title: 'Solitude-First & Ad-Free',
      desc: 'Zero behavioral tracking, zero attention-traps, and zero sponsored noise. A sanctuary designed for solitude.',
    },
  ];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sanctuary-pass-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(closeMembershipModal())}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-2xl rounded-3xl border p-6 sm:p-8 overflow-hidden my-8"
          style={{
            background: 'linear-gradient(180deg, rgba(20, 20, 26, 0.96) 0%, rgba(10, 10, 12, 0.98) 100%)',
            borderColor: 'rgba(217, 119, 87, 0.25)',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 50px rgba(217, 119, 87, 0.1)',
          }}
        >
          {/* Subtle Ambient Glow Background */}
          <div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
            style={{ backgroundColor: 'rgba(217, 119, 87, 0.18)' }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
            style={{ backgroundColor: 'rgba(57, 121, 130, 0.15)' }}
          />

          {/* Close Button */}
          <button
            onClick={() => dispatch(closeMembershipModal())}
            className="absolute top-5 right-5 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center max-w-md mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[11px] font-medium tracking-widest uppercase mb-3">
              <Sparkles size={12} />
              <span>ESO Membership Tier</span>
            </div>
            <h2 id="sanctuary-pass-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              The Sanctuary Pass
            </h2>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Support an ad-free digital sanctuary built exclusively for quiet minds, solitary creators, and deep contemplation.
            </p>

            {/* Billing Toggle */}
            <div className="mt-6 inline-flex items-center p-1 rounded-full bg-white/5 border border-white/10">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                Monthly ($4.99/mo)
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-[#D97757] text-white shadow-md'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <span>Annual ($39.99/yr)</span>
                <span className="text-[9px] uppercase tracking-wider bg-black/40 px-1.5 py-0.5 rounded-full text-white/90 font-semibold">
                  Save 33%
                </span>
              </button>
            </div>
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {perks.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#D97757]/15 text-[#D97757] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white/90 mb-0.5">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Testimonial Quote */}
          <div className="mb-6 p-3.5 rounded-xl border border-white/5 bg-white/[0.015] text-center">
            <p className="text-xs italic text-white/70 mb-1">
              &ldquo;ESO is the only social space on the internet that doesn&apos;t demand my nervous system. The soundscape and studio are essential daily rituals.&rdquo;
            </p>
            <span className="text-[10px] text-white/40 tracking-wider uppercase">
              — Solitary Patron &bull; Member since 2026
            </span>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="text-center sm:text-left">
              <span className="text-xs text-white/40">Current Plan</span>
              <p className="text-sm font-medium text-white/90">
                {isPatron ? `Sanctuary Patron (${patronTier})` : 'Wanderer (Free Access)'}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isPatron ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors border border-red-500/20"
                  >
                    Cancel Membership
                  </button>
                  <button
                    onClick={() => dispatch(closeMembershipModal())}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
                  >
                    Close
                  </button>
                </>
              ) : (
                <button
                  onClick={handleActivate}
                  disabled={isProcessing}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-200 via-[#D97757] to-amber-400 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
                  style={{
                    boxShadow: '0 0 25px rgba(217, 119, 87, 0.4)',
                  }}
                >
                  {isProcessing ? (
                    <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>
                        Activate {billingCycle === 'annual' ? '$39.99/Year' : '$4.99/Month'}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
