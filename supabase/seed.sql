-- Seed data for production Supabase database

-- Insert default roles (with conflict handling)
INSERT INTO roles (name) VALUES ('admin'), ('user') ON CONFLICT (name) DO NOTHING;

-- Insert default admin user
-- Note: You should change this password in production
INSERT INTO users (username, password, department, role) 
SELECT 
    'Admin_Everywhere', 
    '$2a$08$NEC/5Tn.YBBSQk5yrKs59OUDeoMVZGMqXYM/aA9ji5mRoTu/wVBiC', -- 'pass' hashed with bcrypt
    'Software Engineering',
    (SELECT id FROM roles WHERE name = 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert default user
INSERT INTO users (username, password, department, role)
SELECT 
    'Regular_Joe',
    '$2a$08$NEC/5Tn.YBBSQk5yrKs59OUDeoMVZGMqXYM/aA9ji5mRoTu/wVBiC', -- 'pass' hashed with bcrypt
    'user',
    (SELECT id FROM roles WHERE name = 'user')
ON CONFLICT (username) DO NOTHING;
