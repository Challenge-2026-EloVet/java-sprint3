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
  notes TEXT,
  CONSTRAINT fk_care_plan_veterinary FOREIGN KEY (veterinary_id) REFERENCES elo_veterinario(id_veterinario),
  CONSTRAINT fk_care_plan_pet FOREIGN KEY (pet_id) REFERENCES elo_pet(id_pet),
  CONSTRAINT fk_care_plan_pet_owner FOREIGN KEY (pet_owner_id) REFERENCES elo_login(id_usuario),
  CONSTRAINT fk_care_plan_created_by FOREIGN KEY (created_by_user_id) REFERENCES elo_login(id_usuario)
);

CREATE TABLE IF NOT EXISTS care_plan_item (
  id BIGSERIAL PRIMARY KEY,
  care_plan_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  CONSTRAINT fk_care_plan_item_plan FOREIGN KEY (care_plan_id) REFERENCES care_plan(id)
);

CREATE TABLE IF NOT EXISTS notification (
  id BIGSERIAL PRIMARY KEY,
  target_user_id BIGINT,
  care_plan_id BIGINT,
  type VARCHAR(50),
  payload TEXT,
  sent_at TIMESTAMP,
  CONSTRAINT fk_notification_target_user FOREIGN KEY (target_user_id) REFERENCES elo_login(id_usuario),
  CONSTRAINT fk_notification_care_plan FOREIGN KEY (care_plan_id) REFERENCES care_plan(id)
);

CREATE TABLE IF NOT EXISTS follow_up_log (
  id BIGSERIAL PRIMARY KEY,
  care_plan_item_id BIGINT,
  action VARCHAR(50),
  performed_by BIGINT,
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  note TEXT,
  CONSTRAINT fk_follow_up_log_item FOREIGN KEY (care_plan_item_id) REFERENCES care_plan_item(id),
  CONSTRAINT fk_follow_up_log_user FOREIGN KEY (performed_by) REFERENCES elo_login(id_usuario)
);