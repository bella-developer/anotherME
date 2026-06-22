import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, selectAuth } from '../features/authSlice';
import IntrovertsBg from '../components/IntrovertsBg';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector(selectAuth);

  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated && !showSuccess) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate, showSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = {};
    
    if (name === 'password' && value) {
      if (value.length < 8) {
        errors.password = 'MINIMUM 8 CHARACTERS';
      } else if (!/[a-z]/.test(value)) {
        errors.password = 'INCLUDE LOWERCASE';
      } else if (!/[A-Z]/.test(value)) {
        errors.password = 'INCLUDE UPPERCASE';
      } else if (!/[0-9]/.test(value)) {
        errors.password = 'INCLUDE NUMBER';
      } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
        errors.password = 'INCLUDE SPECIAL CHARACTER';
      }
    }
    
    if (name === 'confirmPassword' && value && value !== formData.password) {
      errors.confirmPassword = 'PASSWORDS DO NOT MATCH';
    }
    
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.email = 'INVALID EMAIL FORMAT';
    }
    
    if (name === 'username' && value && value.length < 3) {
      errors.username = 'MINIMUM 3 CHARACTERS';
    }
    
    setValidationErrors((prev) => ({ ...prev, ...errors }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'INVALID EMAIL FORMAT';
    }
    
    if (!formData.password) {
      errors.password = 'PASSWORD REQUIRED';
    } else if (formData.password.length < 8) {
      errors.password = 'MINIMUM 8 CHARACTERS';
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = 'INCLUDE LOWERCASE';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'INCLUDE UPPERCASE';
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = 'INCLUDE NUMBER';
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) {
      errors.password = 'INCLUDE SPECIAL CHARACTER';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'PASSWORDS DO NOT MATCH';
    }
    
    if (formData.username && formData.username.length < 3) {
      errors.username = 'MINIMUM 3 CHARACTERS';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
    // Required fields
    if (!formData.password || !formData.confirmPassword) {
      return false;
    }
    
    // Passwords must match
    if (formData.password !== formData.confirmPassword) {
      return false;
    }
    
    // Password strength
    if (formData.password.length < 8) {
      return false;
    }
    if (!/[a-z]/.test(formData.password)) {
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      return false;
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) {
      return false;
    }
    
    // Username validation (if provided)
    if (formData.username && formData.username.length < 3) {
      return false;
    }
    
    // Email validation (if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const registrationData = { password: formData.password };
    if (formData.username && formData.username.trim()) {
      registrationData.username = formData.username.trim();
    }
    if (formData.email && formData.email.trim()) {
      registrationData.email = formData.email.trim();
    }
    if (formData.age) {
      const ageMap = { '18-24': 21, '25-34': 29, '35-44': 39, '45+': 50 };
      registrationData.age = ageMap[formData.age];
    }
    if (formData.gender) {
      registrationData.gender = formData.gender;
    }
    
    const result = await dispatch(register(registrationData));
    if (register.fulfilled.match(result)) {
      setShowSuccess(true);
      setTimeout(() => navigate('/home'), 3000);
    }
  };

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B5E59' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.75rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.25em 1.25em',
  };

  // Success screen
  if (showSuccess && user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-[#1A1412] border border-[#2d2420] rounded-lg p-10 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto mb-6 border-2 border-[#D9C5B2] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#D9C5B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-light tracking-[0.2em] text-[#E6D1BE] mb-2 uppercase">
                Account Created
              </h2>
              <p className="text-xs tracking-[0.15em] text-[#6B5E59] uppercase">Welcome to the platform</p>
            </div>
            <div className="bg-[#0d1117] border border-[#2d2420] rounded-lg p-6 mb-6">
              <p className="text-[0.65rem] tracking-[0.2em] text-[#6B5E59] uppercase mb-3">Your Username</p>
              <p className="text-3xl font-light tracking-[0.1em] text-[#D9C5B2] mb-2">{user.username}</p>
              <p className="text-[0.65rem] tracking-[0.15em] text-[#6B5E59]">This is your identity on the platform</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-[0.65rem] tracking-[0.2em] text-[#6B5E59] uppercase">
              <div className="w-1 h-1 bg-[#6B5E59] rounded-full animate-pulse" />
              <span>Redirecting</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <div className="relative z-10 w-full max-w-lg">

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.25em] text-white mb-3 uppercase">
            Register
          </h1>
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase">Create Your Account</p>
        </div>

        <div className="border border-white/15 rounded-lg p-8" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}>



          {error && (
            <div className="bg-[#220000] border border-[#4d0000] rounded p-4 mb-6">
              <p className="text-xs text-[#ff6b6b] tracking-wide uppercase font-semibold mb-2">
                {error.message || 'REGISTRATION FAILED'}
              </p>
              {error.details && Array.isArray(error.details) && (
                <ul className="text-xs text-[#ff8888] space-y-1 mt-2">
                  {error.details.map((detail, i) => (
                    <li key={i}>• {detail.field}: {detail.message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label htmlFor="username" className="block text-[0.7rem] tracking-[0.15em] text-white/55 mb-2 uppercase">
                Username <span className="text-white/30">(Optional)</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded text-white placeholder-white/25 focus:outline-none transition-colors text-sm tracking-wide ${validationErrors.username ? 'border border-red-500/50 bg-red-500/5' : 'border border-white/15 bg-white/5'}`}
                placeholder="auto-generated if empty"
                disabled={loading}
                aria-describedby={validationErrors.username ? 'username-error' : undefined}
              />
              {validationErrors.username && (
                <p id="username-error" className="text-[0.65rem] text-[#ff6b6b] mt-1 tracking-wider uppercase">{validationErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-[0.7rem] tracking-[0.15em] text-white/55 mb-2 uppercase">
                Email <span className="text-white/30">(Optional but recommended for recovery)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded text-white placeholder-white/25 focus:outline-none transition-colors text-sm tracking-wide ${validationErrors.email ? 'border border-red-500/50 bg-red-500/5' : 'border border-white/15 bg-white/5'}`}
                placeholder="your@email.com"
                disabled={loading}
                aria-describedby={validationErrors.email ? 'email-error' : undefined}
              />
              {validationErrors.email && (
                <p id="email-error" className="text-[0.65rem] text-[#ff6b6b] mt-1 tracking-wider uppercase">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-[0.7rem] tracking-[0.15em] text-white/55 mb-2 uppercase">
                Password <span className="text-white/70">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pr-12 rounded text-white placeholder-white/25 focus:outline-none transition-colors text-sm tracking-wide ${validationErrors.password ? 'border border-red-500/50 bg-red-500/5' : 'border border-white/15 bg-white/5'}`}
                  placeholder="secure password required"
                  disabled={loading}
                  aria-describedby={validationErrors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.password ? (
                <p id="password-error" className="text-[0.65rem] text-red-400 mt-1 tracking-wider uppercase">{validationErrors.password}</p>
              ) : (
                <p className="text-[0.65rem] text-white/30 mt-1 tracking-wide uppercase">
                  8+ chars · uppercase · lowercase · number · special
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-[0.7rem] tracking-[0.15em] text-white/55 mb-2 uppercase">
                Confirm Password <span className="text-white/70">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded text-white placeholder-white/25 focus:outline-none transition-colors text-sm tracking-wide ${validationErrors.confirmPassword ? 'border border-red-500/50 bg-red-500/5' : 'border border-white/15 bg-white/5'}`}
                placeholder="re-enter password"
                disabled={loading}
                aria-describedby={validationErrors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              {validationErrors.confirmPassword && (
                <p id="confirm-password-error" className="text-[0.65rem] text-[#ff6b6b] mt-1 tracking-wider uppercase">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="age" className="block text-[0.7rem] tracking-[0.15em] text-white/55 mb-2 uppercase">Age Range</label>
                <select id="age" name="age" value={formData.age} onChange={handleChange} disabled={loading} style={selectStyle}
                  className="w-full px-4 py-3 border border-white/15 bg-white/5 rounded text-white focus:outline-none focus:border-white/30 transition-colors text-sm appearance-none cursor-pointer">
                  <option value="" className="bg-neutral-900">—</option>
                  <option value="18-24" className="bg-neutral-900">18-24</option>
                  <option value="25-34" className="bg-neutral-900">25-34</option>
                  <option value="35-44" className="bg-neutral-900">35-44</option>
                  <option value="45+" className="bg-neutral-900">45+</option>
                </select>
              </div>
              <div>
                <label htmlFor="gender" className="block text-[0.7rem] tracking-[0.15em] text-white/55 mb-2 uppercase">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} disabled={loading} style={selectStyle}
                  className="w-full px-4 py-3 border border-white/15 bg-white/5 rounded text-white focus:outline-none focus:border-white/30 transition-colors text-sm appearance-none cursor-pointer">
                  <option value="" className="bg-neutral-900">—</option>
                  <option value="male" className="bg-neutral-900">Male</option>
                  <option value="female" className="bg-neutral-900">Female</option>
                  <option value="other" className="bg-neutral-900">Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className="w-full py-3.5 bg-white hover:bg-white/90 disabled:bg-white/20 disabled:cursor-not-allowed text-black font-medium rounded transition-colors text-sm tracking-[0.15em] uppercase"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-white/45 tracking-wide">
              Already have an account?{' '}
              <Link to="/login" className="text-white/80 hover:text-white transition-colors uppercase tracking-wider">
                Sign In
              </Link>
            </p>
          </div>
        </div>



      </div>
    </div>
  );
}

export default Register;
