-- Create the tasks table with UUID as primary key and foreign key to users table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complete BOOLEAN DEFAULT false NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Create a trigger to call the update_updated_at function on update
CREATE TRIGGER tasks_updated_at_trigger BEFORE
UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();