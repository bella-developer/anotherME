import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Bookmark,
  Send,
  Eye,
  PenTool,
  ArrowLeft,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import Layout from '../components/Layout';
import ImageUpload from '../components/ImageUpload';
import { createPost } from '../services/postService';
import { fetchCircles } from '../services/circleService';
import { saveDraft } from '../features/sanctuarySlice';
import { useToast } from '../contexts/ToastContext';
import { usePageTitle } from '../hooks/usePageTitle';

// Room configurations matching the exact categories from the room post forms
const ROOMS = {
  dark: {
    id: 'dark',
    name: 'Dark',
    accent: '#2EE6FF',
    categories: [
      { value: 'CONFESSION', label: 'Confession' },
      { value: 'REGRET', label: 'Regret' },
      { value: 'DARK', label: 'Dark' },
    ],
  },
  fantasy: {
    id: 'fantasy',
    name: 'Fantasy',
    accent: '#FF9D1C',
    categories: [
      { value: 'CREATIVE', label: 'Creative' },
      { value: 'DAYDREAM', label: 'Daydream' },
      { value: 'FUNNY', label: 'Funny' },
      { value: 'FUTURISTIC', label: 'Futuristic' },
    ],
  },
  philo: {
    id: 'philo',
    name: 'Philo',
    accent: '#B56DFF',
    categories: [
      { value: 'SPIRITUAL', label: 'Spiritual' },
      { value: 'SHADOW', label: 'Shadow' },
      { value: 'DEEP', label: 'Deep' },
    ],
  },
};

