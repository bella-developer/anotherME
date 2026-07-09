import { useState, memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { deleteComment } from '../features/commentsSlice';
import CommentForm from './CommentForm';
import ConfirmDialog from './ConfirmDialog';

/**
 * CommentThread Component
 * Displays nested comments with indentation, vertical lines, and reply functionality
 * Requirements: 27.1, 27.2, 27.3, 27.4, 27.5, 27.6, 27.7
 */
const CommentThread = memo(({ comments, postId, currentUserId, maxDepth = 3 }) => {
  const dispatch = useDispatch();
  const [deleteCommentId, setDeleteCommentId] = useState(null);

  // Build comment tree structure
  const commentTree = useMemo(() => {
    const commentMap = new Map();
    const rootComments = [];

    // First pass: create map of all comments
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build tree structure
    comments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });

    return rootComments;
  }, [comments]);

  return (
    <div className="space-y-2">
      {commentTree.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          currentUserId={currentUserId}
          depth={0}
          maxDepth={maxDepth}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
});

/**
 * CommentItem Component
 * Individual comment with reply functionality and nesting
 */
const CommentItem = memo(({ comment, postId, currentUserId, depth, maxDepth, dispatch }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate indentation (32px per level)
  const indentPx = depth * 32;

  // Determine background color (alternating shades)
  const bgColor = depth % 2 === 0 ? '#1a1a1a' : '#1f1f1f';

  // Check if at max depth
  const isMaxDepth = depth >= maxDepth;

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Handle delete comment
  const handleDelete = async (commentId) => {
    try {
      await dispatch(deleteComment(commentId)).unwrap();
      setDeleteCommentId(null);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  // Handle reply form toggle
  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  // Handle reply success
  const handleReplySuccess = () => {
    setShowReplyForm(false);
  };

  // Check if user owns this comment
  const isOwner = currentUserId && comment.authorId === currentUserId;

  // Count visible replies
  const replyCount = comment.replies?.length || 0;

  return (
    <div className="relative">
      {/* Vertical line for nesting */}
      {depth > 0 && (
        <div
          className="absolute top-0 bottom-0 w-px bg-[#2a2a2a]"
          style={{ left: `${indentPx - 16}px` }}
        />
      )}

      {/* Comment container */}
      <div
        className="relative transition-all duration-200"
        style={{
          marginLeft: `${indentPx}px`,
          backgroundColor: bgColor,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Comment card */}
        <div className="p-2 rounded">
          {/* Header: Author and timestamp */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">
                {comment.author?.username || 'User'}
              </span>
              <span className="text-[#a3a3a3] text-xs">
                {formatTimestamp(comment.createdAt)}
              </span>
            </div>

            {/* Delete button (only for owner) */}
            {isOwner && (
              <button
                onClick={() => setDeleteCommentId(comment.id)}
                className="text-[#a3a3a3] hover:text-red-500 transition-colors duration-200"
                title="Delete comment"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <p className="text-[#e5e5e5] text-sm leading-relaxed mb-3">
            {comment.content}
          </p>

          {/* Actions: Upvote, Downvote, Reply count, Reply button */}
          <div className="flex items-center gap-4">
            {/* Upvote */}
            <button
              className="flex items-center gap-1 text-[#6B5E59] hover:text-[#D9C5B2] transition-colors duration-200"
              title="Upvote"
            >
              <span className="text-base">▲</span>
              <span className="text-xs">{comment.reactions?.resonate || 0}</span>
            </button>

            {/* Downvote */}
            <button
              className="flex items-center gap-1 text-[#6B5E59] hover:text-[#D9C5B2] transition-colors duration-200"
              title="Downvote"
            >
              <span className="text-base">▼</span>
              <span className="text-xs">{comment.reactions?.echo || 0}</span>
            </button>

            {/* Reply count */}
            {replyCount > 0 && (
              <div className="flex items-center gap-1 text-[#6B5E59]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-xs">{replyCount}</span>
              </div>
            )}

            {/* Reply button */}
            {!isMaxDepth && (
              <button
                onClick={handleReplyClick}
                className="text-[#6B5E59] text-xs hover:text-[#D9C5B2] transition-colors duration-200"
              >
                {showReplyForm ? 'Cancel' : 'Reply'}
              </button>
            )}
          </div>

          {/* Max depth indicator */}
          {isMaxDepth && replyCount > 0 && (
            <button
              onClick={() => {
                // Navigate to dedicated thread page
              }}
              className="text-[#8b5cf6] text-sm font-medium hover:text-[#9d6fff] transition-colors duration-200"
            >
              Continue thread →
            </button>
          )}
        </div>

        {/* Reply form (inline) */}
        {showReplyForm && (
          <div className="px-2 pb-2">
            <CommentForm
              commentId={comment.id}
              onSuccess={handleReplySuccess}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {/* Nested replies */}
      {!isMaxDepth && replyCount > 0 && (
        <div className="mt-2">
          {/* Show more replies toggle */}
          {replyCount > 5 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-[#8b5cf6] text-sm font-medium hover:text-[#9d6fff] transition-colors duration-200 mb-2"
              style={{ marginLeft: `${indentPx + 32}px` }}
            >
              {showReplies ? 'Hide replies' : `Show ${replyCount} more replies`}
            </button>
          )}

          {/* Render replies */}
          {showReplies && comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUserId={currentUserId}
              depth={depth + 1}
              maxDepth={maxDepth}
              dispatch={dispatch}
            />
          ))}
        </div>
      )}
    </div>
  );
});

CommentThread.displayName = 'CommentThread';
CommentItem.displayName = 'CommentItem';

// Add ConfirmDialog outside the CommentItem component
const CommentThreadWrapper = (props) => {
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const dispatch = useDispatch();

  const handleDelete = async (commentId) => {
    try {
      await dispatch(deleteComment(commentId)).unwrap();
      setDeleteCommentId(null);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <>
      <CommentThread {...props} setDeleteCommentId={setDeleteCommentId} handleDeleteComment={handleDelete} />
      <ConfirmDialog
        isOpen={!!deleteCommentId}
        onClose={() => setDeleteCommentId(null)}
        onConfirm={() => handleDelete(deleteCommentId)}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default CommentThreadWrapper;
