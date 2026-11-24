import { useState, memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { deleteComment } from '../features/commentsSlice';
import CommentForm from './CommentForm';
import ConfirmDialog from './ConfirmDialog';

/**
 * CommentThread Component
 * Displays nested comments with clean monospace indentation, hairline dividers, and reply functionality
 * Obsidian Theme: Deep charcoal surface, warm ivory text, muted ash metadata
 */
const CommentThread = memo(({ comments, postId, currentUserId, maxDepth = 3, setDeleteCommentId }) => {
  const dispatch = useDispatch();

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

  if (!comments || comments.length === 0) {
    return (
      <div className="py-6 text-center border border-[#292630] rounded-lg bg-[#191820]/40 font-mono">
        <p className="text-xs text-[#928B91]">No thoughts yet. The silence is yours to break.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-mono">
      {commentTree.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          currentUserId={currentUserId}
          depth={0}
          maxDepth={maxDepth}
          dispatch={dispatch}
          setDeleteCommentId={setDeleteCommentId}
        />
      ))}
    </div>
  );
});

/**
 * CommentItem Component
 * Individual comment with reply functionality and nesting
 */
const CommentItem = memo(({ comment, postId, currentUserId, depth, maxDepth, dispatch, setDeleteCommentId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  // Indentation
  const indentPx = depth * 24;

  // Background
  const bgColor = depth % 2 === 0 ? '#191820' : '#111117';

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

  const isOwner = currentUserId && (comment.authorId === currentUserId || comment.userId === currentUserId);
  const replyCount = comment.replies?.length || 0;

  return (
    <div className="relative">
      {/* Hairline guide for nesting */}
      {depth > 0 && (
        <div
          className="absolute top-0 bottom-0 w-px bg-[#292630]"
          style={{ left: `${indentPx - 12}px` }}
        />
      )}

      {/* Comment container */}
      <div
        className="relative transition-all duration-200 rounded-lg border border-[#292630] p-3 sm:p-4"
        style={{
          marginLeft: `${indentPx}px`,
          backgroundColor: bgColor,
        }}
      >
        {/* Header: Author and timestamp */}
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#292630]/60">
          <div className="flex items-center gap-2">
            <span className="text-[#E7DED5] font-semibold text-xs">
              {comment.author?.username || comment.authorName || 'Anonymous'}
            </span>
            <span className="text-[#928B91] text-[10px]">
              {formatTimestamp(comment.createdAt)}
            </span>
          </div>

          {/* Delete button (owner only) */}
          {isOwner && (
            <button
              onClick={() => setDeleteCommentId?.(comment.id)}
              className="text-[#928B91] hover:text-red-400 transition-colors p-1"
              title="Delete comment"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <p className="text-[#E7DED5] text-xs sm:text-sm leading-relaxed mb-3 whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 text-xs">
          {/* Reply button */}
          {!isMaxDepth && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-[#928B91] hover:text-[#D77A35] transition-colors uppercase tracking-wider text-[10px] font-medium"
            >
              {showReplyForm ? 'Cancel' : 'Reply'}
            </button>
          )}

          {/* Reply count toggle */}
          {replyCount > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-[#928B91] hover:text-[#E7DED5] transition-colors flex items-center gap-1 text-[10px]"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
            </button>
          )}
        </div>

        {/* Inline Reply Form */}
        {showReplyForm && (
          <div className="mt-3 pt-3 border-t border-[#292630]">
            <CommentForm
              postId={postId}
              commentId={comment.id}
              onSuccess={() => setShowReplyForm(false)}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {/* Nested replies */}
      {!isMaxDepth && replyCount > 0 && showReplies && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUserId={currentUserId}
              depth={depth + 1}
              maxDepth={maxDepth}
              dispatch={dispatch}
              setDeleteCommentId={setDeleteCommentId}
            />
          ))}
        </div>
      )}
    </div>
  );
});

CommentThread.displayName = 'CommentThread';
CommentItem.displayName = 'CommentItem';

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
      <CommentThread {...props} setDeleteCommentId={setDeleteCommentId} />
      <ConfirmDialog
        isOpen={!!deleteCommentId}
        onClose={() => setDeleteCommentId(null)}
        onConfirm={() => handleDelete(deleteCommentId)}
        type="danger"
      />
    </>
  );
};

export default CommentThreadWrapper;
