-- Add latitude and longitude to pets table
ALTER TABLE pets ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
