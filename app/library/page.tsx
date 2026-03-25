'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBookmark, FaBook, FaTimes, FaTrash } from 'react-icons/fa';
import { useAuth } from '@/lib/auth-context';
import { 
  getAllUserBooks, 
  getUserFavoriteBooks, 
  getUserReadBooks,
  deleteMultipleUserBooks,
} from '@/lib/supabase';
import BookCard from '@/components/books/BookCard';
import type { Book } from '@/lib/types';

type TabType = 'all' | 'favorites' | 'read';
type SortType = 'date-newest' | 'date-oldest' | 'title' | 'rating';
type FilterType = 'all' | 'favorites-only' | 'unread-only';

export default function LibraryPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date-newest');
  const [filterBy, setFilterBy] = useState<FilterType>('all');
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookIds, setSelectedBookIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!profile) return;

    const loadBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        let data: any[] = [];

        if (activeTab === 'all') {
          data = await getAllUserBooks(profile.user_id);
        } else if (activeTab === 'favorites') {
          data = await getUserFavoriteBooks(profile.user_id);
        } else if (activeTab === 'read') {
          data = await getUserReadBooks(profile.user_id);
        }

        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading library:', err);
        setError('Unable to load your library. Please try again.');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [profile, activeTab]);

  useEffect(() => {
    let result = books || [];

    // Status filtering
    if (filterBy === 'favorites-only') {
      result = result.filter((item) => item.is_favorite === true);
    } else if (filterBy === 'unread-only') {
      result = result.filter((item) => item.is_read === false);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const book = item.book || item;
        return (
          (book.title && book.title.toLowerCase().includes(query)) ||
          (book.description && book.description.toLowerCase().includes(query))
        );
      });
    }

    // Sort
    switch (sortBy) {
      case 'title':
        result.sort((a, b) => {
          const titleA = (a.book?.title || a.title || '').toLowerCase();
          const titleB = (b.book?.title || b.title || '').toLowerCase();
          return titleA.localeCompare(titleB);
        });
        break;
      case 'rating':
        result.sort((a, b) => {
          const ratingA = (a.book?.stats?.average_rating || 0);
          const ratingB = (b.book?.stats?.average_rating || 0);
          return ratingB - ratingA;
        });
        break;
      case 'date-oldest':
        result.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
        break;
      case 'date-newest':
      default:
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
    }

    setFilteredBooks(result);
  }, [books, searchQuery, sortBy, filterBy]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">My Library</h1>
            <p className="text-neutral-600 mb-6">Sign in to view your library.</p>
            <button
              onClick={() => router.push('/auth/signin')}
              className="btn btn-primary"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'all':
        return `All Books (${books.length})`;
      case 'favorites':
        return `Favorites (${books.length})`;
      case 'read':
        return `Read (${books.length})`;
      default:
        return tab;
    }
  };

  const handleToggleSelect = (bookId: number) => {
    const newSelected = new Set(selectedBookIds);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBookIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedBookIds.size === filteredBooks.length) {
      setSelectedBookIds(new Set());
    } else {
      const allIds = new Set(
        filteredBooks.map((item) => {
          const book = item.book || item;
          return book.book_id;
        })
      );
      setSelectedBookIds(allIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBookIds.size === 0) return;
    if (!confirm(`Delete ${selectedBookIds.size} book(s) from your library?`)) return;

    setIsDeleting(true);
    try {
      const bookIds = Array.from(selectedBookIds);
      await deleteMultipleUserBooks(profile.user_id, bookIds);
      setBooks((prev) =>
        prev.filter((item) => {
          const book = item.book || item;
          return !bookIds.includes(book.book_id);
        })
      );
      setSelectedBookIds(new Set());
      alert('Books removed from your library.');
    } catch (err) {
      console.error('Error deleting books:', err);
      alert('Failed to remove books.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">My Library</h1>
          <p className="text-neutral-600">
            Manage your book collection, favorites, and reading status
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'favorites', 'read'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {tab === 'all' && '📚'} {tab === 'favorites' && '⭐'} {tab === 'read' && '✓'}{' '}
                {getTabLabel(tab)}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search your books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="col-span-1 sm:col-span-1 lg:col-span-2 border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date-newest">Newest First</option>
              <option value="date-oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => setFilterBy('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterBy === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              📚 All Books
            </button>
            <button
              onClick={() => setFilterBy('favorites-only')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterBy === 'favorites-only'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              ⭐ Favorites Only
            </button>
            <button
              onClick={() => setFilterBy('unread-only')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterBy === 'unread-only'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              📖 Unread Only
            </button>
          </div>

          {selectedBookIds.size > 0 && (
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={selectedBookIds.size === filteredBooks.length && filteredBooks.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-neutral-900">
                {selectedBookIds.size} selected
              </span>
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="ml-auto btn btn-error text-white flex items-center gap-2"
              >
                <FaTrash className="w-4 h-4" />
                {isDeleting ? 'Removing...' : 'Remove Selected'}
              </button>
            </div>
          )}

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-primary-500 hover:text-primary-600 font-medium flex items-center gap-2"
            >
              <FaTimes className="w-4 h-4" />
              Clear Search
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card h-80 animate-pulse bg-neutral-100" />
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-neutral-600">
              Showing <span className="font-bold">{filteredBooks.length}</span> book
              {filteredBooks.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBooks.map((item) => {
                const book = item.book || item;
                if (!book.book_id) return null;

                const isSelected = selectedBookIds.has(book.book_id);

                return (
                  <div key={`${activeTab}-${book.book_id}`} className="relative">
                    <div className="absolute top-2 left-2 z-10 flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(book.book_id)}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                    <div className={`${isSelected ? 'opacity-75 ring-2 ring-primary-500' : ''} rounded-lg overflow-hidden`}>
                      <BookCard book={book as Book} />
                    </div>
                    {/* Status Badges */}
                    <div className="flex gap-2 mt-2">
                      {item.is_favorite && (
                        <span className="badge badge-secondary flex items-center gap-1">
                          <FaBookmark className="w-3 h-3" /> Favorite
                        </span>
                      )}
                      {item.is_read && (
                        <span className="badge badge-success flex items-center gap-1">
                          <FaBook className="w-3 h-3" /> Read
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-900 mb-2">No books yet</h3>
            <p className="text-neutral-600 mb-6">
              {activeTab === 'favorites' && "You haven't added any favorite books yet."}
              {activeTab === 'read' && "You haven't marked any books as read yet."}
              {activeTab === 'all' && "Your library is empty. Start adding books!"}
            </p>
            <button
              onClick={() => router.push('/books')}
              className="btn btn-primary"
            >
              Explore Books
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
