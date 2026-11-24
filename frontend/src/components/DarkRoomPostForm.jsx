import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost, clearError } from '../features/postsSlice';
import { createCircle } from '../services/circleService';
import ImageUpload from './ImageUpload';
import useReducedMotion from '../hooks/useReducedMotion';
import { X } from 'lucide-react';

/**
 * Dark Room Post Form Component
 * Compact modern design with inline validation and circle creation
 */
const DarkRoomPostForm = ({ isOpen, onClose, circles = [], onPostCreated, onCircleCreated, editingPost = null }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.posts);
  const prefersReducedMotion = useReducedMotion();

  const [showCircleCreation, setShowCircleCreation] = useState(false);
  const [creatingCircle, setCreatingCircle] = useState(false);
  const [newCircle, setNewCircle] = useState({ name: '', description: '' });
  const [circleError, setCircleError] = useState('');

  const [formData, setFormData] = useState({
    content: '',
    room: 'dark',
    circleId: '',
    category: 'CONFESSION',
    image: null,
  });

  const [contentValidation, setContentValidation] = useState({
    isValid: false,
    status: 'empty',
    message: ''
  });

  const categories = [
    { value: 'CONFESSION', label: 'Confession' },
    { value: 'REGRET', label: 'Regret' },
    { value: 'DARK', label: 'Dark' },
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        content: '',
        room: 'dark',
        circleId: '',
        category: 'CONFESSION',
        image: null,
      });
      setShowCircleCreation(false);
      setNewCircle({ name: '', description: '' });
      setCircleError('');
      dispatch(clearError());
    } else if (isOpen && editingPost) {
      // Extract plain text from HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editingPost.content;
      const plainTextContent = tempDiv.textContent || tempDiv.innerText || '';
      
      // Extract circleId - handle both formats
      let extractedCircleId = '';
      if (editingPost.circles && editingPost.circles.length > 0) {
        // New format: circles array with circleId property
        extractedCircleId = editingPost.circles[0].circleId || editingPost.circles[0].id || '';
      } else if (editingPost.circleId) {
        // Legacy format: direct circleId
        extractedCircleId = editingPost.circleId;
      }
      
      setFormData({
        content: plainTextContent,
        room: editingPost.room,
        circleId: extractedCircleId,
        category: editingPost.category,
        image: editingPost.image?.url ? editingPost.image : null, // Preserve existing image
      });
    }
  }, [isOpen, editingPost, dispatch]);

  // Real-time content validation
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
        room: 'dark',
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
        className="w-full max-w-md max-h-[85vh] overflow-y-auto font-mono"
        style={{
          background: '#191820',
          borderRadius: '8px',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.9)',
          border: '1px solid #292630',
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
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#292630]">
          <h2 className="text-[#E7DED5] text-sm font-semibold tracking-wider uppercase">Dark Room</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-[#928B91] hover:text-[#E7DED5] transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
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
                  background: formData.category === cat.value ? 'rgba(180, 74, 74, 0.15)' : '#111117',
                  color: formData.category === cat.value ? '#B44A4A' : '#928B91',
                  border: formData.category === cat.value ? '1px solid rgba(180, 74, 74, 0.3)' : '1px solid #292630',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <textarea
            name="content"
            placeholder="Share what's in the dark..."
            value={formData.content}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2.5 rounded text-xs resize-none transition-all disabled:opacity-50"
            rows={5}
            style={{
              background: '#111117',
              border: '1px solid #292630',
              color: '#E7DED5',
              lineHeight: '1.6',
            }}
            onFocus={(e) => e.target.style.borderColor = '#B44A4A'}
            onBlur={(e) => e.target.style.borderColor = '#292630'}
          />
          <div className="flex items-center justify-between -mt-2 px-1">
            <span className="text-[10px]" style={{
              color: contentValidation.status === 'valid' ? '#42B89A' : 
                     contentValidation.status === 'tooShort' ? '#D6A45F' : 
                     contentValidation.status === 'tooLong' ? '#B44A4A' : '#928B91'
            }}>
              {contentValidation.message}
            </span>
            <span className="text-[10px] text-[#928B91]">{formData.content.length}</span>
          </div>

          {/* Image Upload */}
          <ImageUpload
            onImageSelect={(file) => setFormData(prev => ({ ...prev, image: file }))}
            onImageRemove={() => setFormData(prev => ({ ...prev, image: null }))}
            existingImage={formData.image}
            disabled={loading}
          />

          {/* Circle */}
          <div>
            <select
              name="circleId"
              value={formData.circleId}
              onChange={handleChange}
              disabled={loading || showCircleCreation}
              className="w-full px-3 py-2 rounded text-xs transition-all disabled:opacity-50"
              style={{
                background: '#111117',
                border: '1px solid #292630',
                color: formData.circleId ? '#E7DED5' : '#928B91',
              }}
              onFocus={(e) => e.target.style.borderColor = '#B44A4A'}
              onBlur={(e) => e.target.style.borderColor = '#292630'}
            >
              <option value="">Select circle</option>
              {circles.filter(circle => circle.room === 'dark').map((circle) => (
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
                style={{ color: '#B44A4A' }}
              >
                + Create new circle
              </button>
            )}

            {showCircleCreation && (
              <div className="mt-2 space-y-2 p-3 rounded" style={{
                background: 'rgba(180, 74, 74, 0.05)',
                border: '1px solid rgba(180, 74, 74, 0.2)'
              }}>
                <input
                  type="text"
                  placeholder="Circle name (3-100 chars)"
                  value={newCircle.name}
                  onChange={(e) => setNewCircle(prev => ({ ...prev, name: e.target.value }))}
                  disabled={creatingCircle}
                  className="w-full px-2.5 py-1.5 rounded text-xs disabled:opacity-50"
                  style={{
                    background: '#111117',
                    border: '1px solid #292630',
                    color: '#E7DED5',
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
                    background: '#111117',
                    border: '1px solid #292630',
                    color: '#E7DED5',
                  }}
                />
                {circleError && (
                  <div className="text-[10px]" style={{ color: '#B44A4A' }}>
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
                      background: '#B44A4A',
                      color: '#E7DED5',
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
                      background: '#292630',
                      color: '#928B91',
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
              background: 'rgba(180, 74, 74, 0.1)',
              color: '#B44A4A',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !isFormReady()}
            className="w-full py-2.5 rounded font-medium text-xs uppercase tracking-wider transition-all disabled:opacity-40"
            style={{
              background: !isFormReady() ? '#292630' : '#B44A4A',
              color: !isFormReady() ? '#928B91' : '#E7DED5',
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

export default DarkRoomPostForm;
