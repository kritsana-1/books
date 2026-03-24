'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'react-icons/fa';
import BookCard from '@/components/books/BookCard';
import type { Book } from '@/lib/types';

// Mock books data
const MOCK_BOOKS: Book[] = [
  {
    book_id: 1,
    title: 'Atomic Habits',
    isbn: '9780735211292',
    description: 'An easy and proven way to build good habits...',
    cover_image_url: 'https://covers.openlibrary.org/b/id/8247084-M.jpg',
    price: 16.99,
    total_pages: 320,
    publication_date: '2018-10-16',
    language: 'English',
    publisher: 'Penguin Books',
    is_featured: true,
    view_count: 1234,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
    stats: {
      total_likes: 2456,
      total_ratings: 1234,
      average_rating: 4.8,
      total_comments: 567,
      total_owners: 890,
    },
  },
  {
    book_id: 2,
    title: 'The Power of Habit',
    isbn: '9780812981605',
    description: 'Pulitzer Prize winner Charles Duhigg...',
    cover_image_url: 'https://covers.openlibrary.org/b/id/8248849-M.jpg',
    price: 17.99,
    total_pages: 416,
    publication_date: '2012-02-28',
    language: 'English',
    publisher: 'Random House',
    is_featured: true,
    view_count: 987,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
    stats: {
      total_likes: 1987,
      total_ratings: 945,
      average_rating: 4.7,
      total_comments: 432,
      total_owners: 756,
    },
  },
  {
    book_id: 3,
    title: 'Tiny Habits',
    isbn: '9780593539683',
    description: 'The easiest way to build new habits...',
    cover_image_url: 'https://covers.openlibrary.org/b/id/8383166-M.jpg',
    price: 18.99,
    total_pages: 384,
    publication_date: '2020-12-15',
    language: 'English',
    publisher: 'Houghton Mifflin',
    is_featured: false,
    view_count: 654,
    created_at: '2025-12-20T10:00:00Z',
    updated_at: '2025-12-20T10:00:00Z',
    stats: {
      total_likes: 1234,
      total_ratings: 567,
      average_rating: 4.6,
      total_comments: 234,
      total_owners: 456,
    },
  },
  {
    book_id: 4,
    title: 'Sapiens',
    isbn: '9780062316097',
    description: 'A brief history of humankind...',
    cover_image_url: 'https://covers.openlibrary.org/b/id/8247084-M.jpg',
    price: 19.99,
    total_pages: 443,
    publication_date: '2014-09-04',
    language: 'English',
    publisher: 'Harper',
    is_featured: true,
    view_count: 543,
    created_at: '2025-11-15T10:00:00Z',
    updated_at: '2025-11-15T10:00:00Z',
    stats: {
      total_likes: 2123,
      total_ratings: 876,
      average_rating: 4.9,
      total_comments: 345,
      total_owners: 654,
    },
  },
  {
    book_id: 5,
    title: 'Thinking Fast and Slow',
    isbn: '9780374533557',
    description: 'Explores the two systems that drive the way we think...',
    cover_image_url: 'https://covers.openlibrary.org/b/id/8270088-M.jpg',
    price: 18.50,
    total_pages: 512,
    publication_date: '2011-10-25',
    language: 'English',
    publisher: 'Farrar, Straus and Giroux',
    is_featured: false,
    view_count: 456,
    created_at: '2025-10-20T10:00:00Z',
    updated_at: '2025-10-20T10:00:00Z',
    stats: {
      total_likes: 1876,
      total_ratings: 723,
      average_rating: 4.6,
      total_comments: 289,
      total_owners: 534,
    },
  },
  {
    book_id: 6,
    title: 'Educated',
    isbn: '9780399590504',
    description: 'A memoir about the author\'s unconventional upbringing...',
    cover_image_url: 'https://covers.openlibrary.org/b/id/8295089-M.jpg',
    price: 17.50,
    total_pages: 352,
    publication_date: '2018-02-20',
    language: 'English',
    publisher: 'Scribner',
    is_featured: true,
    view_count: 789,
    created_at: '2025-09-15T10:00:00Z',
    updated_at: '2025-09-15T10:00:00Z',
    stats: {
      total_likes: 2234,
      total_ratings: 987,
      average_rating: 4.8,
      total_comments: 456,
      total_owners: 723,
    },
  },
];

const CATEGORIES = ['All', 'Self-Help', 'History', 'Science', 'Biography', 'Fiction'];
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function BooksPage() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(MOCK_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [ratingFilter, setRatingFilter] = useState(0);

  // Apply filters and sorting
  useEffect(() => {
    let result = books;

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((book) =>
        book.categories?.some((cat) => cat.name === selectedCategory)
      );
    }

    // Filter by price range
    result = result.filter((book) => book.price && book.price >= priceRange[0] && book.price <= priceRange[1]);

    // Filter by rating
    if (ratingFilter > 0) {
      result = result.filter((book) => book.stats && book.stats.average_rating >= ratingFilter);
    }

    // Sort results
    switch (selectedSort) {
      case 'newest':
        result.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'rating':
        result.sort((a, b) => (b.stats?.average_rating || 0) - (a.stats?.average_rating || 0));
        break;
      case 'popular':
        result.sort((a, b) => (b.stats?.total_likes || 0) - (a.stats?.total_likes || 0));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default: // relevance
        // Keep original order or implement relevance scoring
        break;
    }

    setFilteredBooks(result);
  }, [books, searchQuery, selectedCategory, selectedSort, priceRange, ratingFilter]);

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">Discover Books</h1>
          <p className="text-neutral-600">
            Browse {filteredBooks.length} books from our collection
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Search Input */}
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search books by title, author, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="input w-full"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-4 flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? 'Hide' : 'Show'} Advanced Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Advanced Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-4">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-4">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[0, 3, 3.5, 4, 4.5, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setRatingFilter(rating)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        ratingFilter === rating
                          ? 'bg-secondary-500 text-white'
                          : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                      }`}
                    >
                      {rating === 0 ? 'All' : `${rating}⭐`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-neutral-600">
            Showing <span className="font-bold">{filteredBooks.length}</span> results
          </p>
          {(searchQuery || selectedCategory !== 'All' || ratingFilter > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setRatingFilter(0);
              }}
              className="text-primary-500 hover:text-primary-600 font-medium flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.book_id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-neutral-900 mb-2">No books found</h3>
            <p className="text-neutral-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setRatingFilter(0);
              }}
              className="btn btn-primary"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination (Future) */}
        {filteredBooks.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button className="btn btn-outline px-4 py-2">← Previous</button>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-2 rounded-lg font-medium transition-all ${
                    page === 1
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="btn btn-outline px-4 py-2">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
