-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(6) NOT NULL UNIQUE
);

-- Create users table  
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(150) NOT NULL,
    department VARCHAR(50) NOT NULL,
    role INTEGER NOT NULL DEFAULT 2 REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on username for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_agent TEXT,
    ip TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP
);

-- Create view for online users (PostgreSQL version)
CREATE OR REPLACE VIEW online_users AS
SELECT 
    u.id AS user_id, 
    u.username, 
    MAX(s.last_seen_at) AS last_seen_at
FROM users u
JOIN sessions s ON s.user_id = u.id
WHERE s.revoked_at IS NULL
    AND s.expires_at > CURRENT_TIMESTAMP
    AND s.last_seen_at > CURRENT_TIMESTAMP - INTERVAL '5 minutes'
GROUP BY u.id, u.username;

-- Insert default roles
INSERT INTO roles (name) VALUES ('admin'), ('user') ON CONFLICT (name) DO NOTHING;