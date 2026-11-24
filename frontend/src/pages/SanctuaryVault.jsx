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
      <div className="bg-transparent text-[#E7DED5] min-h-[calc(100vh-3rem)] pb-16 pt-3 sm:pt-5 font-mono">
        <div className="max-w-xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#292630]">
            <div>
              <h1 className="text-base font-semibold text-[#E7DED5]">Saved</h1>
              <p className="text-xs text-[#928B91] mt-0.5">
                Your bookmarks and drafts
              </p>
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[#928B91] hover:text-[#E7DED5] border border-[#292630] hover:border-[#D77A35] transition-colors"
              title="Export as JSON"
            >
              <Download size={12} />
              <span>Export</span>
            </button>
          </div>

          {/* Subheader: Tabs & Room Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
            {/* Tabs */}
            <div className="flex border border-[#292630] rounded p-0.5 bg-[#111117]">
              <button
                type="button"
                onClick={() => setActiveTab('bookmarks')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeTab === 'bookmarks'
                    ? 'bg-[#292630] text-[#E7DED5] font-medium'
                    : 'text-[#928B91] hover:text-[#E7DED5]'
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
                    ? 'bg-[#292630] text-[#E7DED5] font-medium'
                    : 'text-[#928B91] hover:text-[#E7DED5]'
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
                      ? 'bg-[#292630] text-[#E7DED5] border border-[#D77A35]'
                      : 'text-[#928B91] hover:text-[#E7DED5] border border-transparent'
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#928B91]"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded text-xs font-mono text-[#E7DED5] placeholder-[#928B91] border border-[#292630] bg-[#111117] transition-colors focus:outline-none focus:border-[#D77A35]"
            />
          </div>

          {/* List Content */}
          {activeTab === 'bookmarks' ? (
            <div>
              {filteredBookmarks.length === 0 ? (
                <div
                  className="rounded-lg p-6 text-center border border-[#292630] bg-[#191820]"
                >
                  <p className="text-xs font-mono text-[#928B91]">
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
                      className="rounded-lg p-3.5 sm:p-4 transition-all border border-[#292630] bg-[#191820]"
                    >
                      <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-[#292630]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-mono text-[#928B91] border border-[#292630] px-1.5 py-0.2 rounded">
                            {item.room || 'post'}
                          </span>
                          {item.category && (
                            <span className="text-[10px] font-mono text-[#928B91]">
                              &bull; {item.category}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-[#928B91]">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : ''}
                        </span>
                      </div>

                      {item.title && (
                        <h3 className="text-sm font-mono font-medium text-[#E7DED5] mb-1">
                          {item.title}
                        </h3>
                      )}

                      <p className="text-xs font-mono text-[#E7DED5] leading-relaxed line-clamp-3 mb-2.5">
                        {stripHtml(item.content)}
                      </p>

                      <div className="flex items-center justify-between pt-1.5 border-t border-[#292630]">
                        <button
                          type="button"
                          onClick={() => navigate(`/posts/${item.id}`)}
                          className="flex items-center gap-1 text-xs font-mono text-[#928B91] hover:text-[#E7DED5] transition-colors"
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
                          className="flex items-center gap-1 text-xs font-mono text-[#928B91] hover:text-red-400 transition-colors"
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
                  className="rounded-lg p-6 text-center border border-[#292630] bg-[#191820]"
                >
                  <p className="text-xs font-mono text-[#928B91]">
                    {searchQuery ? 'No drafts match your search.' : 'No drafts saved.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredDrafts.map((draft) => (
                    <article
                      key={draft.id}
                      className="rounded-lg p-3.5 sm:p-4 transition-all border border-[#292630] bg-[#191820]"
                    >
                      <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-[#292630]">
                        <span className="text-[10px] uppercase font-mono text-[#928B91] border border-[#292630] px-1.5 py-0.2 rounded">
                          {draft.room || 'draft'}
                        </span>
                        <span className="text-[10px] font-mono text-[#928B91]">
                          {draft.updatedAt
                            ? new Date(draft.updatedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>

                      {draft.title && (
                        <h3 className="text-sm font-mono font-medium text-[#E7DED5] mb-1">
                          {draft.title}
                        </h3>
                      )}

                      <p className="text-xs font-mono text-[#E7DED5] leading-relaxed line-clamp-3 mb-2.5">
                        {stripHtml(draft.content)}
                      </p>

                      <div className="flex items-center justify-between pt-1.5 border-t border-[#292630]">
                        <button
                          type="button"
                          onClick={() => navigate('/create')}
                          className="flex items-center gap-1 text-xs font-mono text-[#928B91] hover:text-[#E7DED5] transition-colors"
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
                          className="flex items-center gap-1 text-xs font-mono text-[#928B91] hover:text-red-400 transition-colors"
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
