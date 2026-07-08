import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost, clearError } from '../features/postsSlice';
import { createCircle } from '../services/circleService';
import Button from './Button';
import ImageUpload from './ImageUpload';
import useReducedMotion from '../hooks/useReducedMotion';

/**
 * Climb Room Post Form Component
 * Specialized form for Climb Room posts with specific categories
 */
const ClimbRoomPostForm = ({ isOpen, onClose, circles = [], onPostCreated, onCircleCreated, editingPost = null }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.posts);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    room: 'climb',
    circleId: '',
    category: 'IDEA',
    image: null,
  });

  const [showCircleCreation, setShowCircleCreation] = useState(false);
  const [newCircle, setNewCircle] = useState({
    name: '',
    description: '',
  });
  const [creatingCircle, setCreatingCircle] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [characterCount, setCharacterCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Climb Room specific categories
  const categories = [
    { value: 'IDEA', label: 'Idea', description: 'Share your vision' },
    { value: 'FUTURISTIC', label: 'Futuristic', description: 'Tomorrow\'s possibilities' },
    { value: 'BUSINESS', label: 'Business', description: 'Commercial ventures' },
    { value: 'ENTREPRENEUR', label: 'Entrepreneur', description: 'Building & scaling' },
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        content: '',
        room: 'climb',
        circleId: '',
        category: 'IDEA',
        image: null,
      });
      setNewCircle({ name: '', description: '' });
      setShowCircleCreation(false);
      setValidationErrors({});
      setCharacterCount(0);
      dispatch(clearError());
    } else if (isOpen && editingPost) {
      // Populate form with editing post data
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
      setCharacterCount(plainTextContent.length);
    }
  }, [isOpen, editingPost, dispatch]);

  // Update character count
  useEffect(() => {
    setCharacterCount(formData.content.length);
  }, [formData.content]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle circle creation
  const handleCreateCircle = async () => {
    if (!newCircle.name.trim() || newCircle.name.length < 3) {
      setValidationErrors(prev => ({
        ...prev,
        circleName: 'Circle name must be at least 3 characters'
      }));
      return;
    }

    if (!newCircle.description.trim() || newCircle.description.length < 10) {
      setValidationErrors(prev => ({
        ...prev,
        circleDescription: 'Description must be at least 10 characters'
      }));
      return;
    }

    try {
      setCreatingCircle(true);
      const createdCircle = await createCircle({
        name: newCircle.name.trim(),
        description: newCircle.description.trim(),
        visibility: 'public',
        categories: [formData.category],
        room: 'climb' // Climb room identifier
      });

      setFormData(prev => ({ ...prev, circleId: createdCircle.circle.id }));
      setShowCircleCreation(false);
      setNewCircle({ name: '', description: '' });
      // Notify parent to refetch circles
      if (onCircleCreated) onCircleCreated();
    } catch (err) {
      setValidationErrors(prev => ({
        ...prev,
        circleCreation: err.message || 'Failed to create circle'
      }));
    } finally {
      setCreatingCircle(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      errors.content = 'Content must be at least 10 characters';
    } else if (formData.content.length > 5000) {
      errors.content = 'Content must not exceed 5000 characters';
    }

    if (!formData.circleId) {
      errors.circleId = 'Please select or create a circle';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let result;
      
      if (editingPost) {
        // Update existing post
        result = await dispatch(updatePost({ 
          postId: editingPost.id, 
          postData: formData 
        })).unwrap();
      } else {
        // Create new post
        result = await dispatch(createPost(formData)).unwrap();
      }
      
      // Pass the result back to parent for optimistic update
      if (onPostCreated) {
        onPostCreated(result);
      }
      
      onClose();
    } catch (err) {
      // Error handling
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const getCharacterCountColor = () => {
    if (characterCount > 5000) return 'text-[#ef4444]';
    if (characterCount > 4500) return 'text-[#f59e0b]';
    return 'text-[#a3a3a3]';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-[#1a1a1a] rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        style={{
          animation: prefersReducedMotion ? 'none' : 'fadeIn 300ms ease-out',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
          <div>
            <h2 id="modal-title" className="text-white text-2xl font-bold">Climb Room Post</h2>
            <p className="text-[#6B5E59] text-sm mt-1">Build. Sharpen. Progress.</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-[#a3a3a3] hover:text-white transition-colors duration-200 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Category Selector */}
          <div className="mb-4">
            <label className="block text-[#a3a3a3] text-sm mb-2">Category</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  disabled={loading}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 ${
                    formData.category === cat.value
                      ? 'border-[#D97757] bg-[#D97757] bg-opacity-10 text-white'
                      : 'border-[#2a2a2a] bg-[#1a1a1a] text-[#a3a3a3] hover:border-[#3a3a3a]'
                  }`}
                >
                  <div className="font-medium text-sm">{cat.label}</div>
                  <div className="text-xs mt-1 opacity-70">{cat.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <input
              type="text"
              name="title"
              placeholder="Title (optional)"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              className="w-full h-12 bg-[#1a1a1a] text-[#e5e5e5] border border-[#2a2a2a] rounded-lg px-4 text-lg focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757] focus:ring-opacity-20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder-[#4a4a4a]"
            />
          </div>

          {/* Content Textarea */}
          <div className="mb-4">
            <textarea
              name="content"
              placeholder="Describe your idea..."
              value={formData.content}
              onChange={handleChange}
              disabled={loading}
              className={`w-full min-h-[200px] bg-[#1a1a1a] text-[#e5e5e5] border ${
                validationErrors.content ? 'border-[#ef4444]' : 'border-[#2a2a2a]'
              } rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757] focus:ring-opacity-20 transition-all duration-200 resize-y disabled:opacity-50 disabled:cursor-not-allowed placeholder-[#4a4a4a]`}
              style={{ lineHeight: '1.6' }}
            />
            
            <div className="flex items-center justify-between mt-2">
              {validationErrors.content && (
                <span className="text-[#ef4444] text-xs">{validationErrors.content}</span>
              )}
              <span className={`text-xs ml-auto ${getCharacterCountColor()}`}>
                {characterCount} / 5000
              </span>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <ImageUpload
              onImageSelect={(file) => setFormData(prev => ({ ...prev, image: file }))}
              onImageRemove={() => setFormData(prev => ({ ...prev, image: null }))}
              disabled={loading}
            />
          </div>

          {/* Circle Selection/Creation */}
          <div className="mb-4">
            <label className="block text-[#a3a3a3] text-sm mb-2">Circle</label>
            
            {!showCircleCreation ? (
              <div className="space-y-2">
                <select
                  name="circleId"
                  value={formData.circleId}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full bg-[#1a1a1a] text-[#e5e5e5] border ${
                    validationErrors.circleId ? 'border-[#ef4444]' : 'border-[#2a2a2a]'
                  } rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757] focus:ring-opacity-20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="">Select a circle</option>
                  {circles
                    .filter(circle => circle.room === 'climb')
                    .map((circle) => {
                      const isBusy = (circle.topicCount || 0) >= 3;
                      return (
                        <option 
                          key={circle.id} 
                          value={circle.id}
                          disabled={isBusy}
                        >
                          {circle.name}{isBusy ? ' (Circle is busy)' : ''}
                        </option>
                      );
                    })}
                </select>
                
                <button
                  type="button"
                  onClick={() => setShowCircleCreation(true)}
                  disabled={loading}
                  className="text-[#D97757] text-sm hover:text-[#E68868] transition-colors disabled:opacity-50"
                >
                  + Create new circle
                </button>
                
                {validationErrors.circleId && (
                  <span className="text-[#ef4444] text-xs block">{validationErrors.circleId}</span>
                )}
              </div>
            ) : (
              <div className="space-y-3 p-4 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a]">
                <div>
                  <input
                    type="text"
                    placeholder="Circle name"
                    value={newCircle.name}
                    onChange={(e) => {
                      setNewCircle(prev => ({ ...prev, name: e.target.value }));
                      setValidationErrors(prev => ({ ...prev, circleName: '' }));
                    }}
                    maxLength={50}
                    disabled={creatingCircle}
                    className={`w-full bg-[#1a1a1a] text-[#e5e5e5] border ${
                      validationErrors.circleName ? 'border-[#ef4444]' : 'border-[#2a2a2a]'
                    } rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D97757] disabled:opacity-50`}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {validationErrors.circleName ? (
                      <span className="text-[#ef4444] text-xs">{validationErrors.circleName}</span>
                    ) : newCircle.name ? (
                      <span className="text-xs" style={{ color: newCircle.name.length >= 3 ? '#22c55e' : '#a3a3a3' }}>
                        {newCircle.name.length >= 3 ? '✓ Valid name' : 'Min 3 characters'}
                      </span>
                    ) : (
                      <span className="text-[#a3a3a3] text-xs">Min 3 characters required</span>
                    )}
                    {newCircle.name && (
                      <span className="text-xs tabular-nums" style={{ color: newCircle.name.length > 45 ? '#f59e0b' : '#6b7280' }}>
                        {newCircle.name.length}/50
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <textarea
                    placeholder="Circle description"
                    value={newCircle.description}
                    onChange={(e) => {
                      setNewCircle(prev => ({ ...prev, description: e.target.value }));
                      setValidationErrors(prev => ({ ...prev, circleDescription: '' }));
                    }}
                    maxLength={500}
                    disabled={creatingCircle}
                    rows={3}
                    className={`w-full bg-[#1a1a1a] text-[#e5e5e5] border ${
                      validationErrors.circleDescription ? 'border-[#ef4444]' : 'border-[#2a2a2a]'
                    } rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D97757] disabled:opacity-50 resize-none`}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {validationErrors.circleDescription ? (
                      <span className="text-[#ef4444] text-xs">{validationErrors.circleDescription}</span>
                    ) : newCircle.description ? (
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex-1 h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-200"
                            style={{
                              width: `${(newCircle.description.length / 500) * 100}%`,
                              background: newCircle.description.length >= 10 ? (newCircle.description.length > 450 ? '#f59e0b' : '#22c55e') : '#6b7280'
                            }}
                          />
                        </div>
                        <span className="text-xs" style={{ color: newCircle.description.length >= 10 ? '#22c55e' : '#a3a3a3' }}>
                          {newCircle.description.length >= 10 ? '✓' : `${10 - newCircle.description.length} more`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#a3a3a3] text-xs">Min 10 characters required</span>
                    )}
                    {newCircle.description && (
                      <span className="text-xs tabular-nums ml-2" style={{ color: newCircle.description.length > 450 ? '#f59e0b' : '#6b7280' }}>
                        {newCircle.description.length}/500
                      </span>
                    )}
                  </div>
                </div>
                
                {validationErrors.circleCreation && (
                  <div className="text-[#ef4444] text-xs">{validationErrors.circleCreation}</div>
                )}
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateCircle}
                    disabled={creatingCircle}
                    className="flex-1 px-4 py-2 bg-[#D97757] text-black rounded text-sm font-medium hover:bg-[#E68868] transition-colors disabled:opacity-50"
                  >
                    {creatingCircle ? 'Creating...' : 'Create Circle'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCircleCreation(false);
                      setNewCircle({ name: '', description: '' });
                      setValidationErrors(prev => {
                        const { circleName, circleDescription, circleCreation, ...rest } = prev;
                        return rest;
                      });
                    }}
                    disabled={creatingCircle}
                    className="px-4 py-2 bg-[#2a2a2a] text-[#a3a3a3] rounded text-sm hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-[#ef4444] bg-opacity-10 border border-[#ef4444] rounded-lg">
              <p className="text-[#ef4444] text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={loading || creatingCircle}
            className="w-full h-12"
          >
            {loading ? (editingPost ? 'Updating...' : 'Publishing...') : (editingPost ? 'Update Post' : 'Publish to Climb Room')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ClimbRoomPostForm;
