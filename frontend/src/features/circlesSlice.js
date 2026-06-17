import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as circleService from '../services/circleService';

// Initial state
const initialState = {
  circles: [],
  currentCircle: null,
  loading: false,
  error: null,
  pagination: {
    cursor: null,
    hasMore: true,
  },
  searchQuery: '',
  // Cache metadata
  cache: {
    lastFetch: null,
    ttl: 300000, // 5 minutes in milliseconds
  },
};

// Async thunks

// Fetch circles with optional pagination
export const fetchCircles = createAsyncThunk(
  'circles/fetchCircles',
  async ({ cursor, forceRefresh = false } = {}, { rejectWithValue, getState }) => {
    try {
      // Check cache if not forcing refresh and no cursor (first page)
      if (!forceRefresh && !cursor) {
        const state = getState();
        const { lastFetch, ttl } = state.circles.cache;
        const now = Date.now();
        
        // If cache is still valid, skip fetch
        if (lastFetch && (now - lastFetch) < ttl && state.circles.circles.length > 0) {
          return {
            circles: [],
            cursor: state.circles.pagination.cursor,
            hasMore: state.circles.pagination.hasMore,
            cached: true,
          };
        }
      }

      const response = await circleService.fetchCircles({ cursor });
      return { ...response, cached: false };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch circles');
    }
  }
);

// Search circles by name
export const searchCircles = createAsyncThunk(
  'circles/searchCircles',
  async ({ query, cursor } = {}, { rejectWithValue }) => {
    try {
      const response = await circleService.searchCircles({ query, cursor });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search circles');
    }
  }
);

// Fetch single circle by ID
export const fetchCircleById = createAsyncThunk(
  'circles/fetchCircleById',
  async (circleId, { rejectWithValue }) => {
    try {
      const response = await circleService.fetchCircleById(circleId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch circle');
    }
  }
);

// Create new circle
export const createCircle = createAsyncThunk(
  'circles/createCircle',
  async (circleData, { rejectWithValue }) => {
    try {
      const response = await circleService.createCircle(circleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create circle');
    }
  }
);

// Circles slice
const circlesSlice = createSlice({
  name: 'circles',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Clear current circle
    clearCurrentCircle: (state) => {
      state.currentCircle = null;
    },
    // Reset circles (for new search)
    resetCircles: (state) => {
      state.circles = [];
      state.pagination = {
        cursor: null,
        hasMore: true,
      };
      state.cache.lastFetch = null;
    },
    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    // Invalidate cache
    invalidateCache: (state) => {
      state.cache.lastFetch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch circles
      .addCase(fetchCircles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCircles.fulfilled, (state, action) => {
        state.loading = false;
        // Skip if cached
        if (action.payload.cached) {
          return;
        }
        // Append new circles to existing list (for infinite scroll)
        state.circles = [...state.circles, ...action.payload.circles];
        state.pagination = {
          cursor: action.payload.cursor,
          hasMore: action.payload.hasMore,
        };
        // Update cache timestamp
        state.cache.lastFetch = Date.now();
      })
      .addCase(fetchCircles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search circles
      .addCase(searchCircles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCircles.fulfilled, (state, action) => {
        state.loading = false;
        // Append new circles to existing list (for infinite scroll)
        state.circles = [...state.circles, ...action.payload.circles];
        state.pagination = {
          cursor: action.payload.cursor,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(searchCircles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch circle by ID
      .addCase(fetchCircleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCircleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCircle = action.payload;
      })
      .addCase(fetchCircleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create circle
      .addCase(createCircle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCircle.fulfilled, (state, action) => {
        state.loading = false;
        // Add new circle to the beginning of the list
        state.circles = [action.payload, ...state.circles];
        // Invalidate cache since we have new content
        state.cache.lastFetch = null;
      })
      .addCase(createCircle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError, clearCurrentCircle, resetCircles, setSearchQuery, invalidateCache } = circlesSlice.actions;

// Selectors
export const selectCircles = (state) => state.circles.circles;
export const selectCurrentCircle = (state) => state.circles.currentCircle;
export const selectCirclesLoading = (state) => state.circles.loading;
export const selectCirclesError = (state) => state.circles.error;
export const selectCirclesPagination = (state) => state.circles.pagination;
export const selectSearchQuery = (state) => state.circles.searchQuery;

// Export reducer
export default circlesSlice.reducer;
