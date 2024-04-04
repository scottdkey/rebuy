-- Create a function to update updated_at column by default
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ensure uuid extension is installed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";