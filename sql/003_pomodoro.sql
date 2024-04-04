-- Create the pomodoro table with UUID as primary key and foreign key to users table
CREATE TABLE pomodoro (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nickname VARCHAR(255),
  timer_time INT DEFAULT 1500,
  -- 25 minutes in seconds
  short_break_time INT DEFAULT 300,
  -- 5 minutes in seconds
  long_break_time INT DEFAULT 900,
  -- 15 minutes in seconds
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Create a trigger to call the update_updated_at function on update
CREATE TRIGGER pomodoro_updated_at_trigger BEFORE
UPDATE ON pomodoro FOR EACH ROW EXECUTE FUNCTION update_updated_at();