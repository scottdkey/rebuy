-- Active: 1712121289662@@localhost@5432@rebuy
CREATE TABLE history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  completed_tasks JSONB [] NOT NULL DEFAULT '{}',
  pauses TEXT [] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TRIGGER history_updated_at_trigger BEFORE
UPDATE ON history FOR EACH ROW EXECUTE FUNCTION update_updated_at();