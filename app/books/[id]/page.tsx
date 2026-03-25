'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Heart, Share2, Download } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  getBookById,
  getComments,
  addComment,
  likeBook,
  unlikeBook,
  isBookLiked,
  getUserBookRating,
  submitBookRating,
  getUserBookStatus,
  setBookFavorite,
  setBookRead,
} from '@/lib/supabase';
import type { Book } from '@/lib/types';

// Mock book data
const MOCK_BOOKS: Record<number, any> = {  1: {
    book_id: 1,
    title: 'Atomic Habits',
    isbn: '9780735211292',
    description:
      'Tiny Changes, Remarkable Results. In this groundbreaking book, Pulitzer Prize winner and bestselling author James Clear reveals practical strategies and easy-to-follow techniques that will teach you exactly how to form good habits, break bad ones, and master tiny behaviors...',
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
    authors: [
      {
        author_id: 1,
        name: 'James Clear',
        bio: 'James Clear is the bestselling author of Atomic Habits.',
        image_url: 'https://jamesclEAR.com/image.jpg',
      },
    ],
    categories: [
      { category_id: 1, name: 'Self-Help' },
      { category_id: 2, name: 'Productivity' },
    ],
    stats: {
      total_likes: 2456,
      total_ratings: 1234,
      average_rating: 4.8,
      total_comments: 567,
      total_owners: 890,
    },
  },
};

