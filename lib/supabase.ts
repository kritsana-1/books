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
