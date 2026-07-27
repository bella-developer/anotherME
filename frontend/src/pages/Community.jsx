import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Layout from '../components/Layout';
import { usePageTitle } from '../hooks/usePageTitle';
import { FaTelegram, FaTwitter, FaLinkedin, FaYoutube, FaDiscord } from 'react-icons/fa';

function Community() {
  usePageTitle('Community');

  const socialLinks = [
    {
      name: 'Telegram',
      icon: FaTelegram,
      url: 'https://t.me/hesed_perspectives',
      color: '#0088cc',
      description: 'Join our active community',
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      url: 'https://twitter.com/eso_app',
      color: '#1DA1F2',
      description: 'Follow for updates',
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://linkedin.com/company/eso-app',
      color: '#0077B5',
      description: 'Professional network',
    },
    {
      name: 'YouTube',
      icon: FaYoutube,
      url: 'https://youtube.com/@eso-app',
      color: '#FF0000',
      description: 'Watch our content',
    },
    {
      name: 'Discord',
      icon: FaDiscord,
      url: 'https://discord.gg/eso-app',
      color: '#5865F2',
      description: 'Chat with the team',
    },
  ];

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-px mx-auto mb-6 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <h1 className="text-4xl font-light tracking-[0.15em] text-white uppercase mb-4">
              Community
            </h1>
            <p className="text-sm text-white/40 tracking-wide max-w-xl mx-auto">
              Connect with us across platforms. Join the conversation wherever you feel most comfortable.
            </p>
          </motion.div>

          {/* Social Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${link.color}55`;
                    e.currentTarget.style.background = `${link.color}0D`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${link.color}15`,
                      border: `1px solid ${link.color}33`,
                    }}
                  >
                    <Icon
                      className="transition-colors duration-300"
                      style={{ color: link.color }}
                      size={24}
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-medium tracking-wide text-white mb-2">
                    {link.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-white/40 mb-3">
                    {link.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase transition-all duration-300 group-hover:translate-x-1" style={{ color: link.color }}>
                    Visit
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>

                  {/* Hover glow effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${link.color}05 0%, transparent 70%)`,
                    }}
                  />
                </motion.a>
              );
            })}
          </div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12 pt-8 border-t border-white/5"
          >
            <p className="text-xs text-white/30 tracking-wide">
              Have questions? Reach out to us at{' '}
              <a
                href="mailto:hello@eso.app"
                className="text-white/50 hover:text-white/80 transition-colors underline"
              >
                hello@eso.app
              </a>
            </p>
          </motion.div>
        </div>
      </Layout>
    </PageTransition>
  );
}

export default Community;
