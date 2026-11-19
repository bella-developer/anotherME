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

function stripHtml(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export default function SanctuaryVault() {
  usePageTitle('Saved');
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
      const plainContent = stripHtml(b.content).toLowerCase();
      const matchQuery =
        !searchQuery ||
        (b.title && b.title.toLowerCase().includes(q)) ||
        plainContent.includes(q);
      return matchRoom && matchQuery;
    });
  }, [vaultBookmarks, selectedRoom, searchQuery]);

  // Filtered drafts
  const filteredDrafts = useMemo(() => {
    return vaultDrafts.filter((d) => {
      const matchRoom = selectedRoom === 'all' || d.room === selectedRoom;
      const q = searchQuery.toLowerCase();
      const plainContent = stripHtml(d.content).toLowerCase();
      const matchQuery =
        !searchQuery ||
        (d.title && d.title.toLowerCase().includes(q)) ||
        plainContent.includes(q);
      return matchRoom && matchQuery;
    });
  }, [vaultDrafts, selectedRoom, searchQuery]);

  const handleExport = () => {
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
    a.download = `eso-saved-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast('Saved posts exported.', 'success');
  };

  const rooms = [
    { id: 'all', label: 'All' },
    { id: 'dark', label: 'Dark' },
    { id: 'fantasy', label: 'Fantasy' },
    { id: 'philo', label: 'Philo' },
  ];

  return (
    <Layout leftSidebar={null} rightSidebar={null}>
      <div className="bg-transparent text-white min-h-[calc(100vh-3rem)] pb-16 pt-3 sm:pt-5">
        <div className="max-w-xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#21262d]">
            <div>
              <h1 className="text-base font-semibold text-[#e6edf3]">Saved</h1>
              <p className="text-xs text-[#8b949e] mt-0.5">
                Your bookmarks and drafts
              </p>
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] border border-[#21262d] hover:border-[#30363d] transition-colors"
              title="Export as JSON"
            >
              <Download size={12} />
              <span>Export</span>
            </button>
          </div>

          {/* Subheader: Tabs & Room Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
            {/* Tabs */}
            <div className="flex border border-[#21262d] rounded p-0.5 bg-[rgba(255,255,255,0.02)]">
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

            {/* Room Filters */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {rooms.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRoom(r.id)}
                  className={`px-2.5 py-0.5 rounded text-xs font-mono transition-colors ${
                    selectedRoom === r.id
                      ? 'bg-[#21262d] text-[#e6edf3] border border-[#30363d]'
                      : 'text-[#6e7681] hover:text-[#8b949e] border border-transparent'
                  }`}
                >
                  {r.label}
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
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded text-xs font-mono text-[#e6edf3] placeholder-[#484f58] border transition-colors focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }}
            />
          </div>

          {/* List Content */}
          {activeTab === 'bookmarks' ? (
            <div>
              {filteredBookmarks.length === 0 ? (
                <div
                  className="rounded-lg p-6 text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <p className="text-xs font-mono text-[#8b949e]">
                    {searchQuery
                      ? 'No bookmarks match your search.'
                      : 'No bookmarks yet. Bookmark posts you like to see them here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredBookmarks.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-lg p-3.5 sm:p-4 transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-white/[0.06]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-mono text-[#8b949e] border border-white/[0.08] px-1.5 py-0.2 rounded">
                            {item.room || 'post'}
                          </span>
                          {item.category && (
                            <span className="text-[10px] font-mono text-[#6e7681]">
                              &bull; {item.category}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-[#6e7681]">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : ''}
                        </span>
                      </div>

                      {item.title && (
                        <h3 className="text-sm font-sans font-medium text-white mb-1">
                          {item.title}
                        </h3>
                      )}

                      <p className="text-xs font-sans text-neutral-300 leading-relaxed line-clamp-3 mb-2.5">
                        {stripHtml(item.content)}
                      </p>

                      <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
                        <button
                          type="button"
                          onClick={() => navigate(`/posts/${item.id}`)}
                          className="flex items-center gap-1 text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] transition-colors"
                        >
                          <ExternalLink size={11} />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(toggleBookmark(item));
                            addToast('Removed from saved.', 'info');
                          }}
                          className="flex items-center gap-1 text-xs font-mono text-[#6e7681] hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={11} />
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
                  className="rounded-lg p-6 text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <p className="text-xs font-mono text-[#8b949e]">
                    {searchQuery ? 'No drafts match your search.' : 'No drafts saved.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredDrafts.map((draft) => (
                    <article
                      key={draft.id}
                      className="rounded-lg p-3.5 sm:p-4 transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-white/[0.06]">
                        <span className="text-[10px] uppercase font-mono text-[#8b949e] border border-white/[0.08] px-1.5 py-0.2 rounded">
                          {draft.room || 'draft'}
                        </span>
                        <span className="text-[10px] font-mono text-[#6e7681]">
                          {draft.updatedAt
                            ? new Date(draft.updatedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>

                      {draft.title && (
                        <h3 className="text-sm font-sans font-medium text-white mb-1">
                          {draft.title}
                        </h3>
                      )}

                      <p className="text-xs font-sans text-neutral-300 leading-relaxed line-clamp-3 mb-2.5">
                        {stripHtml(draft.content)}
                      </p>

                      <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
                        <button
                          type="button"
                          onClick={() => navigate('/create')}
                          className="flex items-center gap-1 text-xs font-mono text-[#8b949e] hover:text-[#e6edf3] transition-colors"
                        >
                          <PenTool size={11} />
                          <span>Open in editor</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(deleteDraft(draft.id));
                            addToast('Draft deleted.', 'info');
                          }}
                          className="flex items-center gap-1 text-xs font-mono text-[#6e7681] hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={11} />
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
