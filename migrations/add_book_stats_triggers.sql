-- Migration: Add PostgreSQL triggers for auto-updating book stats
-- This migration creates triggers to automatically increment/decrement book stats
-- when users add/remove books from their library

-- Create trigger function for incrementing stats
CREATE OR REPLACE FUNCTION increment_book_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_favorite = true AND (OLD.is_favorite IS NULL OR OLD.is_favorite = false) THEN
    UPDATE books SET total_favorites = COALESCE(total_favorites, 0) + 1 WHERE book_id = NEW.book_id;
  END IF;
  
  IF NEW.is_read = true AND (OLD.is_read IS NULL OR OLD.is_read = false) THEN
    UPDATE books SET total_reads = COALESCE(total_reads, 0) + 1 WHERE book_id = NEW.book_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for decrementing stats
CREATE OR REPLACE FUNCTION decrement_book_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_favorite = true AND NEW.is_favorite = false THEN
    UPDATE books SET total_favorites = GREATEST(0, COALESCE(total_favorites, 0) - 1) WHERE book_id = NEW.book_id;
  END IF;
  
  IF OLD.is_read = true AND NEW.is_read = false THEN
    UPDATE books SET total_reads = GREATEST(0, COALESCE(total_reads, 0) - 1) WHERE book_id = NEW.book_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for deletion
CREATE OR REPLACE FUNCTION delete_book_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_favorite = true THEN
    UPDATE books SET total_favorites = GREATEST(0, COALESCE(total_favorites, 0) - 1) WHERE book_id = OLD.book_id;
  END IF;
  
  IF OLD.is_read = true THEN
    UPDATE books SET total_reads = GREATEST(0, COALESCE(total_reads, 0) - 1) WHERE book_id = OLD.book_id;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trg_increment_book_stats ON book_user_status;
DROP TRIGGER IF EXISTS trg_decrement_book_stats ON book_user_status;
DROP TRIGGER IF EXISTS trg_delete_book_stats ON book_user_status;

-- Create triggers
CREATE TRIGGER trg_increment_book_stats
AFTER INSERT ON book_user_status
FOR EACH ROW
EXECUTE FUNCTION increment_book_stats();

CREATE TRIGGER trg_decrement_book_stats
AFTER UPDATE ON book_user_status
FOR EACH ROW
WHEN (OLD IS DISTINCT FROM NEW)
EXECUTE FUNCTION decrement_book_stats();

CREATE TRIGGER trg_delete_book_stats
BEFORE DELETE ON book_user_status
FOR EACH ROW
EXECUTE FUNCTION delete_book_stats();

-- Ensure books table has stats columns (if not already present)
ALTER TABLE books ADD COLUMN IF NOT EXISTS total_favorites INTEGER DEFAULT 0;
ALTER TABLE books ADD COLUMN IF NOT EXISTS total_reads INTEGER DEFAULT 0;
