import { createSlice } from '@reduxjs/toolkit';
import soundscape from '../utils/soundscapeAudio';

const safeGetJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  isPatron: true, // Free app - all features unlocked
  patronTier: 'lifetime',
  patronSince: localStorage.getItem('eso_sanctuary_since') || new Date().toISOString(),
  theme: localStorage.getItem('eso_sanctuary_theme') || 'obsidian',
  isMembershipModalOpen: false,
  isAudioDockOpen: false,
  currentTrack: 'rain',
  isPlaying: false,
  volume: Number(localStorage.getItem('eso_soundscape_volume') || 0.5),
  vaultBookmarks: safeGetJSON('eso_vault_bookmarks', []),
  vaultDrafts: safeGetJSON('eso_vault_drafts', []),
};

export const sanctuarySlice = createSlice({
  name: 'sanctuary',
  initialState,
  reducers: {
    openMembershipModal: (state) => {
      // Free app mode - pass modal is disabled
      state.isMembershipModalOpen = false;
    },
    closeMembershipModal: (state) => {
      state.isMembershipModalOpen = false;
    },
    upgradeToPatron: (state, action) => {
      const tier = action.payload?.tier || 'monthly';
      const now = new Date().toISOString();
      const token = action.payload?.token || `eso_pass_${Date.now()}`;
      state.isPatron = true;
      state.patronTier = tier;
      state.patronSince = now;
      state.isMembershipModalOpen = false;

      localStorage.setItem('eso_sanctuary_patron', 'true');
      localStorage.setItem('eso_sanctuary_tier', tier);
      localStorage.setItem('eso_sanctuary_since', now);
      localStorage.setItem('eso_pass_token', token);
    },
    cancelPatron: (state) => {
      state.isPatron = false;
      state.patronTier = 'none';
      state.patronSince = null;
      localStorage.removeItem('eso_sanctuary_patron');
      localStorage.removeItem('eso_sanctuary_tier');
      localStorage.removeItem('eso_sanctuary_since');
      localStorage.removeItem('eso_pass_token');
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('eso_sanctuary_theme', action.payload);
      document.documentElement.setAttribute('data-sanctuary-theme', action.payload);
    },
    toggleAudioDock: (state) => {
      state.isAudioDockOpen = !state.isAudioDockOpen;
    },
    setAudioDockOpen: (state, action) => {
      state.isAudioDockOpen = action.payload;
    },
    setSoundscapeTrack: (state, action) => {
      state.currentTrack = action.payload;
      if (state.isPlaying) {
        soundscape.play(action.payload);
      }
    },
    setSoundscapePlaying: (state, action) => {
      state.isPlaying = action.payload;
      if (action.payload) {
        soundscape.play(state.currentTrack);
      } else {
        soundscape.stop();
      }
    },
    toggleSoundscape: (state) => {
      state.isPlaying = !state.isPlaying;
      if (state.isPlaying) {
        soundscape.play(state.currentTrack);
      } else {
        soundscape.stop();
      }
    },
    setSoundscapeVolume: (state, action) => {
      state.volume = action.payload;
      soundscape.setVolume(action.payload);
      localStorage.setItem('eso_soundscape_volume', String(action.payload));
    },
    toggleBookmark: (state, action) => {
      const post = action.payload;
      if (!post || !post.id) return;
      
      const existingIdx = state.vaultBookmarks.findIndex((b) => b.id === post.id);
      if (existingIdx >= 0) {
        state.vaultBookmarks.splice(existingIdx, 1);
      } else {
        state.vaultBookmarks.unshift({
          id: post.id,
          title: post.title || null,
          content: post.content || '',
          room: post.room || 'dark',
          category: post.category || 'THOUGHT',
          author: post.author?.username || post.authorId?.username || 'Quiet Soul',
          commentCount: post.commentCount || 0,
          reactions: post.reactions || {},
          image: post.image || null,
          createdAt: post.createdAt || new Date().toISOString(),
          savedAt: new Date().toISOString(),
        });
      }
      localStorage.setItem('eso_vault_bookmarks', JSON.stringify(state.vaultBookmarks));
    },
    saveDraft: (state, action) => {
      const draft = action.payload;
      if (!draft) return;
      const id = draft.id || `draft_${Date.now()}`;
      const existingIdx = state.vaultDrafts.findIndex((d) => d.id === id);
      const updatedDraft = {
        ...draft,
        id,
        updatedAt: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        state.vaultDrafts[existingIdx] = updatedDraft;
      } else {
        state.vaultDrafts.unshift(updatedDraft);
      }
      localStorage.setItem('eso_vault_drafts', JSON.stringify(state.vaultDrafts));
    },
    deleteDraft: (state, action) => {
      const draftId = action.payload;
      state.vaultDrafts = state.vaultDrafts.filter((d) => d.id !== draftId);
      localStorage.setItem('eso_vault_drafts', JSON.stringify(state.vaultDrafts));
    },
  },
});

export const {
  openMembershipModal,
  closeMembershipModal,
  upgradeToPatron,
  cancelPatron,
  setTheme,
  toggleAudioDock,
  setAudioDockOpen,
  setSoundscapeTrack,
  setSoundscapePlaying,
  toggleSoundscape,
  setSoundscapeVolume,
  toggleBookmark,
  saveDraft,
  deleteDraft,
} = sanctuarySlice.actions;

export default sanctuarySlice.reducer;