export default function SanctuaryPostStudio() {
  usePageTitle('New Post');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const [room, setRoom] = useState('dark');
  const [category, setCategory] = useState('CONFESSION');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [circleId, setCircleId] = useState('');
  const [circles, setCircles] = useState([]);
  const [loadingCircles, setLoadingCircles] = useState(false);

  const [image, setImage] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [preview, setPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const currentRoom = ROOMS[room];

  // Load circles for selected room
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
        console.error('Failed to load circles:', err);
      } finally {
        if (isMounted) setLoadingCircles(false);
      }
    }
    loadCircles();
    return () => {
      isMounted = false;
    };
  }, [room]);

  const handleRoomChange = (newRoom) => {
    setRoom(newRoom);
    setCategory(ROOMS[newRoom].categories[0].value);
  };

  // Auto-save draft
  useEffect(() => {
    if (!content.trim() || content.length < 15) return;
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
      setSavedAt(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    }, 10000);

    return () => clearTimeout(timer);
  }, [title, content, room, category, circleId, image, dispatch]);

  const handleSaveDraft = () => {
    if (!content.trim()) {
      addToast('Write something before saving.', 'info');
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
    setSavedAt(
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
    addToast('Draft saved.', 'success');
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    const len = content.trim().length;
    if (len < 10) {
      addToast('Post must be at least 10 characters.', 'error');
      return;
    }
    if (len > 5000) {
      addToast('Post is too long (5,000 char max).', 'error');
      return;
    }
    if (!circleId) {
      addToast('Please select a circle.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost({
        title: title.trim() || undefined,
        content: content.trim(),
        room,
        category,
        circleId,
        image: image || undefined,
      });

      addToast('Post published.', 'success');
      navigate(`/rooms/${room}`);
    } catch (err) {
      console.error('Failed to publish post:', err);
      addToast(err.message || 'Failed to publish post.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout leftSidebar={null} rightSidebar={null}>
      <div className="bg-transparent text-white min-h-[calc(100vh-3rem)] pb-16 pt-3 sm:pt-5">
        <div className="max-w-xl mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#21262d]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </button>

            {/* Room Tabs */}
            <div className="flex border border-[#21262d] rounded p-0.5 bg-[rgba(255,255,255,0.02)]">
              {Object.values(ROOMS).map((r) => {
                const isActive = r.id === room;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoomChange(r.id)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                      isActive
                        ? 'bg-[#21262d] text-[#e6edf3] font-medium'
                        : 'text-[#8b949e] hover:text-[#e6edf3]'
                    }`}
                  >
                    {r.name}
                  </button>
                );
              })}
            </div>

            {/* Preview Toggle */}
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className={`flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded border transition-colors ${
                preview
                  ? 'bg-[#21262d] text-[#e6edf3] border-[#30363d]'
                  : 'text-[#8b949e] border-[#21262d] hover:text-[#e6edf3]'
              }`}
            >
              {preview ? <PenTool size={11} /> : <Eye size={11} />}
              <span>{preview ? 'Edit' : 'Preview'}</span>
            </button>
          </div>

          {/* Form Card */}
          <div
            className="rounded-lg border p-4 sm:p-5 transition-all"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(12px)',
              borderColor: '#21262d',
            }}
          >
            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 pb-3 border-b border-[#21262d]">
              {currentRoom.categories.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                    category === c.value
                      ? 'bg-[#21262d] text-[#e6edf3] border border-[#30363d] font-medium'
                      : 'text-[#8b949e] hover:text-[#e6edf3] border border-transparent'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Circle dropdown */}
            <div className="py-3 border-b border-[#21262d]">
              <select
                value={circleId}
                onChange={(e) => setCircleId(e.target.value)}
                disabled={loadingCircles}
                className="w-full bg-[#0a0a0a] border border-[#21262d] rounded px-3 py-1.5 text-xs font-mono text-[#e6edf3] focus:outline-none focus:border-[#30363d]"
              >
                {loadingCircles ? (
                  <option value="">Loading circles...</option>
                ) : circles.length === 0 ? (
                  <option value="">No circles found</option>
                ) : (
                  circles.map((c) => (
                    <option key={c.id || c._id} value={c.id || c._id}>
                      Circle: {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Title (optional) */}
            <div className="py-2 border-b border-[#21262d]">
              <input
                type="text"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                className="w-full bg-transparent text-sm font-mono text-[#e6edf3] placeholder-[#484f58] focus:outline-none"
              />
            </div>

            {/* Textarea or Preview */}
            <div className="py-3 min-h-[220px]">
              {preview ? (
                <div className="min-h-[200px] p-3 rounded bg-[rgba(255,255,255,0.01)] border border-[#21262d]">
                  <div className="text-[10px] uppercase font-mono text-[#8b949e] mb-2">
                    {room} &bull; {category}
                  </div>
                  {title && (
                    <h3 className="text-sm font-mono font-medium text-[#e6edf3] mb-2">
                      {title}
                    </h3>
                  )}
                  <p className="text-xs sm:text-sm font-mono text-[#c9d1d9] whitespace-pre-wrap leading-relaxed">
                    {content || (
                      <span className="text-[#484f58] italic">No text yet...</span>
                    )}
                  </p>
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?..."
                  rows={8}
                  className="w-full bg-transparent text-xs sm:text-sm font-mono text-[#e6edf3] placeholder-[#484f58] leading-relaxed resize-none focus:outline-none"
                />
              )}
            </div>

            {/* Optional Image */}
            {showImageUpload ? (
              <div className="pt-2 pb-3 border-t border-[#21262d]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#8b949e]">Image</span>
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setShowImageUpload(false);
                    }}
                    className="text-xs font-mono text-[#6e7681] hover:text-[#e6edf3] flex items-center gap-1"
                  >
                    <X size={12} />
                    <span>Cancel</span>
                  </button>
                </div>
                <ImageUpload onImageSelected={(img) => setImage(img)} />
              </div>
            ) : (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowImageUpload(true)}
                  className="flex items-center gap-1.5 text-xs font-mono text-[#6e7681] hover:text-[#8b949e] transition-colors"
                >
                  <ImageIcon size={13} />
                  <span>Add image</span>
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#21262d]">
              <div className="text-[11px] font-mono text-[#6e7681]">
                <span>{content.length}/5000</span>
                {savedAt && <span className="ml-2">&bull; Saved {savedAt}</span>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] border border-[#21262d] hover:border-[#30363d] transition-colors"
                >
                  <Bookmark size={12} />
                  <span>Save draft</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={content.trim().length < 10 || isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-mono font-medium uppercase tracking-wider text-black bg-[#e6edf3] hover:bg-white active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={11} />
                      <span>Post</span>
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
