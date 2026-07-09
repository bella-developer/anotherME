import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost, clearError } from '../features/postsSlice';
import ImageUpload from './ImageUpload';
import useReducedMotion from '../hooks/useReducedMotion';
import { X } from 'lucide-react';

/**
 * Fantasy Room Post Form Component
 * Compact modern design with inline validation
 */
const FantasyRoomPostForm = ({ isOpen, onClose, circles = [], onPostCreated, editingPost = null }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.posts);
  const prefersReducedMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    room: 'fantasy',
    circleId: '',
    category: 'CREATIVE',
    image: null,
  });

  const [contentValidation, setContentValidation] = useState({
    isValid: false,
    status: 'empty',
    message: ''
  });

  const categories = [
    { value: 'CREATIVE', label: 'Creative' },
    { value: 'DAYDREAM', label: 'Daydream' },
    { value: 'FUNNY', label: 'Funny' },
    { value: 'FUTURISTIC', label: 'Futuristic' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        content: '',
        room: 'fantasy',
        circleId: '',
        category: 'CREATIVE',
        image: null,
      });
      dispatch(clearError());
    } else if (isOpen && editingPost) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editingPost.content;
      const plainTextContent = tempDiv.textContent || tempDiv.innerText || '';
      
      setFormData({
        title: editingPost.title || '',
        content: plainTextContent,
        room: editingPost.room,
        circleId: editingPost.circleId || '',
        category: editingPost.category,
        image: null,
      });
    }
  }, [isOpen, editingPost, dispatch]);

  useEffect(() => {
    const length = formData.content.length;
    
    if (length === 0) {
      setContentValidation({ isValid: false, status: 'empty', message: 'Content is required' });
    } else if (length < 10) {
      setContentValidation({ isValid: false, status: 'tooShort', message: `${10 - length} more` });
    } else if (length > 5000) {
      setContentValidation({ isValid: false, status: 'tooLong', message: `${length - 5000} over` });
    } else {
      setContentValidation({ isValid: true, status: 'valid', message: '✓' });
    }
  }, [formData.content]);

  const isFormReady = () => contentValidation.isValid && formData.circleId && formData.category;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormReady()) return;

    try {
      const result = editingPost 
        ? await dispatch(updatePost({ postId: editingPost.id, postData: formData })).unwrap()
        : await dispatch(createPost(formData)).unwrap();
      
      if (onPostCreated) onPostCreated(result);
      onClose();
    } catch (err) {
      // Error handled by Redux
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
      style={{
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(8px)',
        animation: prefersReducedMotion ? 'none' : 'fadeIn 250ms ease-out',
      }}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)',
          borderRadius: '12px',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          animation: prefersReducedMotion ? 'none' : 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-white text-lg font-medium tracking-tight">New Post</h2>
            <p className="text-[#6b7280] text-xs mt-0.5">Fantasy Room</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-[#6b7280] hover:text-[#9ca3af] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Category - Compact pills */}
          <div>
            <label className="text-[#9ca3af] text-xs mb-2 block">Category</label>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-all disabled:opacity-50"
                  style={{
                    background: formData.category === cat.value 
                      ? 'rgba(255, 157, 28, 0.12)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: formData.category === cat.value
                      ? '1px solid rgba(255, 157, 28, 0.3)'
                      : '1px solid transparent',
                    color: formData.category === cat.value ? '#FF9D1C' : '#6b7280',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <input
              type="text"
              name="title"
              placeholder="Title (optional)"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg text-sm transition-all disabled:opacity-50"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#e5e5e5',
              }}
            />
          </div>

          {/* Content with inline validation */}
          <div>
            <textarea
              name="content"
              placeholder="Share your imagination..."
              value={formData.content}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg text-sm resize-none transition-all disabled:opacity-50"
              rows={6}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: contentValidation.status === 'valid' 
                  ? '1px solid rgba(34, 197, 94, 0.3)' 
                  : '1px solid rgba(255, 255, 255, 0.06)',
                color: '#e5e5e5',
                lineHeight: '1.6',
              }}
            />
            <div className="flex items-center justify-between mt-1.5 px-1">
              <span className="text-xs" style={{
                color: contentValidation.status === 'valid' ? '#22c55e' : 
                       contentValidation.status === 'tooShort' ? '#f59e0b' : 
                       contentValidation.status === 'tooLong' ? '#ef4444' : '#6b7280'
              }}>
                {contentValidation.message}
              </span>
              <span className="text-xs text-[#6b7280]">{formData.content.length} / 5000</span>
            </div>
          </div>

          {/* Image Upload */}
          <ImageUpload
            onImageSelect={(file) => setFormData(prev => ({ ...prev, image: file }))}
            onImageRemove={() => setFormData(prev => ({ ...prev, image: null }))}
            disabled={loading}
          />

          {/* Circle Selection */}
          <div>
            <label className="text-[#9ca3af] text-xs mb-2 block">Circle</label>
            <select
              name="circleId"
              value={formData.circleId}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg text-sm transition-all disabled:opacity-50"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: formData.circleId 
                  ? '1px solid rgba(34, 197, 94, 0.3)' 
                  : '1px solid rgba(255, 255, 255, 0.06)',
                color: formData.circleId ? '#e5e5e5' : '#6b7280',
              }}
            >
              <option value="">Select a circle</option>
              {circles.filter(circle => circle.room === 'fantasy').map((circle) => (
                <option key={circle.id} value={circle.id} disabled={(circle.topicCount || 0) >= 3}>
                  {circle.name}{(circle.topicCount || 0) >= 3 ? ' (busy)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-3 py-2 rounded-lg text-xs" style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isFormReady()}
            className="w-full py-3 rounded-lg font-medium text-sm transition-all disabled:opacity-40"
            style={{
              background: !isFormReady() ? 'rgba(255, 255, 255, 0.04)' : '#FF9D1C',
              color: !isFormReady() ? '#6b7280' : '#000',
              cursor: !isFormReady() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Publishing...' : isFormReady() ? 'Publish' : 'Complete form to publish'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FantasyRoomPostForm;
