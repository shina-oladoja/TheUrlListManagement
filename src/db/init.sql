-- Initialize Urlist Database Schema

-- URL Lists Table
CREATE TABLE IF NOT EXISTS url_lists (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  custom_url VARCHAR(100) UNIQUE NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- List Items Table (URLs within each list)
CREATE TABLE IF NOT EXISTS list_items (
  id SERIAL PRIMARY KEY,
  list_id INTEGER NOT NULL REFERENCES url_lists(id) ON DELETE CASCADE,
  url VARCHAR(2048) NOT NULL,
  title VARCHAR(255),
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_list_items_list_id ON list_items(list_id);
CREATE INDEX IF NOT EXISTS idx_url_lists_custom_url ON url_lists(custom_url);

-- Sample Data (optional)
INSERT INTO url_lists (title, description, custom_url, is_published) 
VALUES ('Sample List', 'A sample list of resources', 'sample-list', true)
ON CONFLICT (custom_url) DO NOTHING;
