import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Copy, Check, ShieldCheck, Wallet, Phone, Building2 } from 'lucide-react';
import { upgradeToPatron } from '../features/sanctuarySlice';
import { useToast } from '../contexts/ToastContext';

export default function PaymentModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const [method, setMethod] = useState('crypto'); // 'crypto' | 'telebirr' | 'bank'
  const [copiedKey, setCopiedKey] = useState(null);
  const [txRef, setTxRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const paymentData = {
    crypto: {
      name: 'Crypto (USDT)',
      icon: Wallet,
      label: 'Test Crypto USDT Address',
      value: '0x71C69447d25f7786B7fDe928c0490E385D7e3F39',
      network: 'USDT (TRC-20 / ERC-20 Testnet)',
      amount: '$4.99 USDT / month',
      instruction: 'Transfer $4.99 USDT to the test USDT address below and click confirm to permit access.',
    },
    telebirr: {
      name: 'Telebirr',
      icon: Phone,
      label: 'Telebirr Phone Number',
      value: '0922334455',
      receiver: 'ESO Sanctuary',
      amount: '250 ETB / month',
      instruction: 'Send 250 ETB via Telebirr to the phone number below and click confirm to permit access.',
    },
    bank: {
      name: 'Bank Transfer',
      icon: Building2,
      label: 'Bank Account Number',
      value: '1000303559993',
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      accountName: 'ESO Media',
      amount: '250 ETB / month',
      instruction: 'Transfer 250 ETB to the bank account number below and click confirm to permit access.',
    },
  };

  const current = paymentData[method];
  const CurrentIcon = current.icon;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConfirmPayment = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const token = `eso_token_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      dispatch(upgradeToPatron({ tier: 'monthly', token }));
      setIsSubmitting(false);
      addToast('Payment confirmed! ESO Pass permitted.', 'success');

      if (onSuccess) {
        onSuccess(token);
      }
      if (onClose) {
        onClose();
      }
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      style={{
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md my-6 overflow-hidden rounded-xl text-left border border-white/10"
        style={{
          background: 'rgba(12, 12, 14, 0.98)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-sans font-semibold text-white tracking-wide">
                ESO Pass Payment
              </h2>
            </div>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Token-based access permit
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Payment Tabs */}
        <div className="p-5">
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { id: 'crypto', label: 'Crypto (USDT)', icon: Wallet },
              { id: 'telebirr', label: 'Telebirr', icon: Phone },
              { id: 'bank', label: 'Bank', icon: Building2 },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = method === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMethod(tab.id)}
                  className={`py-2 px-2 rounded-lg text-xs font-mono font-medium flex flex-col items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/25 shadow'
                      : 'bg-white/[0.02] text-white/50 border border-white/5 hover:text-white/80 hover:bg-white/[0.05]'
                  }`}
                >
                  <TabIcon size={14} className={isActive ? 'text-white' : 'text-white/40'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Details Card */}
          <div
            className="p-4 rounded-xl border border-white/10 space-y-3.5"
            style={{ background: 'rgba(255, 255, 255, 0.02)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">
                Amount
              </span>
              <span className="text-sm font-mono font-semibold text-white">
                {current.amount}
              </span>
            </div>

            <p className="text-xs text-white/60 leading-relaxed font-sans">
              {current.instruction}
            </p>

            {/* Address / Account / Phone Box */}
            <div className="p-3 rounded-lg bg-black/60 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                  {current.label}
                </span>
                {current.network && (
                  <span className="text-[10px] text-amber-400 font-mono">
                    {current.network}
                  </span>
                )}
                {current.bankName && (
                  <span className="text-[10px] text-amber-400 font-mono">
                    {current.bankName}
                  </span>
                )}
                {current.receiver && (
                  <span className="text-[10px] text-amber-400 font-mono">
                    Name: {current.receiver}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="font-mono text-xs text-white break-all select-all font-semibold">
                  {current.value}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(current.value, method)}
                  className="flex-shrink-0 p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  title="Copy"
                >
                  {copiedKey === method ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>

            {/* Optional Reference Input */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/50 font-mono mb-1">
                Transaction Reference / Receipt (Optional)
              </label>
              <input
                type="text"
                value={txRef}
                onChange={(e) => setTxRef(e.target.value)}
                placeholder="e.g. TX9847291 or Phone number"
                className="w-full px-3 py-1.5 text-xs bg-black/40 border border-white/10 rounded font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Permit Guarantee Note */}
          <div className="flex items-center gap-2 mt-4 px-1 text-white/40">
            <ShieldCheck size={13} className="text-emerald-400 flex-shrink-0" />
            <span className="text-[11px] font-sans">
              Instant token-based verification permits entry upon payment.
            </span>
          </div>

          {/* Action Button */}
          <div className="mt-5">
            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-white/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Confirm Payment & Permit Access</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
