import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as postService from '../services/postService';

// Initial state
const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {
    cursor: null,
    hasMore: true,
  },
  // Cache metadata
  cache: {
    lastFetch: null,
    ttl: 180000, // 3 minutes in milliseconds
  },
};

// Async thunks

// Fetch posts with optional filters
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ cursor, circleId, category, forceRefresh = false } = {}, { rejectWithValue, getState }) => {
    try {
      // Check cache if not forcing refresh and no cursor (first page)
      if (!forceRefresh && !cursor) {
        const state = getState();
        const { lastFetch, ttl } = state.posts.cache;
        const now = Date.now();
        
        // If cache is still valid, skip fetch
        if (lastFetch && (now - lastFetch) < ttl && state.posts.posts.length > 0) {
          return {
            posts: [],
            cursor: state.posts.pagination.cursor,
            hasMore: state.posts.pagination.hasMore,
            cached: true,
          };
        }
      }

      const response = await postService.fetchPosts({ cursor, circleId, category });
      return { ...response, cached: false };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch posts');
    }
  }
);

// Fetch single post by ID
export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.fetchPostById(postId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch post');
    }
  }
);

// Create new post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(postData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create post');
    }
  }
);

// Update existing post
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const response = await postService.updatePost(postId, postData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update post');
    }
  }
);

// Delete post
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await postService.deletePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete post');
    }
  }
);

// Add reaction to post
export const addReaction = createAsyncThunk(
  'posts/addReaction',
  async ({ postId, reactionType }, { rejectWithValue }) => {
    try {
      const response = await postService.addReaction(postId, reactionType);
      return { postId, ...response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add reaction');
    }
  }
);

// Remove reaction from post
export const removeReaction = createAsyncThunk(
  'posts/removeReaction',
  async ({ postId, reactionType }, { rejectWithValue }) => {
    try {
      const response = await postService.removeReaction(postId, reactionType);
      return { postId, ...response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove reaction');
    }
  }
);

// Posts slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Clear current post
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    // Reset posts (for new filters)
    resetPosts: (state) => {
      state.posts = [];
      state.pagination = {
        cursor: null,
        hasMore: true,
      };
      state.cache.lastFetch = null;
    },
    // Invalidate cache
    invalidateCache: (state) => {
      state.cache.lastFetch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        // Skip if cached
        if (action.payload.cached) {
          return;
        }
        // Deduplicate posts by ID before appending
        const existingIds = new Set(state.posts.map(p => p.id));
        const newPosts = action.payload.posts.filter(p => !existingIds.has(p.id));
        
        // Append only new posts to existing list (for infinite scroll)
        state.posts = [...state.posts, ...newPosts];
        state.pagination = {
          cursor: action.payload.cursor,
          hasMore: action.payload.hasMore,
        };
        // Update cache timestamp
        state.cache.lastFetch = Date.now();
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        // Add new post to the beginning of the list
        state.posts = [action.payload, ...state.posts];
        // Invalidate cache since we have new content
        state.cache.lastFetch = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        // Update post in the list
        const index = state.posts.findIndex((post) => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        // Update current post if it's the same
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        // Remove post from the list
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        // Clear current post if it's the deleted one
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add reaction
      .addCase(addReaction.fulfilled, (state, action) => {
        // Update reactions in the post list
        const index = state.posts.findIndex((post) => post.id === action.payload.postId);
        if (index !== -1 && action.payload.reactions) {
          state.posts[index].reactions = action.payload.reactions;
        }
        // Update current post reactions
        if (state.currentPost?.id === action.payload.postId && action.payload.reactions) {
          state.currentPost.reactions = action.payload.reactions;
        }
      })

      // Remove reaction
      .addCase(removeReaction.fulfilled, (state, action) => {
        // Update reactions in the post list
        const index = state.posts.findIndex((post) => post.id === action.payload.postId);
        if (index !== -1 && action.payload.reactions) {
          state.posts[index].reactions = action.payload.reactions;
        }
        // Update current post reactions
        if (state.currentPost?.id === action.payload.postId && action.payload.reactions) {
          state.currentPost.reactions = action.payload.reactions;
        }
      });
  },
});

// Export actions
export const { clearError, clearCurrentPost, resetPosts, invalidateCache } = postsSlice.actions;

// Selectors
export const selectPosts = (state) => state.posts.posts;
export const selectCurrentPost = (state) => state.posts.currentPost;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectPostsPagination = (state) => state.posts.pagination;

// Export reducer
export default postsSlice.reducer;
