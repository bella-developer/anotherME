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
      description: 'Keep it clean. This isn\'t the place for that.'
    },
    {
      number: '02',
      title: 'No Harassment',
      description: 'Treat others with respect. Threats, doxxing, or bullying gets you banned.'
    },
    {
      number: '03',
      title: 'No Self-Harm Promotion',
      description: 'Share your pain, not methods. We\'re here to support recovery, not encourage harm.'
    },
    {
      number: '04',
      title: 'No Politics',
      description: 'Save it for another platform. This space is for personal reflection, not debate.'
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
              className="mb-4 text-xs uppercase tracking-wider transition-colors flex items-center gap-2 px-3 py-1.5 rounded"
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
              className="text-xl sm:text-2xl font-bold mb-1"
              style={{ 
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Community Guidelines
            </h1>
            <p className="text-[10px] mb-6" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              Break these, you're out.
            </p>

            {/* Rules - Super Compact */}
            <div 
              className="p-5 mb-4 rounded-lg"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <div key={index}>
                    <div className="flex items-start gap-3">
                      {/* Number Circle - Small */}
                      <div className="flex-shrink-0">
                        <div 
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{
                            background: 'rgba(217, 119, 87, 0.15)',
                          }}
                        >
                          <span 
                            className="font-bold text-xs"
                            style={{ color: '#D97757' }}
                          >
                            {rule.number}
                          </span>
                        </div>
                      </div>

                      {/* Content - Compact */}
                      <div className="flex-1">
                        <h3 
                          className="text-sm font-bold mb-1"
                          style={{ 
                            color: '#ffffff',
                            fontFamily: 'var(--font-heading)'
                          }}
                        >
                          {rule.title}
                        </h3>
                        <p 
                          className="text-[11px] leading-relaxed"
                          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                        >
                          {rule.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Divider */}
                    {index < rules.length - 1 && (
                      <div 
                        className="mt-4 h-px"
                        style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer - Compact */}
              <div 
                className="mt-5 pt-5 text-center"
                style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
              >
                <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                  See something wrong? Report it.
                </p>
              </div>
            </div>

            {/* Crisis Help - Minimal */}
            <div 
              className="p-3 rounded-lg"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <p className="text-[10px] mb-2" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                In crisis? <span style={{ color: 'rgba(217, 119, 87, 0.8)' }}>Call 988 (US)</span> or <span style={{ color: 'rgba(217, 119, 87, 0.8)' }}>text HOME to 741741</span>
              </p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  export default Rules;
