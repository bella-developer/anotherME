import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Bookmark,
  Send,
  Eye,
  PenTool,
  Volume2,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';
import Layout from '../components/Layout';
import ImageUpload from '../components/ImageUpload';
import { createPost } from '../services/postService';
import { fetchCircles } from '../services/circleService';
import { saveDraft, toggleSoundscape } from '../features/sanctuarySlice';
import { useToast } from '../contexts/ToastContext';
import { usePageTitle } from '../hooks/usePageTitle';

const ROOM_CONFIGS = {
  dark: {
    id: 'dark',
    name: 'Dark Room',
    tagline: 'Release. Witness. Discharge.',
    accent: '#2EE6FF',
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
    accent: '#FF9D1C',
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
    accent: '#B56DFF',
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
  usePageTitle('Sanctuary Studio');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { isPlaying } = useSelector((state) => state.sanctuary);

  const [room, setRoom] = useState('dark');
  const [category, setCategory] = useState('CONFESSION');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [circleId, setCircleId] = useState('');
  const [circles, setCircles] = useState([]);
  const [loadingCircles, setLoadingCircles] = useState(false);

  const [activePrompt, setActivePrompt] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState(null);

  const currentConfig = ROOM_CONFIGS[room];

  // Fetch room circles
  useEffect(() => {
    let isMounted = true;
    async function loadCircles() {
      try {
        setLoadingCircles(true);
        const res = await fetchCircles({ room, limit: 50 });
        if (isMounted) {
          const list = res.circles || [];
          setCircles(list);
          if (list.length > 0) {
            setCircleId(list[0].id || list[0]._id);
          } else {
            setCircleId('');
          }
        }
      } catch (err) {
        console.error('Failed to load circles for room:', err);
      } finally {
        if (isMounted) setLoadingCircles(false);
      }
    }
    loadCircles();
    return () => {
      isMounted = false;
    };
  }, [room]);

  // Handle Room Change
  const handleRoomChange = (newRoom) => {
    setRoom(newRoom);
    const newConfig = ROOM_CONFIGS[newRoom];
    setCategory(newConfig.categories[0].value);
    setActivePrompt(null);
  };

  // Metrics
  const metrics = useMemo(() => {
    const trimmed = content.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = content.length;
    const readingTime = Math.max(1, Math.ceil(words / 180));
    return {
      words,
      chars,
      readingTime,
      isValidLength: chars >= 10 && chars <= 5000,
    };
  }, [content]);

  // Draft Auto-save timer
  useEffect(() => {
    if (!content.trim() || content.length < 20) return;
    const timer = setTimeout(() => {
      dispatch(
        saveDraft({
          title,
          content,
          room,
          category,
          circleId,
          image,
        })
      );
      setLastAutoSave(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    }, 12000);

    return () => clearTimeout(timer);
  }, [title, content, room, category, circleId, image, dispatch]);

  const handleWhisperPrompt = () => {
    const list = currentConfig.prompts;
    const random = list[Math.floor(Math.random() * list.length)];
    setActivePrompt(random);
  };

  const handleManualSaveDraft = () => {
    if (!content.trim()) {
      addToast('Cannot save an empty draft.', 'info');
      return;
    }
    dispatch(
      saveDraft({
        title,
        content,
        room,
        category,
        circleId,
        image,
      })
    );
    setLastAutoSave(
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
    addToast({
      type: 'success',
      title: 'Draft Vaulted',
      message: 'Saved to your private Sanctuary Vault.',
    });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!metrics.isValidLength) {
      addToast({
        type: 'error',
        title: 'Validation',
        message: 'Content must be between 10 and 5,000 characters.',
      });
      return;
    }
    if (!circleId) {
      addToast({
        type: 'error',
        title: 'Missing Circle',
        message: 'Please select a circle for your thought.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const postPayload = {
        title: title.trim() || undefined,
        content: content.trim(),
        room,
        category,
        circleId,
        image: image || undefined,
      };

      await createPost(postPayload);
      addToast({
        type: 'success',
        title: 'Released into Sanctuary',
        message: 'Your words now rest in the quiet collective.',
      });

      navigate(`/rooms/${room}`);
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
      <div className="bg-transparent text-white min-h-[calc(100vh-3rem)] pb-20 pt-2 sm:pt-4">
        {/* Centered Container matching App UI Philosophy */}
        <div className="max-w-2xl mx-auto px-3 sm:px-4">
          {/* Top Bar Navigation */}
          {!zenMode && (
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#21262d]">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#8b949e] hover:text-[#e6edf3] font-mono transition-colors"
              >
                <ArrowLeft size={13} />
                <span>Return</span>
              </button>

              {/* Room Selector Tabs - Minimal segmented control */}
              <div className="flex items-center border border-[#21262d] rounded p-0.5 bg-[rgba(255,255,255,0.02)]">
                {Object.values(ROOM_CONFIGS).map((r) => {
                  const isActive = r.id === room;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRoomChange(r.id)}
                      className={`px-2.5 sm:px-3 py-1 rounded text-xs font-mono transition-all ${
                        isActive
                          ? 'bg-[#21262d] text-[#e6edf3] font-medium'
                          : 'text-[#8b949e] hover:text-[#e6edf3]'
                      }`}
                    >
                      {r.name.replace(' Room', '')}
                    </button>
                  );
                })}
              </div>

              {/* Utilities */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => dispatch(toggleSoundscape())}
                  className={`p-1.5 rounded border transition-colors ${
                    isPlaying
                      ? 'border-[#2EE6FF]/50 text-[#2EE6FF] bg-[#2EE6FF]/10'
                      : 'border-[#21262d] text-[#6e7681] hover:text-[#e6edf3]'
                  }`}
                  title={isPlaying ? 'Pause soundscape' : 'Play ambient soundscape'}
                >
                  <Volume2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setZenMode(true)}
                  className="p-1.5 rounded border border-[#21262d] text-[#6e7681] hover:text-[#e6edf3] transition-colors"
                  title="Zen Focus Mode"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Zen Exit Trigger */}
          {zenMode && (
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#21262d]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6e7681] font-mono">
                Zen Mode Active
              </span>
              <button
                onClick={() => setZenMode(false)}
                className="flex items-center gap-1 text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] border border-[#21262d] px-2.5 py-1 rounded hover:border-[#30363d] transition-colors"
              >
                <Minimize2 size={12} />
                <span>Exit</span>
              </button>
            </div>
          )}

          {/* Studio Workspace Card - Transparent Dark Aesthetic */}
          <div
            className="rounded-lg border p-4 sm:p-6 transition-all"
            style={{
              background: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(12px)',
              borderColor: '#21262d',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.6)',
            }}
          >
            {/* Studio Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b949e] font-mono block">
                  Sanctuary Studio
                </span>
                <span className="text-xs text-[#6e7681] font-mono mt-0.5 block">
                  {currentConfig.tagline}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhisperPrompt}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] border border-[#21262d] hover:border-[#30363d] transition-colors"
                  title="Receive contemplation prompt"
                >
                  <Sparkles size={12} />
                  <span>Prompt</span>
                </button>

                <div className="flex border border-[#21262d] rounded p-0.5 bg-[rgba(255,255,255,0.02)]">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                      !previewMode ? 'bg-[#21262d] text-[#e6edf3]' : 'text-[#6e7681] hover:text-[#e6edf3]'
                    }`}
                  >
                    <PenTool size={11} />
                    <span>Write</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                      previewMode ? 'bg-[#21262d] text-[#e6edf3]' : 'text-[#6e7681] hover:text-[#e6edf3]'
                    }`}
                  >
                    <Eye size={11} />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Whisper Prompt Suggestion */}
            {activePrompt && (
              <div className="mt-3 p-2.5 rounded border border-[#21262d] bg-[rgba(255,255,255,0.02)] text-xs text-[#8b949e] font-mono flex items-start justify-between gap-2">
                <div className="italic leading-relaxed">
                  &ldquo;{activePrompt}&rdquo;
                </div>
                <button
                  onClick={() => setActivePrompt(null)}
                  className="text-[#6e7681] hover:text-[#e6edf3] text-xs font-mono ml-2 flex-shrink-0"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 pt-3 pb-2">
              {currentConfig.categories.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                    category === c.value
                      ? 'bg-[#21262d] text-[#e6edf3] border border-[#30363d]'
                      : 'text-[#6e7681] hover:text-[#e6edf3] border border-transparent'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Circle Selection */}
            <div className="py-2">
              <select
                value={circleId}
                onChange={(e) => setCircleId(e.target.value)}
                className="w-full px-3 py-1.5 rounded text-xs font-mono border transition-colors focus:outline-none"
                style={{
                  background: '#0a0a0a',
                  borderColor: '#21262d',
                  color: '#e6edf3',
                }}
              >
                {loadingCircles ? (
                  <option value="">Loading circles...</option>
                ) : circles.length === 0 ? (
                  <option value="">No circles available for this room</option>
                ) : (
                  circles.map((c) => (
                    <option key={c.id || c._id} value={c.id || c._id}>
                      Circle: {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Title Input */}
            <div className="py-2 border-b border-[#21262d]">
              <input
                type="text"
                placeholder={room === 'dark' ? 'Title or unsaid whisper (optional)' : 'Give your thought a quiet title...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                className="w-full bg-transparent text-sm sm:text-base font-mono text-[#e6edf3] placeholder-[#484f58] focus:outline-none"
              />
            </div>

            {/* Canvas / Preview */}
            <div className="py-3 min-h-[220px]">
              {previewMode ? (
                <div className="p-3 rounded bg-[rgba(255,255,255,0.01)] border border-[#21262d] min-h-[200px]">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#6e7681] font-mono mb-2">
                    {category} &bull; {currentConfig.name}
                  </div>
                  {title && (
                    <h3 className="text-base font-medium text-[#e6edf3] font-mono mb-3">
                      {title}
                    </h3>
                  )}
                  <div className="text-xs sm:text-sm text-[#c9d1d9] font-mono whitespace-pre-wrap leading-relaxed">
                    {content || (
                      <span className="text-[#484f58] italic">
                        Your words will preview here once written...
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="In the stillness of this sanctuary, write with honesty..."
                  rows={8}
                  className="w-full bg-transparent text-xs sm:text-sm font-mono text-[#e6edf3] placeholder-[#484f58] leading-relaxed resize-none focus:outline-none"
                />
              )}
            </div>

            {/* Optional Image Attachment */}
            {showImageUpload ? (
              <div className="py-3 border-t border-[#21262d]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#8b949e] font-mono">
                    Attachment
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setShowImageUpload(false);
                    }}
                    className="text-[11px] text-[#6e7681] hover:text-[#e6edf3] font-mono"
                  >
                    Remove
                  </button>
                </div>
                <ImageUpload onImageSelected={(img) => setImage(img)} />
              </div>
            ) : (
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setShowImageUpload(true)}
                  className="flex items-center gap-1.5 text-xs font-mono text-[#6e7681] hover:text-[#8b949e] transition-colors"
                >
                  <ImageIcon size={13} />
                  <span>Attach image (optional)</span>
                </button>
              </div>
            )}

            {/* Footer Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-[#21262d]">
              <div className="flex items-center gap-3 text-[11px] text-[#6e7681] font-mono">
                <span>{metrics.chars} / 5000 chars</span>
                <span>{metrics.words} words</span>
                {lastAutoSave && (
                  <span className="hidden sm:inline">
                    &bull; Saved {lastAutoSave}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualSaveDraft}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] border border-[#21262d] hover:border-[#30363d] transition-colors"
                >
                  <Bookmark size={12} />
                  <span>Vault Draft</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={!metrics.isValidLength || isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-mono font-medium uppercase tracking-wider text-black bg-[#e6edf3] hover:bg-white active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={12} />
                      <span>Release</span>
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
