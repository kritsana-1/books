'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Info, MessageCircle } from 'lucide-react';
import { getBooks } from '@/lib/supabase';
import type { Book } from '@/lib/types';

interface BookGridProps {
  category?: string;
}

// Mock books for now - will be replaced with actual API calls
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
];

export default function BookGrid({ category }: BookGridProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // TODO: Replace with actual API call
        // const data = await getBooks({ category });
        // setBooks(data || []);
        
        // For now, use mock data
        setBooks(MOCK_BOOKS);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton h-64 w-full mb-4"></div>
            <div className="skeleton h-4 w-3/4 mb-2"></div>
            <div className="skeleton h-3 w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <Link key={book.book_id} href={`/books/${book.book_id}`}>
          <div className="card group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer h-full">
            {/* Book Cover */}
            <div className="relative overflow-hidden bg-neutral-200 h-64 sm:h-80">
              <img
                src={book.cover_image_url || '/placeholder-book.png'}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Quick Actions Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button className="p-2 bg-white rounded-full hover:bg-primary-500 hover:text-white transition-all transform scale-75 group-hover:scale-100">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white rounded-full hover:bg-primary-500 hover:text-white transition-all transform scale-75 group-hover:scale-100">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white rounded-full hover:bg-primary-500 hover:text-white transition-all transform scale-75 group-hover:scale-100">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Featured Badge */}
              {book.is_featured && (
                <div className="absolute top-2 right-2">
                  <span className="badge badge-secondary">Featured</span>
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="card-padding">
              <h3 className="font-bold text-sm line-clamp-2 text-neutral-900 group-hover:text-primary-500 transition-colors">
                {book.title}
              </h3>

              {/* Price */}
              {book.price && (
                <p className="text-secondary-500 font-bold text-lg mt-2">
                  ${book.price.toFixed(2)}
                </p>
              )}

              {/* Rating */}
              {book.stats && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-secondary-500">⭐ {book.stats.average_rating}</span>
                  <span className="text-neutral-400 text-xs">({book.stats.total_ratings})</span>
                </div>
              )}

              {/* Likes & Comments */}
              {book.stats && (
                <div className="flex items-center gap-4 mt-3 text-xs text-neutral-600">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-error-500" />
                    <span>{book.stats.total_likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-primary-500" />
                    <span>{book.stats.total_comments}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
