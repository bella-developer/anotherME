import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as commentService from '../services/commentService';

// Initial state
const initialState = {
  comments: [],
  loading: false,
  error: null,
  pagination: {
    cursor: null,
    hasMore: true,
  },
};

// Async thunks

// Fetch comments for a post
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ postId, cursor } = {}, { rejectWithValue }) => {
    try {
      const response = await commentService.fetchComments({ postId, cursor });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch comments');
    }
  }
);

// Create new comment
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await commentService.createComment(postId, content);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create comment');
    }
  }
);

// Create reply to a comment
export const createReply = createAsyncThunk(
  'comments/createReply',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await commentService.createReply(commentId, content);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create reply');
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete comment');
    }
  }
);

// Comments slice
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Reset comments (for new post)
    resetComments: (state) => {
      state.comments = [];
      state.pagination = {
        cursor: null,
        hasMore: true,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        // Append new comments to existing list (for pagination)
        state.comments = [...state.comments, ...action.payload.comments];
        state.pagination = {
          cursor: action.payload.cursor,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        // Add new comment to the beginning of the list
        state.comments = [action.payload, ...state.comments];
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create reply
      .addCase(createReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReply.fulfilled, (state, action) => {
        state.loading = false;
        // Add new reply to the list
        // The reply will be positioned correctly by the CommentThread component
        state.comments = [...state.comments, action.payload];
      })
      .addCase(createReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        // Remove comment from the list
        state.comments = state.comments.filter((comment) => comment.id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError, resetComments } = commentsSlice.actions;

// Selectors
export const selectComments = (state) => state.comments.comments;
export const selectCommentsLoading = (state) => state.comments.loading;
export const selectCommentsError = (state) => state.comments.error;
export const selectCommentsPagination = (state) => state.comments.pagination;

// Export reducer
export default commentsSlice.reducer;
