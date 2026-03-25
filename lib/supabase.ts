import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// ============================================
// AUTH FUNCTIONS
// ============================================

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) throw error;
  return data;
}

// ============================================
// USER FUNCTIONS
// ============================================

export async function getUserProfile(userId: number) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProfileByAuthId(authId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_provider_id', authId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: number, updates: any) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// BOOK FUNCTIONS
// ============================================

export async function getBooks(filters?: any) {
  let query = supabase
    .from('books')
    .select(
      `
      *,
      book_categories(
        category:categories(*)
      ),
      book_authors(
        author:authors(*)
      )
    `
    );

  if (filters?.category) {
    query = query.in('book_categories.category.slug', [filters.category]);
  }

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  if (filters?.sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getBookById(bookId: number) {
  const { data, error } = await supabase
    .from('books')
    .select(
      `
      *,
      book_categories(
        category:categories(*)
      ),
      book_authors(
        author:authors(*)
      )
    `
    )
    .eq('book_id', bookId)
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// COMMENT FUNCTIONS
// ============================================

export async function getComments(bookId: number) {
  const { data, error } = await supabase
    .from('book_comments')
    .select(
      `
      *,
      user:users(user_id, username, avatar_url),
      replies:book_comments(*)
    `
    )
    .eq('book_id', bookId)
    .is('parent_comment_id', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addComment(
  bookId: number,
  userId: number,
  text: string,
  parentCommentId?: number
) {
  const { data, error } = await supabase
    .from('book_comments')
    .insert({
      book_id: bookId,
      user_id: userId,
      comment_text: text,
      parent_comment_id: parentCommentId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// LIKE FUNCTIONS
// ============================================

export async function likeBook(userId: number, bookId: number) {
  const { data, error } = await supabase
    .from('book_likes')
    .insert({
      user_id: userId,
      book_id: bookId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unlikeBook(userId: number, bookId: number) {
  const { error } = await supabase
    .from('book_likes')
    .delete()
    .match({ user_id: userId, book_id: bookId });

  if (error) throw error;
}

export async function isBookLiked(userId: number, bookId: number) {
  const { data, error } = await supabase
    .from('book_likes')
    .select('like_id')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // not found means false
  return !!data;
}

export async function getUserBookRating(userId: number, bookId: number) {
  const { data, error } = await supabase
    .from('book_ratings')
    .select('rating')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.rating ?? null;
}

export async function submitBookRating(userId: number, bookId: number, rating: number) {
  const { data: ratingData, error: ratingError } = await supabase
    .from('book_ratings')
    .upsert(
      {
        user_id: userId,
        book_id: bookId,
        rating,
      },
      { onConflict: 'user_id,book_id' }
    )
    .select();

  if (ratingError) throw ratingError;

  const { data: ratingsList, error: listError } = await supabase
    .from('book_ratings')
    .select('rating')
    .eq('book_id', bookId);

  if (listError) throw listError;

  const ratings = Array.isArray(ratingsList)
    ? ratingsList.map((item: any) => Number(item.rating))
    : [];

  const totalRatings = ratings.length;
  const averageRating = totalRatings
    ? Number((ratings.reduce((sum, value) => sum + value, 0) / totalRatings).toFixed(1))
    : 0;

  return {
    savedRating: ratingData,
    totalRatings,
    averageRating,
  };
}

// ============================================
// EVENT FUNCTIONS
// ============================================

export async function getEvents(filters?: any) {
  let query = supabase.from('events').select('*');

  if (filters?.type) {
    query = query.eq('event_type', filters.type);
  }

  if (filters?.startDate) {
    query = query.gte('event_start_date', filters.startDate);
  }

  query = query.order('event_start_date', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function registerEvent(userId: number, eventId: number) {
  const { data, error } = await supabase
    .from('event_registrations')
    .insert({
      user_id: userId,
      event_id: eventId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unregisterEvent(userId: number, eventId: number) {
  const { error } = await supabase
    .from('event_registrations')
    .delete()
    .match({ user_id: userId, event_id: eventId });

  if (error) throw error;
}

export async function isUserRegisteredForEvent(userId: number, eventId: number) {
  const { data, error } = await supabase
    .from('event_registrations')
    .select('registration_id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return !!data;
}

// ============================================
// COMMUNITY FUNCTIONS
// ============================================

export async function getCommunityPosts() {
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      user:users(username, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createCommunityPost(userId: number, title: string, content: string) {
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      user_id: userId,
      title,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function likeCommunityPost(userId: number, postId: number) {
  const { data, error } = await supabase
    .from('community_post_likes')
    .insert({
      user_id: userId,
      post_id: postId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unlikeCommunityPost(userId: number, postId: number) {
  const { error } = await supabase
    .from('community_post_likes')
    .delete()
    .match({ user_id: userId, post_id: postId });

  if (error) throw error;
}

// ============================================
// CATEGORY FUNCTIONS
// ============================================

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return data;
}

// ============================================
// BOOK USER STATUS (favorites/read state)
// ============================================

export async function getUserBookStatus(userId: number, bookId: number) {
  const { data, error } = await supabase
    .from('book_user_status')
    .select('is_favorite, is_read')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? { is_favorite: data.is_favorite, is_read: data.is_read } : { is_favorite: false, is_read: false };
}

export async function setUserBookStatus(userId: number, bookId: number, status: { is_favorite?: boolean; is_read?: boolean; }) {
  const payload = {
    user_id: userId,
    book_id: bookId,
    is_favorite: status.is_favorite ?? false,
    is_read: status.is_read ?? false,
  };

  const { data, error } = await supabase
    .from('book_user_status')
    .upsert(payload, { onConflict: 'user_id,book_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function setBookFavorite(userId: number, bookId: number, isFavorite: boolean) {
  return setUserBookStatus(userId, bookId, { is_favorite: isFavorite });
}

export async function setBookRead(userId: number, bookId: number, isRead: boolean) {
  return setUserBookStatus(userId, bookId, { is_read: isRead });
}

export async function getUserFavoriteBooks(userId: number) {
  const { data, error } = await supabase
    .from('book_user_status')
    .select(
      `
      book:books(
        *,
        book_categories(category:categories(*)),
        book_authors(author:authors(*))
      )
      `
    )
    .eq('user_id', userId)
    .eq('is_favorite', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ? data.map((item: any) => item.book).filter((b: any) => b) : [];
}

export async function getUserReadBooks(userId: number) {
  const { data, error } = await supabase
    .from('book_user_status')
    .select(
      `
      book:books(
        *,
        book_categories(category:categories(*)),
        book_authors(author:authors(*))
      )
      `
    )
    .eq('user_id', userId)
    .eq('is_read', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ? data.map((item: any) => item.book).filter((b: any) => b) : [];
}

export async function getAllUserBooks(userId: number) {
  const { data, error } = await supabase
    .from('book_user_status')
    .select(
      `
      book:books(
        *,
        book_categories(category:categories(*)),
        book_authors(author:authors(*))
      ),
      is_favorite,
      is_read
      `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteUserBook(userId: number, bookId: number) {
  const { error } = await supabase
    .from('book_user_status')
    .delete()
    .match({ user_id: userId, book_id: bookId });

  if (error) throw error;
}

export async function deleteMultipleUserBooks(userId: number, bookIds: number[]) {
  const { error } = await supabase
    .from('book_user_status')
    .delete()
    .eq('user_id', userId)
    .in('book_id', bookIds);

  if (error) throw error;
}

export async function updateMultipleUserBooksStatus(
  userId: number,
  bookIds: number[],
  status: { is_favorite?: boolean; is_read?: boolean }
) {
  for (const bookId of bookIds) {
    await setUserBookStatus(userId, bookId, status);
  }
}

export async function getUserReadingStats(userId: number) {
  const { data: favoriteData, error: favError } = await supabase
    .from('book_user_status')
    .select('book_id')
    .eq('user_id', userId)
    .eq('is_favorite', true);

  const { data: readData, error: readError } = await supabase
    .from('book_user_status')
    .select('book_id')
    .eq('user_id', userId)
    .eq('is_read', true);

  const { data: ratingData, error: ratingError } = await supabase
    .from('book_ratings')
    .select('rating')
    .eq('user_id', userId);

  if (favError || readError || ratingError) {
    return { total_favorites: 0, total_read: 0, average_rating: 0, total_rated: 0 };
  }

  const favorites = (favoriteData || []).length;
  const read = (readData || []).length;
  const ratings = (ratingData || []).map((r: any) => Number(r.rating));
  const avgRating = ratings.length ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)) : 0;

  return {
    total_favorites: favorites,
    total_read: read,
    average_rating: avgRating,
    total_rated: ratings.length,
  };
}

export async function setReadingGoal(userId: number, goalYear: number, goalCount: number) {
  const { data, error } = await supabase
    .from('user_reading_goals')
    .upsert(
      {
        user_id: userId,
        goal_year: goalYear,
        goal_count: goalCount,
      },
      { onConflict: 'user_id,goal_year' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getReadingGoal(userId: number, goalYear: number) {
  const { data, error } = await supabase
    .from('user_reading_goals')
    .select('*')
    .eq('user_id', userId)
    .eq('goal_year', goalYear)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

