-- V3__create_careplan_and_notification_tables.sql
-- create care_plan table
CREATE TABLE IF NOT EXISTS care_plan (
  id BIGSERIAL PRIMARY KEY,
  veterinary_id BIGINT,
  pet_id BIGINT NOT NULL,
  pet_owner_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by_user_id BIGINT,
  status VARCHAR(20) NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS care_plan_item (
  id BIGSERIAL PRIMARY KEY,
  care_plan_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS notification (
  id BIGSERIAL PRIMARY KEY,
  target_user_id BIGINT,
  care_plan_id BIGINT,
  type VARCHAR(50),
  payload TEXT,
  sent_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS follow_up_log (
  id BIGSERIAL PRIMARY KEY,
  care_plan_item_id BIGINT,
  action VARCHAR(50),
  performed_by BIGINT,
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  note TEXT
);