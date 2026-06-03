-- Add photo_url column for storing uploaded image URLs
ALTER TABLE events ADD COLUMN IF NOT EXISTS photo_url TEXT;
