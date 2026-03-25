'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, Info, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { likeBook, unlikeBook } from '@/lib/supabase';
import type { Book } from '@/lib/types';

interface BookCardProps {
  book: Book;
  showActions?: boolean;
}

export default function BookCard({ book, showActions = true }: BookCardProps) {
  const { profile } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(book.stats?.total_likes || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!profile || isLiking) return;

    setIsLiking(true);
    try {
      if (isLiked) {
        await unlikeBook(profile.user_id, book.book_id);
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await likeBook(profile.user_id, book.book_id);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };
  return (
    <Link href={`/books/${book.book_id}`}>
      <div className="card group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer h-full flex flex-col">
        {/* Book Cover */}
        <div className="relative overflow-hidden bg-neutral-200 h-64 sm:h-80">
          <img
            src={book.cover_image_url || '/placeholder-book.png'}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Quick Actions Overlay */}
          {showActions && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={handleLike}
                  disabled={isLiking || !profile}
                  className="p-2 bg-white rounded-full hover:bg-error-500 hover:text-white transition-all transform scale-75 group-hover:scale-100"
                  title={profile ? (isLiked ? 'Unlike' : 'Like') : 'Sign in to like'}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current text-error-500' : ''}`} />
                </button>
                <Link href={`/books/${book.book_id}`}>
                  <button
                    className="p-2 bg-white rounded-full hover:bg-primary-500 hover:text-white transition-all transform scale-75 group-hover:scale-100"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </Link>
                <button
                  className="p-2 bg-white rounded-full hover:bg-primary-500 hover:text-white transition-all transform scale-75 group-hover:scale-100"
                  onClick={(e) => e.preventDefault()}
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {book.is_featured && (
            <div className="absolute top-2 right-2">
              <span className="badge badge-secondary text-xs px-2 py-1">Featured</span>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-sm line-clamp-2 text-neutral-900 group-hover:text-primary-500 transition-colors">
            {book.title}
          </h3>

          {/* Author/Publisher */}
          {book.publisher && (
            <p className="text-neutral-500 text-xs mt-1">{book.publisher}</p>
          )}

          {/* Price */}
          {book.price !== undefined && (
            <p className="text-secondary-500 font-bold text-lg mt-2">
              ${book.price.toFixed(2)}
            </p>
          )}

          {/* Rating */}
          {book.stats && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-secondary-500 font-semibold">⭐ {book.stats.average_rating.toFixed(1)}</span>
              <span className="text-neutral-400 text-xs">({book.stats.total_ratings})</span>
            </div>
          )}

          {/* Likes & Comments - Push to bottom */}
          {book.stats && (
            <div className="flex items-center gap-4 mt-auto pt-2 text-xs text-neutral-600 border-t border-neutral-200">
              <div className="flex items-center gap-1 hover:text-error-500 transition-colors">
                <Heart className={`w-3 h-3 ${isLiked ? 'fill-current text-error-500' : 'text-error-500'}`} />
                <span>{likeCount}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-primary-500 transition-colors">
                <MessageCircle className="w-3 h-3 text-primary-500" />
                <span>{book.stats.total_comments}</span>
              </div>
              <div className="ml-auto text-neutral-400">
                {book.stats.total_owners} own
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
