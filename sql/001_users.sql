-- Create the users table with UUID as primary key
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Create a trigger to call the update_updated_at function on update
CREATE TRIGGER users_updated_at_trigger BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE UNIQUE INDEX idx_unique_username ON users (username);
CREATE UNIQUE INDEX idx_unique_email ON users (email);