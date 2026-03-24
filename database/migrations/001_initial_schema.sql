-- ============================================
-- SUPABASE INITIAL MIGRATIONS
-- ============================================
-- This file contains all database schema migrations
-- for BookHub Community Platform
-- Run these migrations in Supabase SQL Editor

-- ============================================
-- 1. CREATE TABLES - CORE
-- ============================================

-- USERS Table
CREATE TABLE IF NOT EXISTS public.users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    auth_provider VARCHAR(50), -- 'google', 'github', 'email'
    auth_provider_id VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified_email BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- CATEGORIES Table
CREATE TABLE IF NOT EXISTS public.categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    color_code VARCHAR(7),
    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AUTHORS Table
CREATE TABLE IF NOT EXISTS public.authors (
    author_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url VARCHAR(500),
    birth_date DATE,
    nationality VARCHAR(100),
    website VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BOOKS Table
CREATE TABLE IF NOT EXISTS public.books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    description TEXT,
    cover_image_url VARCHAR(500),
    cover_image_path VARCHAR(255),
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    total_pages INTEGER,
    publication_date DATE,
    language VARCHAR(50),
    publisher VARCHAR(255),
    edition VARCHAR(100),
    summary TEXT,
    content_warning TEXT,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CREATE RELATIONSHIP TABLES
-- ============================================

-- BOOK_CATEGORIES (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.book_categories (
    book_category_id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES public.books(book_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES public.categories(category_id) ON DELETE CASCADE,
    primary_category BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, category_id)
);

-- BOOK_AUTHORS (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.book_authors (
    book_author_id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES public.books(book_id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES public.authors(author_id) ON DELETE CASCADE,
    author_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, author_id)
);

-- ============================================
-- 3. CREATE ENGAGEMENT TABLES
-- ============================================

-- BOOK_LIKES Table
CREATE TABLE IF NOT EXISTS public.book_likes (
    like_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES public.books(book_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- BOOK_COMMENTS Table
CREATE TABLE IF NOT EXISTS public.book_comments (
    comment_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES public.books(book_id) ON DELETE CASCADE,
    parent_comment_id INTEGER REFERENCES public.book_comments(comment_id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    report_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- COMMENT_LIKES Table
CREATE TABLE IF NOT EXISTS public.comment_likes (
    comment_like_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    comment_id INTEGER NOT NULL REFERENCES public.book_comments(comment_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, comment_id)
);

-- BOOK_RATINGS Table
CREATE TABLE IF NOT EXISTS public.book_ratings (
    rating_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES public.books(book_id) ON DELETE CASCADE,
    rating_value INTEGER NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
    review_text TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- USER_BOOK_OWNERSHIP Table
CREATE TABLE IF NOT EXISTS public.user_book_ownership (
    ownership_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES public.books(book_id) ON DELETE CASCADE,
    ownership_status VARCHAR(50) DEFAULT 'owned',
    acquired_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- ============================================
-- 4. CREATE USER PROFILE TABLES
-- ============================================

-- USER_PROFILES Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    photo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    location VARCHAR(255),
    website VARCHAR(500),
    birth_date DATE,
    gender VARCHAR(50),
    reading_level VARCHAR(50),
    total_books_owned INTEGER DEFAULT 0,
    total_books_read INTEGER DEFAULT 0,
    joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_public BOOLEAN DEFAULT true,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- USER_PREFERENCES Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    preference_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    preferred_genres TEXT[],
    recommended_only BOOLEAN DEFAULT false,
    language VARCHAR(10) DEFAULT 'en',
    theme VARCHAR(50) DEFAULT 'light',
    notifications_email BOOLEAN DEFAULT true,
    notifications_push BOOLEAN DEFAULT true,
    notifications_weekly_digest BOOLEAN DEFAULT true,
    notifications_new_releases BOOLEAN DEFAULT false,
    notifications_friend_activity BOOLEAN DEFAULT false,
    privacy_show_collection BOOLEAN DEFAULT true,
    privacy_show_likes BOOLEAN DEFAULT true,
    privacy_show_ratings BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. CREATE EVENT TABLES
-- ============================================

-- EVENTS Table
CREATE TABLE IF NOT EXISTS public.events (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(50),
    description TEXT,
    event_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    event_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location_name VARCHAR(255),
    location_address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    organizer_name VARCHAR(255),
    organizer_contact VARCHAR(255),
    organizer_email VARCHAR(255),
    event_url VARCHAR(500),
    image_url VARCHAR(500),
    capacity INTEGER,
    registration_count INTEGER DEFAULT 0,
    travel_instructions TEXT,
    parking_info TEXT,
    accessibility_info TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EVENT_REGISTRATIONS Table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    registration_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
    registration_status VARCHAR(50) DEFAULT 'registered',
    number_of_attendees INTEGER DEFAULT 1,
    special_requests TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- ============================================
-- 6. CREATE INDEXES
-- ============================================

-- User indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Book indexes
CREATE INDEX idx_books_title ON public.books(title);
CREATE INDEX idx_books_isbn ON public.books(isbn);
CREATE INDEX idx_books_is_featured ON public.books(is_featured);
CREATE INDEX idx_books_created_at ON public.books(created_at);

-- Engagement indexes
CREATE INDEX idx_likes_user_id ON public.book_likes(user_id);
CREATE INDEX idx_likes_book_id ON public.book_likes(book_id);
CREATE INDEX idx_likes_created_at ON public.book_likes(created_at);

CREATE INDEX idx_comments_book_id ON public.book_comments(book_id);
CREATE INDEX idx_comments_user_id ON public.book_comments(user_id);
CREATE INDEX idx_comments_parent_id ON public.book_comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON public.book_comments(created_at);

CREATE INDEX idx_ratings_book_id ON public.book_ratings(book_id);
CREATE INDEX idx_ratings_user_id ON public.book_ratings(user_id);

CREATE INDEX idx_ownership_user_id ON public.user_book_ownership(user_id);
CREATE INDEX idx_ownership_book_id ON public.user_book_ownership(book_id);

-- Category indexes
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_book_categories_book_id ON public.book_categories(book_id);
CREATE INDEX idx_book_categories_category_id ON public.book_categories(category_id);

-- Event indexes
CREATE INDEX idx_events_event_date ON public.events(event_start_date);
CREATE INDEX idx_events_is_active ON public.events(is_active);
CREATE INDEX idx_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX idx_registrations_event_id ON public.event_registrations(event_id);

-- ============================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_book_ownership ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. CREATE SEED DATA
-- ============================================

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, color_code, display_order) VALUES
('Psychology', 'psychology', 'Understanding human behavior and mind', '#1E40AF', 1),
('Self-Improvement', 'self-improvement', 'Personal growth and development', '#D97706', 2),
('Mystery', 'mystery', 'Suspenseful and thrilling stories', '#10B981', 3),
('Y-Novel', 'y-novel', 'Young adult fiction and romance', '#EF4444', 4),
('Fantasy', 'fantasy', 'Magical worlds and adventures', '#6366F1', 5),
('Science Fiction', 'science-fiction', 'Futuristic and sci-fi stories', '#8B5CF6', 6),
('Romance', 'romance', 'Love stories and relationships', '#EC4899', 7),
('Thriller', 'thriller', 'Edge-of-seat suspense', '#F97316', 8),
('Biography', 'biography', 'Life stories and memoirs', '#0EA5E9', 9),
('History', 'history', 'Historical events and periods', '#6B7280', 10);

-- Insert sample authors
INSERT INTO public.authors (name, bio, website) VALUES
('James Clear', 'Author of Atomic Habits and bestselling books on productivity', 'https://jamesclear.com'),
('Charles Duhigg', 'Pulitzer Prize winner and author of The Power of Habit', 'https://charlesduhigg.com'),
('BJ Fogg', 'Behavior scientist and author of Tiny Habits', 'https://bjfogg.com');

-- Note: Insert sample books and other data in separate migration if needed
-- This ensures schema is created first, then populated with data

-- ============================================
-- 9. CREATE VIEWS
-- ============================================

-- Book Statistics View
CREATE VIEW IF NOT EXISTS public.book_statistics AS
SELECT
    b.book_id,
    b.title,
    COUNT(DISTINCT bl.like_id) as total_likes,
    COUNT(DISTINCT br.rating_id) as total_ratings,
    AVG(br.rating_value) as average_rating,
    COUNT(DISTINCT bc.comment_id) as total_comments,
    COUNT(DISTINCT ub.ownership_id) as total_owners,
    b.view_count,
    b.created_at
FROM public.books b
LEFT JOIN public.book_likes bl ON b.book_id = bl.book_id
LEFT JOIN public.book_ratings br ON b.book_id = br.book_id
LEFT JOIN public.book_comments bc ON b.book_id = bc.book_id AND bc.is_deleted = false
LEFT JOIN public.user_book_ownership ub ON b.book_id = ub.book_id
GROUP BY b.book_id, b.title, b.view_count, b.created_at;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Run this migration in Supabase SQL Editor
-- After running, verify all tables are created using: SELECT * FROM information_schema.tables WHERE table_schema = 'public';
