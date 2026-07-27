import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';
import { usePageTitle } from '../hooks/usePageTitle';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';

function Terms() {
  usePageTitle('Terms');
  
  const terms = [
    {
      title: 'Acceptance of Terms',
      content: 'By using ESO, you agree to these terms. If you don\'t agree, please don\'t use the platform.'
    },
    {
      title: 'Community Guidelines',
      content: 'ESO is for deep thinkers. Harassment, spam, or disruptive content is prohibited.'
    },
    {
      title: 'Content Ownership',
      content: 'You own your posts. By posting, you grant ESO license to display your content within the platform.'
    },
    {
      title: 'Account Termination',
      content: 'We reserve the right to terminate accounts that violate these terms or disrupt the community.'
    },
    {
      title: 'Platform Availability',
      content: 'ESO is provided \'as is\' without warranty. We don\'t guarantee error-free or continuous availability.'
    },
    {
      title: 'Changes to Terms',
      content: 'We may update these terms. Continued use after changes constitutes acceptance.'
    }
  ];

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="min-h-screen relative" style={{ fontFamily: 'var(--font-body)' }}>
          {/* Background atmospheric effect */}
          <div 
            className="fixed inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 20%, rgba(167, 139, 250, 0.03) 0%, transparent 60%)',
              zIndex: 1,
            }}
          />

          {/* Content */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 relative z-10">
            {/* Header - Compact */}
            <Link
              to="/"
              className="mb-6 text-xs uppercase tracking-wider transition-colors flex items-center gap-2 px-3 py-1.5 rounded inline-flex"
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
            </Link>

            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <EsoLogo className="h-12 w-auto mx-auto" />
              </div>
              <h1 
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ 
                  color: '#ffffff',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.08em'
                }}
              >
                Terms of Service
              </h1>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Platform Guidelines
              </p>
            </div>

            {/* Terms Sections - Compact Single Panel */}
            <div 
              className="p-6 mb-6 rounded-lg"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="space-y-6">
                {terms.map((term, index) => (
                  <div key={index}>
                    <h2 
                      className="text-base font-bold mb-2"
                      style={{ 
                        color: '#ffffff',
                        fontFamily: 'var(--font-heading)'
                      }}
                    >
                      {term.title}
                    </h2>
                    <p 
                      className="text-xs leading-relaxed"
                      style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {term.content}
                    </p>
                    
                    {/* Divider between sections (except last one) */}
                    {index < terms.length - 1 && (
                      <div 
                        className="mt-6 h-px"
                        style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                      />
                    )}
                  </div>
                ))}

                {/* Contact Section inside panel - Compact */}
                <div 
                  className="mt-6 pt-6 text-center"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <h2 
                    className="text-sm font-bold mb-2"
                    style={{ 
                      color: '#ffffff',
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    Legal Questions?
                  </h2>
                  <a 
                    href="mailto:legal@eso.app" 
                    className="text-xs transition-colors"
                    style={{ color: 'rgba(167, 139, 250, 0.8)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(167, 139, 250, 1)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(167, 139, 250, 0.8)'}
                  >
                    legal@eso.app
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </PageTransition>
  );
}

export default Terms;