export default function BookDetail() {
  const params = useParams();
  const bookId = parseInt(params.id as string);
  const [book, setBook] = useState<Book | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingFeedback, setRatingFeedback] = useState<string | null>(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedBook = await getBookById(bookId);
        const fallbackBook = (MOCK_BOOKS[bookId] as Book) || null;
      setBook((fetchedBook as Book) || fallbackBook);

      if (fetchedBook?.stats) {
        setLikeCount(fetchedBook.stats.total_likes);
      } else if (fallbackBook?.stats) {
          setLikeCount(MOCK_BOOKS[bookId].stats.total_likes);
        }
      } catch (err) {
        console.error('Error loading book:', err);
        setBook(MOCK_BOOKS[bookId] || null);
        if (MOCK_BOOKS[bookId]?.stats) setLikeCount(MOCK_BOOKS[bookId].stats.total_likes);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookId]);

  useEffect(() => {
    const loadComments = async () => {
      setCommentsLoading(true);
      try {
        const fetchedComments = await getComments(bookId);
        setComments(Array.isArray(fetchedComments) ? fetchedComments : []);
      } catch (err) {
        console.error('Error loading comments:', err);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    loadComments();
  }, [bookId]);

  useEffect(() => {
    const loadLike = async () => {
      if (!profile) return;

      try {
        const liked = await isBookLiked(profile.user_id, bookId);
        setIsLiked(liked);
      } catch (err) {
        console.error('Failed to query like status:', err);
      }
    };

    const loadStatus = async () => {
      if (!profile) return;

      try {
        const status = await getUserBookStatus(profile.user_id, bookId);
        setIsFavorite(status.is_favorite);
        setIsRead(status.is_read);
      } catch (err) {
        console.error('Failed to get userbook status:', err);
      }
    };

    loadLike();
    loadStatus();
  }, [bookId, profile]);

  useEffect(() => {
    const loadUserRating = async () => {
      if (!profile) return;

      try {
        const rating = await getUserBookRating(profile.user_id, bookId);
        if (rating !== null && rating !== undefined) {
          setUserRating(Number(rating));
        }
      } catch (err) {
        console.error('Failed to get user rating:', err);
      }
    };

    loadUserRating();
  }, [bookId, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="skeleton h-96 w-96"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900">Book Not Found</h1>
          <p className="text-neutral-600 mt-2">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
          <a href="/" className="hover:text-primary-500">
            Home
          </a>
          <span>/</span>
          <a href="/books" className="hover:text-primary-500">
            Books
          </a>
          <span>/</span>
          <span className="text-neutral-900">{book.title}</span>
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Book Cover & Actions */}
          <div className="lg:col-span-1">
            {/* Book Cover */}
            <div className="card overflow-hidden mb-6">
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={async () => {
                  if (!profile) {
                    alert('Please sign in to like this book.');
                    return;
                  }

                  if (isLiked) {
                    try {
                      await unlikeBook(profile.user_id, book.book_id);
                      setIsLiked(false);
                      setLikeCount((c) => Math.max(0, c - 1));
                    } catch (err) {
                      console.error('Failed to unlike book:', err);
                    }
                  } else {
                    try {
                      await likeBook(profile.user_id, book.book_id);
                      setIsLiked(true);
                      setLikeCount((c) => c + 1);
                    } catch (err) {
                      console.error('Failed to like book:', err);
                    }
                  }
                }}
                className={`w-full btn ${
                  isLiked ? 'btn-primary' : 'btn-outline'
                } flex items-center justify-center gap-2`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </button>

              <button
                onClick={async () => {
                  if (!profile) {
                    setStatusFeedback('Please sign in to favorite this book.');
                    return;
                  }

                  setStatusLoading(true);
                  setStatusFeedback(null);

                  try {
                    const nextFavorite = !isFavorite;
                    await setBookFavorite(profile.user_id, book.book_id, nextFavorite);
                    setIsFavorite(nextFavorite);
                    setStatusFeedback(nextFavorite ? 'Added to favorites.' : 'Removed from favorites.');
                  } catch (err) {
                    console.error('Failed to update favorite status:', err);
                    setStatusFeedback('Unable to update favorite status.');
                  } finally {
                    setStatusLoading(false);
                  }
                }}
                className={`w-full btn ${isFavorite ? 'btn-secondary' : 'btn-outline'} flex items-center justify-center gap-2`}
                disabled={statusLoading}
              >
                {isFavorite ? '★ Favorited' : '☆ Favorite'}
              </button>

              <button
                onClick={async () => {
                  if (!profile) {
                    setStatusFeedback('Please sign in to track your reading status.');
                    return;
                  }

                  setStatusLoading(true);
                  setStatusFeedback(null);

                  try {
                    const nextRead = !isRead;
                    await setBookRead(profile.user_id, book.book_id, nextRead);
                    setIsRead(nextRead);
                    setStatusFeedback(nextRead ? 'Marked as read.' : 'Marked as want to read.');
                  } catch (err) {
                    console.error('Failed to update read status:', err);
                    setStatusFeedback('Unable to update read status.');
                  } finally {
                    setStatusLoading(false);
                  }
                }}
                className={`w-full btn ${isRead ? 'btn-success' : 'btn-outline'} flex items-center justify-center gap-2`}
                disabled={statusLoading}
              >
                {isRead ? '📚 Read' : '📘 Want to read'}
              </button>

              <button className="w-full btn btn-primary flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Add to Library
              </button>

              <button className="w-full btn btn-outline flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share
              </button>
              {statusFeedback && (
                <p className="mt-2 text-sm text-neutral-700">{statusFeedback}</p>
              )}
            </div>

            {/* Info Card */}
            <div className="card p-4 space-y-4">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">ISBN</p>
                <p className="font-mono text-sm text-neutral-900">{book.isbn}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">Publisher</p>
                <p className="text-sm text-neutral-900">{book.publisher}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">Published</p>
                <p className="text-sm text-neutral-900">
                  {book.publication_date ? new Date(book.publication_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">Language</p>
                <p className="text-sm text-neutral-900">{book.language}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">Pages</p>
                <p className="text-sm text-neutral-900">{book.total_pages}</p>
              </div>
            </div>
          </div>

          {/* Middle/Right Columns - Book Details */}
          <div className="lg:col-span-2">
            {/* Title & Rating */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">{book.title}</h1>

              {/* Authors */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-neutral-600">by</span>
                {book.authors?.map((author, idx) => (
                  <div key={author.author_id}>
                    <a
                      href={`/authors/${author.author_id}`}
                      className="text-primary-500 hover:text-primary-600 font-medium"
                    >
                      {author.name}
                    </a>
                    {idx < (book.authors?.length ?? 0) - 1 && <span>,</span>}
                  </div>
                ))}
              </div>

              {/* Rating & Stats */}
              {book.stats && (
                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <span className="text-4xl font-bold text-secondary-500">
                      {book.stats.average_rating.toFixed(1)}
                    </span>
                    <span className="text-secondary-500 ml-1">★</span>
                  </div>
                  <div>
                    <p className="text-neutral-900 font-medium">{book.stats.total_ratings} ratings</p>
                    <p className="text-neutral-600 text-sm">{book.stats.total_comments} reviews</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-neutral-900 font-medium">{likeCount}</p>
                    <p className="text-neutral-600 text-sm">people like this</p>
                  </div>
                </div>
              )}

              {/* Categories */}
              {book.categories && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.categories.map((category) => (
                    <a
                      key={category.category_id}
                      href={`/books?category=${category.name.toLowerCase()}`}
                      className="badge badge-primary hover:bg-primary-100 transition-colors"
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            {book.price && (
              <div className="mb-8 pb-8 border-b border-neutral-200">
                <p className="text-5xl font-bold text-secondary-500">${book.price.toFixed(2)}</p>
              </div>
            )}

            {/* Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">About This Book</h2>
              <p className="text-neutral-700 leading-relaxed">{book.description}</p>
            </section>

            {/* Rating Distribution */}
            {book.stats && (
              <section className="mb-8 bg-white p-6 rounded-lg border border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Rating Distribution</h2>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="font-medium text-neutral-900 w-12">{rating}★</span>
                      <div className="flex-1 bg-neutral-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-secondary-500 h-full transition-all duration-300"
                          style={{
                            width: `${Math.random() * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-neutral-600 text-sm w-16">
                        {Math.floor(Math.random() * 200)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Submit Rating */}
            <section className="mb-8 bg-white p-6 rounded-lg border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-900">Your Rating</h2>
                <span className="text-sm text-neutral-500">
                  {userRating ? `Your last: ${userRating}★` : 'Not rated yet'}
                </span>
              </div>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setUserRating(rating)}
                    className={`px-3 py-2 rounded-full border transition-all ${
                      userRating === rating
                        ? 'bg-secondary-500 text-white border-secondary-500'
                        : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
                    }`}
                  >
                    {rating}★
                  </button>
                ))}
              </div>
              <button
                onClick={async () => {
                  if (!profile) {
                    setRatingFeedback('Please log in to rate books.');
                    return;
                  }

                  if (!userRating) {
                    setRatingFeedback('Select a rating before submitting.');
                    return;
                  }

                  setSubmittingRating(true);
                  setRatingFeedback(null);

                  try {
                    const { totalRatings, averageRating } = await submitBookRating(
                      profile.user_id,
                      book.book_id,
                      userRating
                    );

                    setBook((prev) => {
                      if (!prev) return prev;
                      const updatedStats = {
                        total_likes: prev.stats?.total_likes ?? 0,
                        total_ratings: totalRatings,
                        average_rating: averageRating,
                        total_comments: prev.stats?.total_comments ?? 0,
                        total_owners: prev.stats?.total_owners ?? 0,
                      };

                      return {
                        ...prev,
                        stats: updatedStats,
                      };
                    });

                    setRatingFeedback('Thanks! Your rating has been submitted.');
                  } catch (err) {
                    console.error('Error submitting rating:', err);
                    setRatingFeedback('Unable to submit rating. Please try again later.');
                  } finally {
                    setSubmittingRating(false);
                  }
                }}
                className="btn btn-primary"
                disabled={submittingRating}
              >
                {submittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
              {ratingFeedback && <p className="text-sm text-neutral-600 mt-3">{ratingFeedback}</p>}
            </section>

            {/* Comments */}
            <section className="bg-white p-6 rounded-lg border border-neutral-200">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900">Comments</h2>
                <span className="text-sm text-neutral-500">{comments.length} comments</span>
              </div>

              {profile ? (
                <div className="mb-4">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={4}
                    placeholder="Leave your comment..."
                    className="w-full border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="flex justify-end mt-2 gap-2">
                    <button
                      onClick={() => setCommentText('')}
                      disabled={submittingComment}
                      className="btn btn-outline"
                    >
                      Clear
                    </button>
                    <button
                      onClick={async () => {
                        if (!commentText.trim() || !profile) return;
                        setSubmittingComment(true);
                        setCommentError(null);
                        try {
                          const newComment = await addComment(book.book_id, profile.user_id, commentText.trim());
                          setComments((prev) => [newComment, ...prev]);
                          setCommentText('');
                        } catch (err) {
                          console.error('Error adding comment:', err);
                          setCommentError('Failed to submit comment.');
                        } finally {
                          setSubmittingComment(false);
                        }
                      }}
                      className="btn btn-primary"
                      disabled={submittingComment || !commentText.trim()}
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                  {commentError && <p className="text-error-500 text-sm mt-2">{commentError}</p>}
                </div>
              ) : (
                <p className="text-sm text-neutral-600 mb-4">Sign in to post a comment.</p>
              )}

              {commentsLoading ? (
                <div className="py-8 text-center text-neutral-500">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="py-8 text-center text-neutral-500">No comments yet, be the first.</div>
              ) : (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li key={comment.comment_id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-semibold text-neutral-900">{comment.user?.username ?? 'Anonymous'}</p>
                          <p className="text-neutral-500 text-xs">{new Date(comment.created_at).toLocaleString()}</p>
                        </div>
                        <div className="text-sm text-neutral-400">{comment.like_count ?? 0} likes</div>
                      </div>
                      <p className="text-neutral-700 mt-2">{comment.comment_text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Where to Buy */}
            <section className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Where to Buy</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Amazon', icon: '📦' },
                  { name: 'Apple Books', icon: '📱' },
                  { name: 'Google Play', icon: '▶️' },
                  { name: 'Kindle', icon: '📖' },
                ].map((store) => (
                  <a
                    key={store.name}
                    href="#"
                    className="btn btn-outline flex flex-col items-center justify-center gap-2 py-4"
                  >
                    <span className="text-2xl">{store.icon}</span>
                    <span className="text-sm font-medium">{store.name}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Comments Section */}
        <section className="bg-white rounded-lg border border-neutral-200 p-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">Reviews ({book.stats?.total_comments || 0})</h2>
            <button className="btn btn-primary">Add Review</button>
          </div>

          {/* Comment List */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="pb-6 border-b border-neutral-200 last:pb-0 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-neutral-900">Reviewer {i}</h3>
                      <span className="text-secondary-500">⭐ {(5 - i * 0.5).toFixed(1)}</span>
                    </div>
                    <p className="text-neutral-600 text-sm mb-3">
                      "This book absolutely changed my perspective on how I approach my daily habits. Highly recommended
                      for anyone looking to improve their lifestyle and productivity."
                    </p>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <button className="hover:text-primary-500 transition-colors flex items-center gap-1">
                        <Heart className="w-4 h-4" /> Helpful
                      </button>
                      <button className="hover:text-primary-500 transition-colors">Reply</button>
                      <span>2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
