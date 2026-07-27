import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

/**
 * Rules Page
 * Displays community guidelines with a cautious, serious tone
 */
function Rules() {
  const navigate = useNavigate();

  const rules = [
    {
      number: '01',
      title: 'No Sexual Content',
      description: 'This is a space for emotional support and growth, not for sexual content or advances. Any sexually explicit material or behavior will result in immediate removal.',
      icon: '⚠️'
    },
    {
      number: '02',
      title: 'No Harassment or Violation',
      description: 'Respect is non-negotiable. Harassment, threats, doxxing, or any form of violation against others will not be tolerated. We protect the safety of all souls here.',
      icon: '🛡️'
    },
    {
      number: '03',
      title: 'No Self-Harm Promotion',
      description: 'While we welcome vulnerability and pain, we do not allow content that promotes, encourages, or glorifies self-harm or suicide. If you\'re struggling, we encourage seeking professional help.',
      icon: '💔'
    },
    {
      number: '04',
      title: 'No Political Content',
      description: 'This space is for personal reflection and human connection, not political debate. Keep discussions focused on individual experiences rather than political ideologies.',
      icon: '🚫'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white relative" style={{ fontFamily: 'var(--font-body)' }}>
        {/* Background atmospheric effect */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(217, 119, 87, 0.03) 0%, transparent 60%)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 relative z-10">
            {/* Header - Compact */}
            <button
              onClick={() => navigate(-1)}
              className="mb-6 text-xs uppercase tracking-wider transition-colors flex items-center gap-2 px-3 py-1.5 rounded"
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <h1 
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ 
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.02em'
              }}
            >
              Community Guidelines
            </h1>
            <p className="text-xs sm:text-sm mb-8" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              These rules exist to protect this space and everyone in it.
            </p>

            {/* Warning Banner - Compact */}
            <div 
              className="p-4 mb-6 rounded-lg"
              style={{
                background: 'rgba(217, 119, 87, 0.08)',
                border: '1px solid rgba(217, 119, 87, 0.2)',
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <h2 
                    className="font-bold text-sm mb-1"
                    style={{ 
                      color: '#D97757',
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    Important Notice
                  </h2>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Violations may result in content removal, suspension, or permanent ban. 
                    We take community safety seriously.
                  </p>
                </div>
              </div>
            </div>

            {/* Rules - Compact Single Panel */}
            <div 
              className="p-6 mb-6 rounded-lg"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="space-y-6">
                {rules.map((rule, index) => (
                  <div key={index}>
                    <div className="flex items-start gap-4">
                      {/* Number Circle - Smaller */}
                      <div className="flex-shrink-0">
                        <div 
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{
                            background: 'rgba(217, 119, 87, 0.15)',
                          }}
                        >
                          <span 
                            className="font-bold text-sm"
                            style={{ color: '#D97757' }}
                          >
                            {rule.number}
                          </span>
                        </div>
                      </div>

                      {/* Content - Compact */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-base">{rule.icon}</span>
                          <h3 
                            className="text-base font-bold"
                            style={{ 
                              color: '#ffffff',
                              fontFamily: 'var(--font-heading)'
                            }}
                          >
                            {rule.title}
                          </h3>
                        </div>
                        <p 
                          className="text-xs leading-relaxed"
                          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {rule.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Divider between rules (except last one) */}
                    {index < rules.length - 1 && (
                      <div 
                        className="mt-6 h-px"
                        style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer inside panel - Compact */}
              <div 
                className="mt-6 pt-6 text-center"
                style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
              >
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  This is a safe space for vulnerability, growth, and human connection. 
                  By participating, you agree to uphold these guidelines.
                </p>
                <p className="text-[10px] mt-2" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                  If you witness a violation, please report it to the circle moderators.
                </p>
              </div>
            </div>

            {/* Crisis Resources - Compact */}
            <div 
              className="p-4 rounded-lg"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <h3 
                className="font-bold text-sm mb-2 flex items-center gap-2"
                style={{ 
                  color: '#ffffff',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                <span>🆘</span>
                Need Immediate Help?
              </h3>
              <p className="text-xs mb-3 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                If you're in crisis, please reach out to professional resources:
              </p>
              <ul className="space-y-1.5 text-[10px]" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#D97757' }}>•</span>
                  National Suicide Prevention Lifeline: 988 (US)
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#D97757' }}>•</span>
                  Crisis Text Line: Text HOME to 741741
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#D97757' }}>•</span>
                  International Association for Suicide Prevention: iasp.info
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Rules;
