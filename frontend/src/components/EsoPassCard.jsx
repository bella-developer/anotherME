import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Sparkles, Shield, Volume2, Bookmark, CheckCircle2, ArrowRight } from 'lucide-react';
import PaymentModal from './PaymentModal';

export default function EsoPassCard({ onPermitSuccess, className = '' }) {
  const { isPatron } = useSelector((state) => state.sanctuary || {});
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const perks = [
    { icon: Shield, text: 'Ad-free sanctuary with zero tracking' },
    { icon: Sparkles, text: 'Full entry to all private rooms & circles' },
    { icon: Volume2, text: 'Curated focus soundscapes & ambient audio' },
    { icon: Bookmark, text: 'Private vault for saved posts & drafts' },
  ];

  const handleSuccess = (token) => {
    if (onPermitSuccess) {
      onPermitSuccess(token);
    }
  };

  return (
    <>
      <div
        className={`w-full rounded-xl p-5 sm:p-6 transition-all duration-300 relative overflow-hidden border border-white/10 ${className}`}
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08), inset 0 0 30px rgba(255,255,255,0.03)',
        }}
      >
        {/* Subtle decorative glow */}
        <div
          className="absolute -top-16 -right-16 w-36 h-36 rounded-full pointer-events-none opacity-20 blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(220, 38, 38, 0.8), transparent)' }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#DC2626]" />
            <h3 className="text-xs uppercase font-mono tracking-[0.2em] text-white font-bold">
              ESO PASS
            </h3>
          </div>
          <span
            className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full border"
            style={{
              borderColor: isPatron ? 'rgba(16, 185, 129, 0.4)' : 'rgba(220, 38, 38, 0.35)',
              color: isPatron ? '#34d399' : '#DC2626',
              background: isPatron ? 'rgba(16, 185, 129, 0.1)' : 'rgba(220, 38, 38, 0.08)',
            }}
          >
            {isPatron ? 'Permitted' : 'Required'}
          </span>
        </div>

        {/* Price & Description */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-white">$4.99</span>
            <span className="text-xs text-white/40 font-mono">/ month (or 250 ETB)</span>
          </div>
          <p className="text-xs text-white/60 font-sans mt-1 leading-relaxed">
            Token-based access permit. We permit user entry upon payment.
          </p>
        </div>

        {/* Benefits list */}
        <div className="space-y-2 py-3 border-t border-b border-white/5 mb-4">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="flex items-center gap-2 text-white/70">
                <Icon size={12} className="text-white/40 flex-shrink-0" />
                <span className="text-[11px] font-sans">{p.text}</span>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        {isPatron ? (
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <CheckCircle2 size={13} />
            <span>Pass Active • Access Permitted</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsPaymentOpen(true)}
            className="w-full py-2.5 px-4 rounded-lg text-xs font-mono font-medium tracking-wider uppercase text-black bg-white hover:bg-white/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow"
          >
            <span>Pay & Get Permitted</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
