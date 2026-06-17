import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import postsReducer from '../features/postsSlice';
import circlesReducer from '../features/circlesSlice';
import commentsReducer from '../features/commentsSlice';
import userReducer from '../features/userSlice';

// Root reducer
const rootReducer = {
  auth: authReducer,
  posts: postsReducer,
  circles: circlesReducer,
  comments: commentsReducer,
  user: userReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
