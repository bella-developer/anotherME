import { useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import { createComment, createReply } from '../features/commentsSlice';

/**
 * CommentForm Component
 * Inline textarea for creating comments or replies
 * Obsidian Theme: Deep charcoal surface, warm ivory text, burnt orange action
 */
const CommentForm = memo(({ postId, commentId, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Character limit for comments
  const MAX_LENGTH = 1000;
  const MIN_LENGTH = 1;

  // Calculate remaining characters
  const remainingChars = MAX_LENGTH - content.length;
  const isNearLimit = remainingChars < 100;
  const isOverLimit = remainingChars < 0;

  // Validate content
  const isValid = content.trim().length >= MIN_LENGTH && 
                  content.length <= MAX_LENGTH;

  // Handle content change
  const handleContentChange = (e) => {
    setContent(e.target.value);
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate content
    if (!isValid) {
      setError('Comment must be between 1 and 1000 characters');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Determine if this is a comment or reply
      if (commentId) {
        // Creating a reply
        await dispatch(createReply({ commentId, content: content.trim() })).unwrap();
      } else if (postId) {
        // Creating a comment
        await dispatch(createComment({ postId, content: content.trim() })).unwrap();
      } else {
        throw new Error('Either postId or commentId is required');
      }

      // Clear form and notify success
      setContent('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key submission (Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setContent('');
    setError(null);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 font-mono">
      {/* Textarea */}
      <div className="relative">
        <textarea
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder={commentId ? 'Write a quiet reply...' : 'Leave a thought...'}
          className={`w-full bg-[#111117] text-[#E7DED5] rounded-lg px-3 py-2 text-xs sm:text-sm
            border transition-all duration-200 resize-none
            placeholder:text-[#928B91]
            focus:outline-none focus:border-[#D77A35]
            ${error ? 'border-red-500' : 'border-[#292630]'}
            ${isOverLimit ? 'border-red-500' : ''}
          `}
          rows={3}
          disabled={isSubmitting}
          style={{ minHeight: '90px' }}
        />

        {/* Character counter */}
        <div className="absolute bottom-2 right-2">
          <span
            className={`text-[10px] ${
              isOverLimit
                ? 'text-red-400 font-bold'
                : isNearLimit
                ? 'text-[#D6A45F]'
                : 'text-[#928B91]'
            }`}
          >
            {remainingChars}
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`px-4 py-1.5 rounded text-xs uppercase tracking-wider font-medium transition-all duration-200
            ${
              !isValid || isSubmitting
                ? 'bg-[#292630] text-[#928B91] cursor-not-allowed'
                : 'bg-[#D77A35] text-[#E7DED5] hover:bg-[#c66e2e] active:scale-95'
            }
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1.5">
              <svg
                className="animate-spin h-3.5 w-3.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Sending...</span>
            </span>
          ) : (
            commentId ? 'Reply' : 'Post Comment'
          )}
        </button>

        {/* Cancel button */}
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-3 py-1.5 rounded text-xs uppercase tracking-wider font-medium text-[#928B91] 
              hover:text-[#E7DED5] transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
});

CommentForm.displayName = 'CommentForm';

export default CommentForm;
