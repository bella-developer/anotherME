import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Bookmark,
  Send,
  Eye,
  PenTool,
  Volume2,
  CheckCircle2,
  ArrowLeft,
  Image as ImageIcon,
  Compass,
} from 'lucide-react';
import Layout from '../components/Layout';
import ImageUpload from '../components/ImageUpload';
import { createPost } from '../services/postService';
import { fetchCircles } from '../services/circleService';
import { saveDraft, toggleSoundscape } from '../features/sanctuarySlice';
import { useToast } from '../contexts/ToastContext';

const ROOM_CONFIGS = {
  dark: {
    id: 'dark',
    name: 'Dark Room',
    tagline: 'Release. Witness. Discharge.',
    accent: '#397982',
    accentRGB: '57, 121, 130',
    categories: [
      { value: 'CONFESSION', label: 'Confession' },
      { value: 'REGRET', label: 'Regret' },
      { value: 'DARK', label: 'Dark Solitude' },
    ],
    prompts: [
      'What is a thought you keep buried beneath polite silence?',
      'Describe the weight of a moment that nobody else noticed.',
      'What truth about yourself are you finally ready to acknowledge in the quiet?',
      'Write to the person you were before the world taught you to guard your words.',
    ],
  },
  fantasy: {
    id: 'fantasy',
    name: 'Fantasy Room',
    tagline: 'Create. Imagine. Inspire.',
    accent: '#947044',
    accentRGB: '148, 112, 68',
    categories: [
      { value: 'CREATIVE', label: 'Creative Fiction' },
      { value: 'DAYDREAM', label: 'Daydream' },
      { value: 'FUNNY', label: 'Surreal Humor' },
      { value: 'FUTURISTIC', label: 'Futuristic Vision' },
    ],
    prompts: [
      'If time paused for one hour tonight, where would your mind wander?',
      'Describe a quiet bookstore that exists only between two ticks of a clock.',
      'What does your ideal solitary planet look like from space?',
      'Write the opening line of a forgotten folklore tale.',
    ],
  },
  philo: {
    id: 'philo',
    name: 'Philosophy Room',
    tagline: 'Understand. Reflect. Inquire.',
    accent: '#76517F',
    accentRGB: '118, 81, 127',
    categories: [
      { value: 'SPIRITUAL', label: 'Spiritual' },
      { value: 'SHADOW', label: 'Shadow Self' },
      { value: 'DEEP', label: 'Deep Inquiry' },
    ],
    prompts: [
      'Does solitude isolate us, or does it reconnect us to reality?',
      'What is an unspoken illusion that society has mutually agreed to uphold?',
      'Is peace something we find, or something we surrender to?',
      'If you could ask consciousness itself a single question, what would it be?',
    ],
  },
};

