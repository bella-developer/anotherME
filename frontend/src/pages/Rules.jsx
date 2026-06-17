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
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => navigate(-1)}
              className="text-[#918A87] hover:text-white transition-colors text-sm mb-4 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">Community Guidelines</h1>
            <p className="text-[#918A87] text-sm">
              These rules exist to protect this space and everyone in it.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Warning Banner */}
          <div className="p-6 mb-8">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h2 className="text-[#D97757] font-bold text-lg mb-2">Important Notice</h2>
                <p className="text-[#D1D1D1] leading-relaxed">
                  Violations of these rules may result in content removal, temporary suspension, or permanent ban. 
                  We take the safety and well-being of our community seriously.
                </p>
              </div>
            </div>
          </div>

          {/* Single Panel with All Rules */}
          <div className="p-8 mb-8">
            <div className="space-y-8">
              {rules.map((rule, index) => (
                <div key={index}>
                  <div className="flex items-start gap-6">
                    {/* Number Circle */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#D97757]/20 flex items-center justify-center">
                        <span className="text-[#D97757] font-bold text-lg">{rule.number}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">{rule.icon}</span>
                        <h3 className="text-xl font-bold text-white">{rule.title}</h3>
                      </div>
                      <p className="text-[#D1D1D1] leading-relaxed text-sm">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Spacer between rules (except last one) */}
                  {index < rules.length - 1 && (
                    <div className="mt-8"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer inside panel */}
            <div className="mt-8 pt-8 text-center">
              <p className="text-[#918A87] text-sm leading-relaxed">
                This is a safe space for vulnerability, growth, and human connection. 
                By participating, you agree to uphold these guidelines and help maintain 
                a supportive environment for all.
              </p>
              <p className="text-[#6B5E59] text-xs mt-4">
                If you witness a violation, please report it to the circle moderators.
              </p>
            </div>
          </div>

          {/* Crisis Resources */}
          <div className="p-6">
            <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
              <span>🆘</span>
              Need Immediate Help?
            </h3>
            <p className="text-[#D1D1D1] mb-3 leading-relaxed text-sm">
              If you're in crisis or experiencing thoughts of self-harm, please reach out to professional resources:
            </p>
            <ul className="space-y-2 text-[#918A87] text-xs">
              <li className="flex items-center gap-2">
                <span className="text-[#D97757]">•</span>
                National Suicide Prevention Lifeline: 988 (US)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D97757]">•</span>
                Crisis Text Line: Text HOME to 741741
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D97757]">•</span>
                International Association for Suicide Prevention: iasp.info
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Rules;
