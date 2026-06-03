-- First, alter the photo column to allow NULL values
ALTER TABLE events ALTER COLUMN photo DROP NOT NULL;

-- Then clear the photo field for all existing events
UPDATE events SET photo = NULL WHERE photo IS NOT NULL;
