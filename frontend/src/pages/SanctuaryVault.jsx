import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  FileText,
  Trash2,
  ExternalLink,
  Download,
  Search,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import Layout from '../components/Layout';
import { toggleBookmark, deleteDraft, openMembershipModal } from '../features/sanctuarySlice';
import { useToast } from '../contexts/ToastContext';

export default function SanctuaryVault() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { vaultBookmarks, vaultDrafts, isPatron } = useSelector((state) => state.sanctuary);

  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' | 'drafts'
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered bookmarks
  const filteredBookmarks = useMemo(() => {
    return vaultBookmarks.filter((b) => {
      const matchRoom = selectedRoom === 'all' || b.room === selectedRoom;
      const matchQuery =
        !searchQuery ||
        (b.title && b.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.content && b.content.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRoom && matchQuery;
    });
  }, [vaultBookmarks, selectedRoom, searchQuery]);

  // Filtered drafts
  const filteredDrafts = useMemo(() => {
    return vaultDrafts.filter((d) => {
      const matchRoom = selectedRoom === 'all' || d.room === selectedRoom;
      const matchQuery =
        !searchQuery ||
        (d.title && d.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.content && d.content.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRoom && matchQuery;
    });
  }, [vaultDrafts, selectedRoom, searchQuery]);

  // Export Vault Data as JSON
  const handleExportVault = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      bookmarks: vaultBookmarks,
      drafts: vaultDrafts,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eso-sanctuary-vault-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Vault Exported',
      message: 'Your quiet reflections have been downloaded.',
    });
  };

  return (
    <Layout leftSidebar={null} rightSidebar={null}>
      <div
        className="min-h-screen text-white pt-14 sm:pt-16 pb-20 relative"
        style={{
          background: 'radial-gradient(circle at 50% 10%, rgba(20, 22, 28, 1) 0%, rgba(5, 5, 8, 1) 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-lg bg-[#D97757]/20 text-[#D97757]">
                  <Shield size={16} />
                </div>
                <span className="text-[11px] uppercase tracking-widest text-[#D97757] font-semibold">
                  Private Sanctuary Vault
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white/95">
                Your Quiet Archive
              </h1>
              <p className="text-xs sm:text-sm text-white/50 mt-1">
                Solitary thoughts, bookmarked reflections, and unpublished drafts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportVault}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-white/80 transition-colors"
                title="Export entire vault to JSON"
              >
                <Download size={13} />
                <span>Export Vault</span>
              </button>

              <button
                onClick={() => navigate('/create')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D97757] hover:bg-[#c66a4c] text-xs font-semibold text-white transition-all shadow-md"
              >
                <Sparkles size={13} />
                <span>Write New</span>
              </button>
            </div>
          </div>

          {/* Patron Banner if free user */}
          {!isPatron && (
            <div
              className="mb-8 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: 'rgba(217, 119, 87, 0.08)',
                borderColor: 'rgba(217, 119, 87, 0.25)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D97757]/20 text-[#D97757] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-white/90">
                    Unlock Unlimited Sanctuary Vault & Cloud Sync
                  </h2>
                  <p className="text-[11px] text-white/60">
                    With the Sanctuary Pass, your vault gains offline audio accompaniment, custom aura seals, and permanent archives.
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch(openMembershipModal())}
                className="flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-300 via-[#D97757] to-amber-400 text-black shadow-md hover:opacity-90 transition-opacity"
              >
                Explore Pass
              </button>
            </div>
          )}

          {/* Navigation Controls: Tabs & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Tabs */}
            <div className="inline-flex p-1 rounded-2xl bg-white/5 border border-white/10">
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'bookmarks'
                    ? 'bg-white/15 text-white font-semibold shadow-sm'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <Bookmark size={13} />
                <span>Bookmarks ({vaultBookmarks.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'drafts'
                    ? 'bg-white/15 text-white font-semibold shadow-sm'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <FileText size={13} />
                <span>Drafts ({vaultDrafts.length})</span>
              </button>
            </div>

            {/* Room Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Rooms' },
                { id: 'dark', label: 'Dark Room' },
                { id: 'fantasy', label: 'Fantasy' },
                { id: 'philo', label: 'Philo' },
              ].map((rf) => (
                <button
                  key={rf.id}
                  onClick={() => setSelectedRoom(rf.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors border ${
                    selectedRoom === rf.id
                      ? 'border-white/30 text-white bg-white/10'
                      : 'border-transparent text-white/45 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder={`Search in your ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/90 placeholder-white/30 focus:outline-none focus:border-white/30"
            />
          </div>

          {/* List Content */}
          <div className="space-y-4">
            {activeTab === 'bookmarks' ? (
              filteredBookmarks.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl p-8">
                  <Bookmark size={36} className="mx-auto text-white/20 mb-3" />
                  <h3 className="text-sm font-semibold text-white/80 mb-1">
                    No Bookmarked Thoughts Yet
                  </h3>
                  <p className="text-xs text-white/40 max-w-sm mx-auto mb-4">
                    While browsing the Dark Room, Fantasy Room, or Philo Room, click the bookmark icon on any post to preserve it in your private vault.
                  </p>
                  <button
                    onClick={() => navigate('/home')}
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-white transition-colors"
                  >
                    Explore Rooms
                  </button>
                </div>
              ) : (
                filteredBookmarks.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all flex flex-col gap-3 group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-white/40">
                      <div className="flex items-center gap-2">
                        <span className="uppercase tracking-widest text-[#D97757] font-semibold">
                          {item.room} Room
                        </span>
                        <span>&bull;</span>
                        <span>{item.category}</span>
                        <span>&bull;</span>
                        <span>by {item.author}</span>
                      </div>
                      <button
                        onClick={() => {
                          dispatch(toggleBookmark(item));
                          addToast({
                            type: 'info',
                            title: 'Removed from Vault',
                            message: 'Thought removed from bookmarks.',
                          });
                        }}
                        className="p-1 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove from vault"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {item.title && (
                      <h4 className="text-base font-semibold text-white/95">
                        {item.title}
                      </h4>
                    )}

                    <p className="text-xs text-white/70 leading-relaxed font-serif line-clamp-3">
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[10px] text-white/30">
                        Saved on {new Date(item.savedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => navigate(`/posts/${item.id}`)}
                        className="flex items-center gap-1 text-xs text-[#D97757] hover:underline"
                      >
                        <span>View Discussion</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              filteredDrafts.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl p-8">
                  <FileText size={36} className="mx-auto text-white/20 mb-3" />
                  <h3 className="text-sm font-semibold text-white/80 mb-1">
                    No Drafts Stored
                  </h3>
                  <p className="text-xs text-white/40 max-w-sm mx-auto mb-4">
                    Any words you compose in the Sanctuary Studio are automatically saved to your drafts vault.
                  </p>
                  <button
                    onClick={() => navigate('/create')}
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-[#D97757] hover:bg-[#c66a4c] text-white transition-colors"
                  >
                    Open Sanctuary Studio
                  </button>
                </div>
              ) : (
                filteredDrafts.map((draft) => (
                  <motion.div
                    key={draft.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all flex flex-col gap-3 group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-white/40">
                      <span className="uppercase tracking-widest text-[#D97757] font-semibold">
                        {draft.room || 'Dark'} Room Draft
                      </span>
                      <button
                        onClick={() => {
                          dispatch(deleteDraft(draft.id));
                          addToast({
                            type: 'info',
                            title: 'Draft Deleted',
                            message: 'Draft removed from vault.',
                          });
                        }}
                        className="p-1 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h4 className="text-sm font-semibold text-white/90">
                      {draft.title || 'Untitled Draft'}
                    </h4>

                    <p className="text-xs text-white/70 leading-relaxed font-serif line-clamp-3">
                      {draft.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[10px] text-white/30">
                        Updated {new Date(draft.updatedAt).toLocaleTimeString()}
                      </span>
                      <button
                        onClick={() => navigate('/create')}
                        className="flex items-center gap-1 text-xs text-[#D97757] font-medium hover:underline"
                      >
                        <span>Continue Writing</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
