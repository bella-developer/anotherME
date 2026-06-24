import { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://anotherme-backend.onrender.com'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
          <p className="text-white/60 mb-6">
            If an account exists with {email}, you'll receive password reset instructions shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8 text-center">Reset Password</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        <p className="text-white/60 text-sm mb-6 text-center">
          Note: Password recovery requires an email on file.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-white/15 bg-white/5 rounded text-white placeholder-white/25 focus:outline-none focus:border-white/30"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-white/90 disabled:bg-white/20 disabled:cursor-not-allowed text-black font-medium rounded transition-colors"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
