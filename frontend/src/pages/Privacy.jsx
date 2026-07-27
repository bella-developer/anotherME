import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';
import { usePageTitle } from '../hooks/usePageTitle';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';

function Privacy() {
  usePageTitle('Privacy');
  const sections = [
    {
      id: 'data',
      title: 'Data We Collect',
      content: 'Username, password (encrypted), optional age & gender. No email required for basic accounts.'
    },
    {
      id: 'usage',
      title: 'How It\'s Used',
      content: 'Authentication, profile display, and community interactions only.'
    },
    {
      id: 'security',
      title: 'Security',
      content: 'Industry-standard encryption. Your data stays within ESO\'s infrastructure.'
    },
    {
      id: 'rights',
      title: 'Your Rights',
      content: 'Access, modify, or delete your data anytime. GDPR & CCPA compliant.'
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
                Privacy Policy
              </h1>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                How We Protect Your Data
              </p>
            </div>

            {/* Content Sections - Compact Single Panel */}
            <div 
              className="p-6 mb-6 rounded-lg"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <div key={section.id}>
                    <h2 
                      className="text-base font-bold mb-2"
                      style={{ 
                        color: '#ffffff',
                        fontFamily: 'var(--font-heading)'
                      }}
                    >
                      {section.title}
                    </h2>
                    <p 
                      className="text-xs leading-relaxed"
                      style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {section.content}
                    </p>
                    
                    {/* Divider between sections (except last one) */}
                    {index < sections.length - 1 && (
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
                    Questions?
                  </h2>
                  <a 
                    href="mailto:privacy@eso.app" 
                    className="text-xs transition-colors"
                    style={{ color: 'rgba(167, 139, 250, 0.8)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(167, 139, 250, 1)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(167, 139, 250, 0.8)'}
                  >
                    privacy@eso.app
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

export default Privacy;
