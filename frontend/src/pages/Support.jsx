import { useState, useEffect } from 'react';
import { Book, Video, FileText, Heart, Users, Mail, CheckCircle, Play } from 'lucide-react';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import VideoModal from '../components/VideoModal';
import ArticleModal from '../components/ArticleModal';
import { usePageTitle } from '../hooks/usePageTitle';

const Support = () => {
  usePageTitle('Support');
  const [activeTab, setActiveTab] = useState('library');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [resources, setResources] = useState({
    books: [],
    videos: [],
    articles: [],
    therapists: [],
    peerSupport: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/support/resources`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const grouped = {
          books: data.data.filter(r => r.type === 'book'),
          videos: data.data.filter(r => r.type === 'video'),
          articles: data.data.filter(r => r.type === 'article'),
          therapists: data.data.filter(r => r.type === 'therapist'),
          peerSupport: data.data.filter(r => r.type === 'peer-support')
        };
        setResources(grouped);
      }
    } catch (error) {
      console.error('Error fetching support resources:', error);
      // Fallback to static data if API fails
      setResources(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const fallbackData = {
    books: [
      {
        title: "Quiet: The Power of Introverts in a World That Can't Stop Talking",
        author: "Susan Cain",
        category: "Understanding Introversion",
        description: "A groundbreaking exploration of introversion and its strengths in an extroverted world.",
        link: "https://www.goodreads.com/book/show/8520610-quiet"
      },
      {
        title: "The Highly Sensitive Person",
        author: "Elaine N. Aron",
        category: "Self-Understanding",
        description: "Understanding and thriving as a highly sensitive person.",
        link: "https://www.goodreads.com/book/show/337467.The_Highly_Sensitive_Person"
      },
      {
        title: "Man's Search for Meaning",
        author: "Viktor E. Frankl",
        category: "Philosophy & Meaning",
        description: "Finding purpose and meaning even in the darkest circumstances.",
        link: "https://www.goodreads.com/book/show/4069.Man_s_Search_for_Meaning"
      },
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        category: "Fiction for Deep Thinkers",
        description: "A novel about infinite possibilities and finding meaning in life.",
        link: "https://www.goodreads.com/book/show/52578297-the-midnight-library"
      },
      {
        title: "Solitude: A Return to the Self",
        author: "Anthony Storr",
        category: "Philosophy of Solitude",
        description: "An exploration of the importance and creativity found in solitude.",
        link: "https://www.goodreads.com/book/show/251780.Solitude"
      }
    ],
    videos: [
      {
        title: "The Power of Introverts",
        creator: "Susan Cain | TED",
        category: "Understanding Introversion",
        description: "In a world that celebrates extroverts, Susan Cain makes a case for the quiet and contemplative.",
        link: "https://www.youtube.com/watch?v=c0KYU2j0TM4",
        videoId: "c0KYU2j0TM4",
        duration: "19 min"
      },
      {
        title: "Self-Love is the Best Love",
        creator: "Jay Shetty",
        category: "Self-Love",
        description: "How to truly love yourself and build unshakeable self-worth from within.",
        link: "https://www.youtube.com/watch?v=LgC1x4hsPbk",
        videoId: "LgC1x4hsPbk",
        duration: "8 min"
      },
      {
        title: "Are We Living in a Simulation?",
        creator: "Kurzgesagt",
        category: "Reality & Philosophy",
        description: "Exploring the simulation hypothesis and what it means for our existence.",
        link: "https://www.youtube.com/watch?v=tlTKTTt47WE",
        videoId: "tlTKTTt47WE",
        duration: "8 min"
      },
      {
        title: "Life as a Game: Alan Watts",
        creator: "After Skool",
        category: "Reality & Philosophy",
        description: "Alan Watts explains how viewing life as a game can transform your experience.",
        link: "https://www.youtube.com/watch?v=3VuSSJXbKXc",
        videoId: "3VuSSJXbKXc",
        duration: "10 min"
      }
    ],
    articles: [
      {
        title: "Self-Love: What It Is and What It Isn't",
        source: "Psychology Today",
        category: "Self-Love",
        description: "A comprehensive guide to understanding true self-love beyond Instagram mantras.",
        link: "https://www.psychologytoday.com/us/blog/the-moment-youth/201808/what-self-love-is-and-what-it-isnt"
      },
      {
        title: "Living in a Simulation",
        source: "Scientific American",
        category: "Reality & Philosophy",
        description: "Scientists weigh in on whether we could be living in a computer simulation.",
        link: "https://www.scientificamerican.com/article/do-we-live-in-a-simulation-chances-are-about-50-50/"
      },
      {
        title: "The Philosophy of Solitude",
        source: "Aeon",
        category: "Introvert Life",
        description: "Why being alone is not the same as being lonely, and why solitude matters.",
        link: "https://aeon.co/essays/what-we-can-learn-from-the-philosophy-of-solitude"
      },
      {
        title: "Reality as a Game",
        source: "Medium",
        category: "Reality & Philosophy",
        description: "Exploring the metaphor of life as a game and how it changes your perspective.",
        link: "https://medium.com/the-mission/life-is-a-game-this-is-your-strategy-guide-b5a0d5c0c04b"
      }
    ],
    therapists: [
      {
        name: "Elijah",
        title: "Licensed Professional Therapist",
        professionalType: "Licensed Therapist (LMFT)",
        description: "Specializing in introversion, social anxiety, existential concerns, and identity exploration. Provides a safe, non-judgmental space for deep thinkers and quiet souls.",
        link: "mailto:support@eso.app",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        specialties: ["Social Anxiety", "Depression", "Identity Issues", "Existential Concerns", "Introversion"],
        availability: "Monday-Friday, 9AM-6PM",
        bio: "With over 10 years of experience, Elijah understands the unique challenges faced by introverts and deep thinkers in an extroverted world.",
        verified: true
      }
    ],
    peerSupport: [
      {
        name: "Ruhama",
        role: "Verified Peer Support",
        description: "A fellow introvert who has walked through darkness and found her way to self-acceptance. Available for peer support conversations about loneliness, self-love, and finding your place.",
        link: "mailto:support@eso.app",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        specialties: ["Loneliness", "Self-Love Journey", "Introvert Struggles", "Finding Community"],
        availability: "Flexible, volunteer basis",
        bio: "Ruhama is a verified community member who volunteers her time to support others on their journey. She's not a therapist, but a compassionate listener who understands.",
        verified: true
      }
    ]
  };

  const crisisResources = [
    {
      name: "988 Suicide & Crisis Lifeline",
      contact: "Call or text 988",
      availability: "24/7"
    },
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      availability: "24/7"
    }
  ];

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="min-h-screen bg-transparent text-white relative z-10">
          {/* Header */}
          <div className="max-w-3xl mx-auto px-6 py-12 text-center relative z-20">
            <h1 className="text-4xl font-bold text-white mb-4">
              Support & Resources
            </h1>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">
              Curated resources for introverts, deep thinkers, and quiet souls
            </p>
          </div>

        {/* Navigation Tabs */}
        <div className="max-w-3xl mx-auto px-6 mb-8 relative z-20">
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { id: 'library', icon: Book, label: 'Books' },
              { id: 'videos', icon: Video, label: 'Videos' },
              { id: 'articles', icon: FileText, label: 'Articles' },
              { id: 'professional', icon: Heart, label: 'Therapy' },
              { id: 'peer', icon: Users, label: 'Peer Support' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
                style={activeTab === tab.id ? {
                  background: 'transparent',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.2)',
                } : {}}
              >
                <tab.icon size={14} strokeWidth={2} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 pb-16 relative z-20">
          {loading ? (
            <div className="text-center text-gray-500 py-12">Loading resources...</div>
          ) : (
            <>
              {/* Books Tab */}
              {activeTab === 'library' && (
                <div className="space-y-4">
                  {resources.books.map((book, index) => (
                    <a
                      key={index}
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block rounded-xl p-5 transition-all duration-500 hover:-translate-y-1"
                      style={{
                        background: 'transparent',
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
                      }}
                    >
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05)' }} />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            {book.category}
                          </span>
                          <Book size={14} className="text-gray-600 group-hover:text-white/70 transition-colors" strokeWidth={2} />
                        </div>
                        
                        <h3 className="text-base font-semibold text-white mb-1 group-hover:text-white/90 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">by {book.author}</p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {book.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Videos Tab */}
              {activeTab === 'videos' && (
                <div className="space-y-4">
                  {resources.videos.map((video, index) => {
                    const thumbnailUrl = video.videoId 
                      ? `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`
                      : null;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedVideo(video)}
                        className="group relative block rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 w-full text-left"
                        style={{
                          background: 'transparent',
                          boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
                        }}
                      >
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05)' }} />
                        
                        <div className="relative z-10 flex gap-4 p-5">
                          {/* Video Thumbnail */}
                          {thumbnailUrl && (
                            <div className="flex-shrink-0 relative">
                              <div 
                                className="w-40 h-24 rounded-lg bg-gray-800 bg-cover bg-center relative overflow-hidden"
                                style={{ backgroundImage: `url(${thumbnailUrl})` }}
                              >
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                                    <Play size={20} className="text-white ml-1" fill="white" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                  {video.category}
                                </span>
                                <span className="text-[10px] text-gray-600">• {video.duration}</span>
                              </div>
                              <Video size={14} className="text-gray-600 group-hover:text-white/70 transition-colors" strokeWidth={2} />
                            </div>
                            
                            <h3 className="text-base font-semibold text-white mb-1 group-hover:text-white/90 transition-colors">
                              {video.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">{video.creator}</p>
                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                              {video.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Articles Tab */}
              {activeTab === 'articles' && (
                <div className="space-y-4">
                  {resources.articles.map((article, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedArticle(article)}
                      className="group relative block rounded-xl p-5 transition-all duration-500 hover:-translate-y-1 w-full text-left"
                      style={{
                        background: 'transparent',
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
                      }}
                    >
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05)' }} />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            {article.category}
                          </span>
                          <FileText size={14} className="text-gray-600 group-hover:text-white/70 transition-colors" strokeWidth={2} />
                        </div>
                        
                        <h3 className="text-base font-semibold text-white mb-1 group-hover:text-white/90 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">{article.source}</p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {article.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Professional Support Tab */}
              {activeTab === 'professional' && (
                <div className="space-y-4">
                  {resources.therapists.map((therapist, index) => (
                    <a
                      key={index}
                      href={therapist.link}
                      className="group relative block rounded-xl p-6 transition-all duration-500 hover:-translate-y-1"
                      style={{
                        background: 'transparent',
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.15)',
                      }}
                    >
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05)' }} />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {/* Profile Image */}
                            {therapist.imageUrl && (
                              <div 
                                className="w-12 h-12 rounded-full bg-gray-700 bg-cover bg-center flex-shrink-0"
                                style={{ 
                                  backgroundImage: `url(${therapist.imageUrl})`,
                                  boxShadow: '0 0 0 2px rgba(255,255,255,0.1)'
                                }}
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-white">{therapist.name}</h3>
                                {therapist.verified && (
                                  <CheckCircle size={16} className="text-blue-400" strokeWidth={2} />
                                )}
                              </div>
                              <p className="text-xs text-gray-400 font-medium">{therapist.professionalType}</p>
                            </div>
                          </div>
                          <Mail size={18} className="text-gray-600 group-hover:text-white/70 transition-colors" strokeWidth={2} />
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                          {therapist.description}
                        </p>
                        
                        <p className="text-xs text-gray-500 mb-3">{therapist.bio}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {therapist.specialties.map((specialty, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-1 text-gray-400 rounded-md"
                              style={{
                                background: 'rgba(255,255,255,0.05)',
                                boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
                              }}
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                        
                        <p className="text-[10px] text-gray-600">Available: {therapist.availability}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Peer Support Tab */}
              {activeTab === 'peer' && (
                <div className="space-y-4">
                  {resources.peerSupport.map((peer, index) => (
                    <a
                      key={index}
                      href={peer.link}
                      className="group relative block rounded-xl p-6 transition-all duration-500 hover:-translate-y-1"
                      style={{
                        background: 'transparent',
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.15)',
                      }}
                    >
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05)' }} />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {/* Profile Image */}
                            {peer.imageUrl && (
                              <div 
                                className="w-12 h-12 rounded-full bg-gray-700 bg-cover bg-center flex-shrink-0"
                                style={{ 
                                  backgroundImage: `url(${peer.imageUrl})`,
                                  boxShadow: '0 0 0 2px rgba(255,255,255,0.1)'
                                }}
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-white">{peer.name}</h3>
                                {peer.verified && (
                                  <CheckCircle size={16} className="text-purple-400" strokeWidth={2} />
                                )}
                              </div>
                              <p className="text-xs text-gray-400 font-medium">{peer.role}</p>
                            </div>
                          </div>
                          <Mail size={18} className="text-gray-600 group-hover:text-white/70 transition-colors" strokeWidth={2} />
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                          {peer.description}
                        </p>
                        
                        <p className="text-xs text-gray-500 mb-3">{peer.bio}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {peer.specialties.map((specialty, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-1 text-gray-400 rounded-md"
                              style={{
                                background: 'rgba(255,255,255,0.05)',
                                boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
                              }}
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                        
                        <p className="text-[10px] text-gray-600">Available: {peer.availability}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-20" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="max-w-3xl mx-auto px-6 py-6 text-center">
            <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase">
              © 2026 ESO
            </p>
          </div>
        </div>

        {/* Modals */}
        {selectedVideo && (
          <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
        {selectedArticle && (
          <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
        )}
      </div>
      </Layout>
    </PageTransition>
  );
};

export default Support;
