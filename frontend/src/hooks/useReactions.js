import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addReaction as addReactionAction } from '../features/postsSlice';

/**
 * useReactions Hook
 * Manages reaction state and handles optimistic updates
 */
export function useReactions(postId, initialReactions = {}, initialUserReactions = []) {
  const dispatch = useDispatch();
  const [reactions, setReactions] = useState(initialReactions);
  const [userReactions, setUserReactions] = useState(initialUserReactions);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReaction = useCallback(async (reactionType, hasReacted) => {
    if (isUpdating) return;

    setIsUpdating(true);

    // Optimistic update
    const optimisticReactions = { ...reactions };
    const optimisticUserReactions = [...userReactions];

    if (hasReacted) {
      // Remove reaction
      optimisticReactions[reactionType] = Math.max(0, (optimisticReactions[reactionType] || 0) - 1);
      const index = optimisticUserReactions.indexOf(reactionType);
      if (index > -1) {
        optimisticUserReactions.splice(index, 1);
      }
    } else {
      // Add reaction
      optimisticReactions[reactionType] = (optimisticReactions[reactionType] || 0) + 1;
      optimisticUserReactions.push(reactionType);
    }

    setReactions(optimisticReactions);
    setUserReactions(optimisticUserReactions);

    try {
      // Dispatch Redux action
      await dispatch(addReactionAction({ postId, reactionType })).unwrap();
    } catch (error) {
      // Revert on error
      setReactions(initialReactions);
      setUserReactions(initialUserReactions);
      console.error('Failed to update reaction:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [dispatch, postId, reactions, userReactions, initialReactions, initialUserReactions, isUpdating]);

  return {
    reactions,
    userReactions,
    isUpdating,
    handleReaction
  };
}

export default useReactions;
