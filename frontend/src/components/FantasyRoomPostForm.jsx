import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost, clearError } from '../features/postsSlice';
import { createCircle } from '../services/circleService';
import ImageUpload from './ImageUpload';
import useReducedMotion from '../hooks/useReducedMotion';
import { X } from 'lucide-react';

/**
 * Fantasy Room Post Form Component
 * Compact modern design with inline validation and circle creation
 */
const FantasyRoomPostForm = ({ isOpen, onClose, circles = [], onPostCreated, onCircleCreated, editingPost = null }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.posts);
  const prefersReducedMotion = useReducedMotion();

  const [showCircleCreation, setShowCircleCreation] = useState(false);
  const [creatingCircle, setCreatingCircle] = useState(false);
  const [newCircle, setNewCircle] = useState({ name: '', description: '' });
  const [circleError, setCircleError] = useState('');

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
      setShowCircleCreation(false);
      setNewCircle({ name: '', description: '' });
      setCircleError('');
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

  const handleCreateCircle = async () => {
    setCircleError('');
    
    if (!newCircle.name.trim() || newCircle.name.length < 3) {
      setCircleError('Circle name must be at least 3 characters');
      return;
    }
    
    if (!newCircle.description.trim() || newCircle.description.length < 10) {
      setCircleError('Description must be at least 10 characters');
      return;
    }

    try {
      setCreatingCircle(true);
      const result = await createCircle({
        name: newCircle.name.trim(),
        description: newCircle.description.trim(),
        room: 'fantasy',
        visibility: 'public',
        categories: [formData.category]
      });
      
      setFormData(prev => ({ ...prev, circleId: result.circle.id }));
      setShowCircleCreation(false);
      setNewCircle({ name: '', description: '' });
      
      if (onCircleCreated) onCircleCreated();
    } catch (err) {
      // Handle specific error codes with better messages
      if (err.code === 'CIRCLE_LIMIT_PER_ROOM') {
        setCircleError('You already have a circle in this room. Each user can create only 1 circle per room.');
      } else if (err.code === 'DAILY_CIRCLE_LIMIT') {
        setCircleError('Daily limit reached. You can create up to 3 circles per day. Try again tomorrow.');
      } else {
        setCircleError(err.message || 'Failed to create circle');
      }
    } finally {
      setCreatingCircle(false);
    }
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
        background: 'rgba(0, 0, 0, 0.94)',
        backdropFilter: 'blur(12px)',
        animation: prefersReducedMotion ? 'none' : 'fadeIn 200ms ease-out',
      }}
    >
      <div
        className="w-full max-w-md max-h-[85vh] overflow-y-auto"
        style={{
          background: '#0a0a0a',
          borderRadius: '8px',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          animation: prefersReducedMotion ? 'none' : 'slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          .w-full.max-w-md::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-white text-base font-medium">Fantasy Room</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-[#6b7280] hover:text-[#9ca3af] transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-3">
          {/* Category */}
          <div className="flex gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                disabled={loading}
                className="flex-1 py-1.5 rounded text-xs font-medium transition-all disabled:opacity-50"
                style={{
                  background: formData.category === cat.value ? 'rgba(255, 157, 28, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  color: formData.category === cat.value ? '#FF9D1C' : '#6b7280',
                  border: 'none',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 rounded text-sm transition-all disabled:opacity-50"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              color: '#e5e5e5',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(255, 157, 28, 0.25)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'}
          />

          {/* Content */}
          <textarea
            name="content"
            placeholder="Share your imagination..."
            value={formData.content}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2.5 rounded text-sm resize-none transition-all disabled:opacity-50"
            rows={5}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              color: '#e5e5e5',
              lineHeight: '1.5',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(255, 157, 28, 0.25)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'}
          />
          <div className="flex items-center justify-between -mt-2 px-1">
            <span className="text-[10px]" style={{
              color: contentValidation.status === 'valid' ? '#22c55e' : 
                     contentValidation.status === 'tooShort' ? '#f59e0b' : 
                     contentValidation.status === 'tooLong' ? '#ef4444' : '#6b7280'
            }}>
              {contentValidation.message}
            </span>
            <span className="text-[10px] text-[#6b7280]">{formData.content.length}</span>
          </div>

          {/* Image Upload */}
          <ImageUpload
            onImageSelect={(file) => setFormData(prev => ({ ...prev, image: file }))}
            onImageRemove={() => setFormData(prev => ({ ...prev, image: null }))}
            disabled={loading}
          />

          {/* Circle */}
          <div>
            <select
              name="circleId"
              value={formData.circleId}
              onChange={handleChange}
              disabled={loading || showCircleCreation}
              className="w-full px-3 py-2 rounded text-sm transition-all disabled:opacity-50"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: formData.circleId ? '#e5e5e5' : '#6b7280',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(255, 157, 28, 0.25)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'}
            >
              <option value="">Select circle</option>
              {circles.filter(circle => circle.room === 'fantasy').map((circle) => (
                <option key={circle.id} value={circle.id} disabled={(circle.topicCount || 0) >= 3}>
                  {circle.name}{(circle.topicCount || 0) >= 3 ? ' (busy)' : ''}
                </option>
              ))}
            </select>
            
            {!showCircleCreation && (
              <button
                type="button"
                onClick={() => setShowCircleCreation(true)}
                disabled={loading}
                className="text-[11px] mt-1.5 px-1 transition-colors disabled:opacity-50"
                style={{ color: '#FF9D1C' }}
              >
                + Create new circle
              </button>
            )}

            {showCircleCreation && (
              <div className="mt-2 space-y-2 p-3 rounded" style={{
                background: 'rgba(255, 157, 28, 0.05)',
                border: '1px solid rgba(255, 157, 28, 0.15)'
              }}>
                <input
                  type="text"
                  placeholder="Circle name (3-100 chars)"
                  value={newCircle.name}
                  onChange={(e) => setNewCircle(prev => ({ ...prev, name: e.target.value }))}
                  disabled={creatingCircle}
                  className="w-full px-2.5 py-1.5 rounded text-xs disabled:opacity-50"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#e5e5e5',
                  }}
                />
                <textarea
                  placeholder="Circle description (10-500 chars)"
                  value={newCircle.description}
                  onChange={(e) => setNewCircle(prev => ({ ...prev, description: e.target.value }))}
                  disabled={creatingCircle}
                  rows={2}
                  className="w-full px-2.5 py-1.5 rounded text-xs resize-none disabled:opacity-50"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#e5e5e5',
                  }}
                />
                {circleError && (
                  <div className="text-[10px]" style={{ color: '#ef4444' }}>
                    {circleError}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateCircle}
                    disabled={creatingCircle}
                    className="flex-1 px-3 py-1.5 rounded text-xs font-medium transition-all disabled:opacity-50"
                    style={{
                      background: '#FF9D1C',
                      color: '#000',
                    }}
                  >
                    {creatingCircle ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCircleCreation(false);
                      setNewCircle({ name: '', description: '' });
                      setCircleError('');
                    }}
                    disabled={creatingCircle}
                    className="px-3 py-1.5 rounded text-xs transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#9ca3af',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="px-3 py-1.5 rounded text-[11px]" style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !isFormReady()}
            className="w-full py-2.5 rounded font-medium text-sm transition-all disabled:opacity-40"
            style={{
              background: !isFormReady() ? 'rgba(255, 255, 255, 0.03)' : '#FF9D1C',
              color: !isFormReady() ? '#6b7280' : '#000',
              cursor: !isFormReady() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Publishing...' : isFormReady() ? 'Publish' : 'Complete to publish'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FantasyRoomPostForm;
