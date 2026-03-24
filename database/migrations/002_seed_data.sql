-- ============================================
-- SUPABASE SEED DATA
-- ============================================
-- This file contains seed data for development
-- Run after 001_initial_schema.sql

-- Insert sample books
INSERT INTO public.books (title, isbn, description, cover_image_url, price, total_pages, publication_date, language, publisher, is_featured) VALUES
('Atomic Habits', '9780735211292', 'An easy and proven way to build good habits, break bad ones, and master tiny behaviors that lead to remarkable results.', 'https://covers.openlibrary.org/b/id/8247084-M.jpg', 16.99, 320, '2018-10-16', 'English', 'Penguin Books', true),
('The Power of Habit', '9780812981605', 'In The Power of Habit, Pulitzer Prize winner Charles Duhigg unlocks the secret to self-control by explaining the mysterious ways our routines shape our lives.', 'https://covers.openlibrary.org/b/id/8248849-M.jpg', 17.99, 416, '2012-02-28', 'English', 'Random House', true),
('Tiny Habits', '9780593539683', 'The easiest way to build new habits and break old ones is through modifying your environment and the way you think about habits.', 'https://covers.openlibrary.org/b/id/8383166-M.jpg', 18.99, 384, '2020-12-15', 'English', 'Houghton Mifflin', false);

-- Insert book-category relationships
INSERT INTO public.book_categories (book_id, category_id, primary_category) VALUES
((SELECT book_id FROM public.books WHERE title = 'Atomic Habits'), (SELECT category_id FROM public.categories WHERE slug = 'self-improvement'), true),
((SELECT book_id FROM public.books WHERE title = 'Atomic Habits'), (SELECT category_id FROM public.categories WHERE slug = 'psychology'), false),
((SELECT book_id FROM public.books WHERE title = 'The Power of Habit'), (SELECT category_id FROM public.categories WHERE slug = 'psychology'), true),
((SELECT book_id FROM public.books WHERE title = 'The Power of Habit'), (SELECT category_id FROM public.categories WHERE slug = 'self-improvement'), false),
((SELECT book_id FROM public.books WHERE title = 'Tiny Habits'), (SELECT category_id FROM public.categories WHERE slug = 'self-improvement'), true);

-- Insert book-author relationships
INSERT INTO public.book_authors (book_id, author_id, author_order) VALUES
((SELECT book_id FROM public.books WHERE title = 'Atomic Habits'), (SELECT author_id FROM public.authors WHERE name = 'James Clear'), 1),
((SELECT book_id FROM public.books WHERE title = 'The Power of Habit'), (SELECT author_id FROM public.authors WHERE name = 'Charles Duhigg'), 1),
((SELECT book_id FROM public.books WHERE title = 'Tiny Habits'), (SELECT author_id FROM public.authors WHERE name = 'BJ Fogg'), 1);

-- Insert sample event
INSERT INTO public.events (event_name, event_type, description, event_start_date, event_end_date, location_name, location_address, latitude, longitude, organizer_name, organizer_email, capacity) VALUES
('Book Fair 2026', 'book_fair', 'Annual book fair featuring 200+ authors and publishers. Browse, buy, and meet your favorite authors!', '2026-03-17 09:00:00+00', '2026-03-19 18:00:00+00', 'Convention Center', '123 Main Street, Downtown', 40.7128, -74.0060, 'Local Library', 'info@bookfair.com', 5000),
('Atomic Habits Discussion', 'author_reading', 'Join bestselling author James Clear for a discussion about building better habits and making lasting changes.', '2026-03-22 17:00:00+00', '2026-03-22 19:00:00+00', 'Riverside Books Café', '456 Riverside Ave, Downtown', 40.7138, -74.0070, 'Riverside Books', 'events@riverside.com', 150);

-- ============================================
-- SEED DATA COMPLETE
-- ============================================