export default function SanctuaryPostStudio() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { isPlaying } = useSelector((state) => state.sanctuary);

  const [room, setRoom] = useState('dark');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(ROOM_CONFIGS.dark.categories[0].value);
  const [circleId, setCircleId] = useState('');
  const [image, setImage] = useState(null);

  const [circles, setCircles] = useState([]);
  const [loadingCircles, setLoadingCircles] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState(null);

  const currentConfig = ROOM_CONFIGS[room];

  // Fetch circles when room changes
  useEffect(() => {
    let mounted = true;
    const loadCircles = async () => {
      try {
        setLoadingCircles(true);
        const res = await fetchCircles({ room });
        if (mounted && res.circles) {
          setCircles(res.circles);
          if (res.circles.length > 0) {
            setCircleId(res.circles[0]._id || res.circles[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load circles for room', err);
      } finally {
        if (mounted) setLoadingCircles(false);
      }
    };
    loadCircles();
    return () => {
      mounted = false;
    };
  }, [room]);

  // Update default category when room changes
  const handleRoomChange = (newRoom) => {
    setRoom(newRoom);
    setCategory(ROOM_CONFIGS[newRoom].categories[0].value);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const trimmed = content.trim();
    const charCount = trimmed.length;
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const readTimeMin = Math.max(1, Math.ceil(words / 180));
    const isValidLength = charCount >= 10 && charCount <= 5000;
    return {
      charCount,
      words,
      readTimeMin,
      isValidLength,
    };
  }, [content]);

  // Autosave draft locally every 15s if content exists
  useEffect(() => {
    if (!content || content.length < 5) return;
    const timer = setTimeout(() => {
      dispatch(
        saveDraft({
          title,
          content,
          room,
          category,
        })
      );
      setLastAutoSave(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 15000);
    return () => clearTimeout(timer);
  }, [content, title, room, category, dispatch]);

  // Whisper Prompt Generator
  const handleWhisperPrompt = () => {
    const list = currentConfig.prompts;
    const randomPrompt = list[Math.floor(Math.random() * list.length)];
    if (!content) {
      setContent(randomPrompt + '\n\n');
    } else {
      setContent((prev) => prev + '\n\n' + randomPrompt + '\n\n');
    }
    addToast({
      type: 'info',
      title: 'Whisper Received',
      message: 'A contemplative thought has been placed in your canvas.',
    });
  };

  // Manual save draft to Sanctuary Vault
  const handleManualDraftSave = () => {
    if (!content.trim()) {
      addToast({
        type: 'warning',
        title: 'Empty Canvas',
        message: 'Write a few thoughts before saving a draft.',
      });
      return;
    }
    dispatch(
      saveDraft({
        title,
        content,
        room,
        category,
      })
    );
    setLastAutoSave(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    addToast({
      type: 'success',
      title: 'Draft Vaulted',
      message: 'Saved to your private Sanctuary Vault.',
    });
  };

  // Publish Post
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!metrics.isValidLength) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Post content must be between 10 and 5,000 characters.',
      });
      return;
    }
    if (!circleId) {
      addToast({
        type: 'error',
        title: 'Missing Circle',
        message: 'Please select a circle for your post.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const postPayload = {
        room,
        category,
        content,
        title: title.trim() || undefined,
        circleId,
        image: image || undefined,
      };

      const result = await createPost(postPayload);
      addToast({
        type: 'success',
        title: 'Released into Sanctuary',
        message: 'Your words now rest in the quiet collective.',
      });

      // Navigate to post or room
      const createdId = result.id || result._id;
      if (createdId) {
        navigate(`/posts/${createdId}`);
      } else {
        navigate(`/rooms/${room}`);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      addToast({
        type: 'error',
        title: 'Publish Failed',
        message: err.message || 'Unable to release your thought at this time.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout leftSidebar={null} rightSidebar={null}>
      <div
        className={`min-h-screen text-white transition-all duration-700 relative pb-20 ${
          zenMode ? 'pt-8' : 'pt-14 sm:pt-16'
        }`}
        style={{
          background: 'radial-gradient(ellipse at top, rgba(14, 15, 20, 1) 0%, rgba(6, 6, 8, 1) 100%)',
        }}
      >
        {/* Dynamic Room Aura Glow */}
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 -z-0 opacity-40"
          style={{
            backgroundColor: `rgba(${currentConfig.accentRGB}, 0.35)`,
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Top Bar Navigation */}
          {!zenMode && (
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50 hover:text-white transition-colors py-1 px-2.5 rounded-lg hover:bg-white/5"
              >
                <ArrowLeft size={14} />
                <span>Return</span>
              </button>

              {/* Room Selector Tabs */}
              <div
                className="inline-flex p-1 rounded-2xl border"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {Object.values(ROOM_CONFIGS).map((r) => {
                  const isActive = r.id === room;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRoomChange(r.id)}
                      className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                        isActive
                          ? 'shadow-md text-white font-semibold'
                          : 'text-white/50 hover:text-white/80'
                      }`}
                      style={{
                        backgroundColor: isActive ? r.accent : 'transparent',
                      }}
                    >
                      {r.name}
                    </button>
                  );
                })}
              </div>

              {/* Utility Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => dispatch(toggleSoundscape())}
                  className={`p-2 rounded-xl border transition-colors ${
                    isPlaying
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                      : 'border-white/10 text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                  title={isPlaying ? 'Pause soundscape' : 'Play ambient soundscape'}
                  aria-label="Toggle ambient soundscape"
                >
                  <Volume2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setZenMode(true)}
                  className="p-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                  title="Enter Zen Focus Mode"
                  aria-label="Enter Zen Focus Mode"
                >
                  <Maximize2 size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Zen Mode Exit Button */}
          {zenMode && (
            <div className="flex justify-between items-center mb-6">
              <span className="text-[11px] uppercase tracking-widest text-white/30">
                Zen Focus Sanctuary Active
              </span>
              <button
                onClick={() => setZenMode(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/70 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Minimize2 size={13} />
                <span>Exit Zen Mode</span>
              </button>
            </div>
          )}

          {/* Studio Canvas Card */}
          <div
            className="rounded-3xl border p-5 sm:p-8 shadow-2xl transition-all"
            style={{
              background: 'rgba(15, 16, 20, 0.75)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderColor: `rgba(${currentConfig.accentRGB}, 0.25)`,
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(${currentConfig.accentRGB}, 0.08)`,
            }}
          >
            {/* Header / Mode Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white/95">
                  Sanctuary Studio
                </h1>
                <p className="text-xs text-white/45 mt-0.5">
                  {currentConfig.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhisperPrompt}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 transition-colors"
                  title="Receive contemplation inspiration"
                >
                  <Sparkles size={13} />
                  <span>Whisper Prompt</span>
                </button>

                <div className="inline-flex p-0.5 rounded-xl bg-white/5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      !previewMode ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <PenTool size={12} />
                    <span>Write</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      previewMode ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <Eye size={12} />
                    <span>Contemplate</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Title Field */}
            <div className="py-4 border-b border-white/10">
              <input
                type="text"
                placeholder={room === 'dark' ? 'Title or unsaid whisper (optional)' : 'Give your thought a quiet title...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                className="w-full bg-transparent text-lg sm:text-xl font-semibold text-white/90 placeholder-white/20 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Canvas / Preview */}
            <div className="py-5 min-h-[280px]">
              {previewMode ? (
                <div className="prose prose-invert max-w-none min-h-[260px] p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="text-xs uppercase tracking-widest text-[#D97757] font-semibold mb-2">
                    {category} &bull; {currentConfig.name}
                  </div>
                  {title && <h2 className="text-xl font-bold text-white mb-4">{title}</h2>}
                  <div className="text-white/80 whitespace-pre-wrap leading-relaxed font-serif text-base">
                    {content || (
                      <span className="text-white/30 italic">
                        Your words will preview here once written...
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`What rests on your mind in the silence of the ${currentConfig.name}? Express without fear or pretense...`}
                  rows={10}
                  className="w-full bg-transparent text-white/85 placeholder-white/25 focus:outline-none resize-none leading-relaxed text-sm sm:text-base font-serif"
                  style={{
                    fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
                  }}
                />
              )}
            </div>

            {/* Category & Circle Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 pb-4 border-t border-white/10">
              {/* Category selector */}
              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-white/45 mb-2">
                  Category Aura
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {currentConfig.categories.map((c) => {
                    const isSelected = category === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCategory(c.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium tracking-wide transition-all border ${
                          isSelected
                            ? 'border-white/40 text-white bg-white/15 shadow-sm'
                            : 'border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5'
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Circle selector */}
              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-white/45 mb-2">
                  Destined Circle
                </label>
                {loadingCircles ? (
                  <div className="text-xs text-white/40 py-2">Loading circles...</div>
                ) : (
                  <select
                    value={circleId}
                    onChange={(e) => setCircleId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white/85 focus:outline-none focus:border-white/30 cursor-pointer"
                  >
                    {circles.map((c) => (
                      <option key={c._id || c.id} value={c._id || c.id} className="bg-neutral-900 text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Optional Image Upload */}
            <div className="pt-2 pb-4">
              <ImageUpload
                onImageSelect={(file) => setImage(file)}
                onImageRemove={() => setImage(null)}
                selectedImage={image}
              />
            </div>

            {/* Metrics & AutoSave Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 text-[11px] text-white/45">
              <div className="flex items-center gap-4">
                <span>{metrics.words} words</span>
                <span>{metrics.charCount} / 5000 characters</span>
                <span>~{metrics.readTimeMin} min read</span>
                {lastAutoSave && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400/80">
                    <CheckCircle2 size={12} />
                    <span>Autosaved at {lastAutoSave}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualDraftSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Bookmark size={13} />
                  <span>Save to Vault</span>
                </button>

                <button
                  type="button"
                  disabled={!metrics.isValidLength || isSubmitting}
                  onClick={handlePublish}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
                    metrics.isValidLength && !isSubmitting
                      ? 'text-white hover:opacity-90 active:scale-95'
                      : 'opacity-40 cursor-not-allowed bg-white/10 text-white/40'
                  }`}
                  style={{
                    backgroundColor: metrics.isValidLength ? currentConfig.accent : undefined,
                    boxShadow: metrics.isValidLength
                      ? `0 0 25px rgba(${currentConfig.accentRGB}, 0.5)`
                      : 'none',
                  }}
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Release Thought</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
