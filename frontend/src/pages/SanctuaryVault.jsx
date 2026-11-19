import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  FileText,
  Trash2,
  ExternalLink,
  Download,
  Search,
  PenTool,
} from 'lucide-react';
import Layout from '../components/Layout';
import { toggleBookmark, deleteDraft } from '../features/sanctuarySlice';
import { useToast } from '../contexts/ToastContext';
import { usePageTitle } from '../hooks/usePageTitle';

export default function SanctuaryVault() {
  usePageTitle('Sanctuary Vault');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { vaultBookmarks = [], vaultDrafts = [] } = useSelector(
    (state) => state.sanctuary
  );

  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' | 'drafts'
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered bookmarks
  const filteredBookmarks = useMemo(() => {
    return vaultBookmarks.filter((b) => {
      const matchRoom = selectedRoom === 'all' || b.room === selectedRoom;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !searchQuery ||
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.content && b.content.toLowerCase().includes(q));
      return matchRoom && matchQuery;
    });
  }, [vaultBookmarks, selectedRoom, searchQuery]);

  // Filtered drafts
  const filteredDrafts = useMemo(() => {
    return vaultDrafts.filter((d) => {
      const matchRoom = selectedRoom === 'all' || d.room === selectedRoom;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !searchQuery ||
        (d.title && d.title.toLowerCase().includes(q)) ||
        (d.content && d.content.toLowerCase().includes(q));
      return matchRoom && matchQuery;
    });
  }, [vaultDrafts, selectedRoom, searchQuery]);

  // Export Vault Data
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

  const roomFilters = [
    { id: 'all', label: 'All' },
    { id: 'dark', label: 'Dark' },
    { id: 'fantasy', label: 'Fantasy' },
    { id: 'philo', label: 'Philosophy' },
  ];

  return (
    <Layout leftSidebar={null} rightSidebar={null}>
      <div className="bg-transparent text-white min-h-[calc(100vh-3rem)] pb-20 pt-2 sm:pt-4">
        {/* Centered Container matching App UI Philosophy */}
        <div className="max-w-2xl mx-auto px-3 sm:px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#21262d] mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#8b949e] font-mono">
                Sanctuary Vault
              </div>
              <h1 className="text-base sm:text-lg font-medium text-[#e6edf3] font-mono mt-0.5">
                Quiet Archive
              </h1>
              <p className="text-xs text-[#6e7681] font-mono mt-0.5">
                Private bookmarks &amp; unpublished drafts
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportVault}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] border border-[#21262d] hover:border-[#30363d] transition-colors"
                title="Download offline JSON backup"
              >
                <Download size={12} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Subheader: Tabs & Search Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
            {/* Tabs */}
            <div className="flex border border-[#21262d] rounded p-0.5 bg-[rgba(255,255,255,0.02)] self-start">
              <button
                type="button"
                onClick={() => setActiveTab('bookmarks')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeTab === 'bookmarks'
                    ? 'bg-[#21262d] text-[#e6edf3] font-medium'
                    : 'text-[#8b949e] hover:text-[#e6edf3]'
                }`}
              >
                <Bookmark size={11} />
                <span>Bookmarks ({vaultBookmarks.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('drafts')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeTab === 'drafts'
                    ? 'bg-[#21262d] text-[#e6edf3] font-medium'
                    : 'text-[#8b949e] hover:text-[#e6edf3]'
                }`}
              >
                <FileText size={11} />
                <span>Drafts ({vaultDrafts.length})</span>
              </button>
            </div>

            {/* Room filters */}
            <div className="flex items-center gap-1">
              {roomFilters.map((rf) => (
                <button
                  key={rf.id}
                  type="button"
                  onClick={() => setSelectedRoom(rf.id)}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono transition-colors ${
                    selectedRoom === rf.id
                      ? 'bg-[#21262d] text-[#e6edf3] border border-[#30363d]'
                      : 'text-[#6e7681] hover:text-[#8b949e] border border-transparent'
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484f58]"
            />
            <input
              type="text"
              placeholder="Search your vaulted words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded text-xs font-mono text-[#e6edf3] placeholder-[#484f58] border transition-colors focus:outline-none"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderColor: '#21262d',
              }}
            />
          </div>

          {/* Content Feed */}
          {activeTab === 'bookmarks' ? (
            <div>
              {filteredBookmarks.length === 0 ? (
                <div
                  className="rounded-lg border p-8 text-center"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderColor: '#21262d',
                  }}
                >
                  <Bookmark size={20} className="mx-auto text-[#484f58] mb-2" />
                  <p className="text-xs font-mono text-[#8b949e]">
                    {searchQuery
                      ? 'No bookmarks match your search query.'
                      : 'Your vault has no saved thoughts yet. Bookmark reflections in Dark, Fantasy, or Philo rooms to keep them here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookmarks.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-lg border p-4 transition-all"
                      style={{
                        background: 'rgba(0, 0, 0, 0.45)',
                        backdropFilter: 'blur(12px)',
                        borderColor: '#21262d',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#21262d]">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase tracking-wider font-mono text-[#2EE6FF] border border-[#2EE6FF]/30 px-1.5 py-0.2 rounded">
                            {item.room || 'Solitude'}
                          </span>
                          {item.category && (
                            <span className="text-[10px] text-[#6e7681] font-mono">
                              &bull; {item.category}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#6e7681] font-mono">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : 'Saved'}
                        </span>
                      </div>

                      {item.title && (
                        <h3 className="text-sm font-medium text-[#e6edf3] font-mono mb-1.5">
                          {item.title}
                        </h3>
                      )}

                      <p className="text-xs text-[#c9d1d9] font-mono leading-relaxed line-clamp-3 mb-3">
                        {item.content}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-[#21262d]/60">
                        <button
                          type="button"
                          onClick={() => navigate(`/posts/${item.id}`)}
                          className="flex items-center gap-1 text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] transition-colors"
                        >
                          <ExternalLink size={12} />
                          <span>View Full Reflection</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(toggleBookmark(item));
                            addToast('Removed from Vault', 'info');
                          }}
                          className="flex items-center gap-1 text-xs font-mono text-[#6e7681] hover:text-red-400 transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 size={12} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {filteredDrafts.length === 0 ? (
                <div
                  className="rounded-lg border p-8 text-center"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderColor: '#21262d',
                  }}
                >
                  <FileText size={20} className="mx-auto text-[#484f58] mb-2" />
                  <p className="text-xs font-mono text-[#8b949e]">
                    {searchQuery
                      ? 'No drafts match your search query.'
                      : 'No drafts saved yet. Auto-saved and vaulted writing will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDrafts.map((draft) => (
                    <article
                      key={draft.id}
                      className="rounded-lg border p-4 transition-all"
                      style={{
                        background: 'rgba(0, 0, 0, 0.45)',
                        backdropFilter: 'blur(12px)',
                        borderColor: '#21262d',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#21262d]">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase tracking-wider font-mono text-[#8b949e] border border-[#30363d] px-1.5 py-0.2 rounded">
                            {draft.room || 'Draft'}
                          </span>
                          <span className="text-[10px] text-[#6e7681] font-mono">
                            {draft.category || 'Thought'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6e7681] font-mono">
                          {draft.updatedAt
                            ? new Date(draft.updatedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Draft'}
                        </span>
                      </div>

                      {draft.title && (
                        <h3 className="text-sm font-medium text-[#e6edf3] font-mono mb-1.5">
                          {draft.title}
                        </h3>
                      )}

                      <p className="text-xs text-[#c9d1d9] font-mono leading-relaxed line-clamp-3 mb-3">
                        {draft.content}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-[#21262d]/60">
                        <button
                          type="button"
                          onClick={() => navigate('/create')}
                          className="flex items-center gap-1 text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] transition-colors"
                        >
                          <PenTool size={12} />
                          <span>Open in Studio</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(deleteDraft(draft.id));
                            addToast('Draft Deleted', 'info');
                          }}
                          className="flex items-center gap-1 text-xs font-mono text-[#6e7681] hover:text-red-400 transition-colors"
                          title="Delete draft"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
