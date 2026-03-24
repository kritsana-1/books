// ============================================
// BOOK TYPES
// ============================================

export interface Book {
  book_id: number;
  title: string;
  isbn?: string;
  description?: string;
  cover_image_url?: string;
  price?: number;
  currency?: string;
  total_pages?: number;
  publication_date?: string;
  language?: string;
  publisher?: string;
  edition?: string;
  summary?: string;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  authors?: Author[];
  categories?: Category[];
  stats?: BookStats;
}

export interface BookStats {
  total_likes: number;
  total_ratings: number;
  average_rating: number;
  total_comments: number;
  total_owners: number;
}

// ============================================
// USER TYPES
// ============================================

export interface User {
  user_id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  is_active: boolean;
  is_verified_email: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  profile?: UserProfile;
  preferences?: UserPreferences;
}

export interface UserProfile {
  profile_id: number;
  user_id: number;
  photo_url?: string;
  cover_image_url?: string;
  location?: string;
  website?: string;
  birth_date?: string;
  gender?: string;
  reading_level?: string;
  total_books_owned: number;
  total_books_read: number;
  joined_date: string;
  is_public: boolean;
  last_updated: string;
}

export interface UserPreferences {
  preference_id: number;
  user_id: number;
  preferred_genres?: string[];
  recommended_only: boolean;
  language: string;
  theme: 'light' | 'dark';
  notifications_email: boolean;
  notifications_push: boolean;
  notifications_weekly_digest: boolean;
  notifications_new_releases: boolean;
  notifications_friend_activity: boolean;
  privacy_show_collection: boolean;
  privacy_show_likes: boolean;
  privacy_show_ratings: boolean;
}

// ============================================
// COMMENT TYPES
// ============================================

export interface Comment {
  comment_id: number;
  user_id: number;
  book_id: number;
  parent_comment_id?: number;
  comment_text: string;
  is_edited: boolean;
  edited_at?: string;
  is_deleted: boolean;
  deleted_at?: string;
  report_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
  replies?: Comment[];
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  color_code?: string;
  display_order?: number;
  is_active: boolean;
  created_at: string;
}

// ============================================
// AUTHOR TYPES
// ============================================

export interface Author {
  author_id: number;
  name: string;
  bio?: string;
  image_url?: string;
  birth_date?: string;
  nationality?: string;
  website?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// EVENT TYPES
// ============================================

export interface Event {
  event_id: number;
  event_name: string;
  event_type: 'book_fair' | 'author_reading' | 'book_launch' | 'book_club';
  description: string;
  event_start_date: string;
  event_end_date: string;
  location_name: string;
  location_address: string;
  latitude: number;
  longitude: number;
  organizer_name: string;
  organizer_contact?: string;
  organizer_email: string;
  event_url?: string;
  image_url?: string;
  capacity?: number;
  registration_count: number;
  travel_instructions?: string;
  parking_info?: string;
  accessibility_info?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  registration_id: number;
  user_id: number;
  event_id: number;
  registration_status: 'registered' | 'attended' | 'cancelled';
  number_of_attendees: number;
  special_requests?: string;
  reminder_sent: boolean;
  registered_at: string;
  updated_at: string;
}

// ============================================
// RATING & LIKES TYPES
// ============================================

export interface Rating {
  rating_id: number;
  user_id: number;
  book_id: number;
  rating_value: number; // 1-5
  review_text?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Like {
  like_id: number;
  user_id: number;
  book_id: number;
  created_at: string;
}

// ============================================
// OWNERSHIP TYPES
// ============================================

export interface BookOwnership {
  ownership_id: number;
  user_id: number;
  book_id: number;
  ownership_status: 'owned' | 'reading' | 'wishlist';
  acquired_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// ============================================
// FILTER TYPES
// ============================================

export interface BooksFilter {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'popular' | 'newest' | 'rating' | 'trending';
  minRating?: number;
}

export interface EventsFilter {
  type?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  page?: number;
  limit?: number;
}
