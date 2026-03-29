import pkg from 'pg';
const { Pool } = pkg;

// Get environment variables at module load time
const databaseConfig = {
  user: process.env.DB_USER || 'mcpuser',
  password: process.env.DB_PASSWORD || 'pass',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'mydb',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

console.log('Database config:', {
  user: databaseConfig.user,
  host: databaseConfig.host,
  port: databaseConfig.port,
  database: databaseConfig.database,
});

const pool = new Pool(databaseConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

export async function query(text, params = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', text, error);
    throw error;
  }
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}

// ============ URL Lists ============

export async function createList(title: string, description: string, customUrl: string) {
  try {
    const res = await query(
      'INSERT INTO url_lists (title, description, custom_url, is_published) VALUES ($1, $2, $3, false) RETURNING *',
      [title, description, customUrl]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Error creating list:', error);
    throw new Error(`Failed to create list: ${error.message}`);
  }
}

export async function getListByCustomUrl(customUrl: string) {
  try {
    const res = await query(
      'SELECT * FROM url_lists WHERE custom_url = $1',
      [customUrl]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Error fetching list by custom URL:', error);
    throw new Error(`Failed to fetch list: ${error.message}`);
  }
}

export async function getListById(id: number | string) {
  try {
    const res = await query(
      'SELECT * FROM url_lists WHERE id = $1',
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Error fetching list by ID:', error);
    throw new Error(`Failed to fetch list: ${error.message}`);
  }
}

export async function updateList(id: number | string, title: string, description: string) {
  try {
    const res = await query(
      'UPDATE url_lists SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Error updating list:', error);
    throw new Error(`Failed to update list: ${error.message}`);
  }
}

export async function deleteList(id: number | string) {
  try {
    await query('DELETE FROM url_lists WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting list:', error);
    throw new Error(`Failed to delete list: ${error.message}`);
  }
}

export async function publishList(id: number | string) {
  try {
    const res = await query(
      'UPDATE url_lists SET is_published = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Error publishing list:', error);
    throw new Error(`Failed to publish list: ${error.message}`);
  }
}

export async function getAllLists() {
  try {
    const res = await query(
      'SELECT id, title, description, custom_url, is_published, created_at, updated_at FROM url_lists ORDER BY updated_at DESC',
      []
    );
    return res.rows;
  } catch (error) {
    console.error('Error fetching all lists:', error);
    throw new Error(`Failed to fetch lists: ${error.message}`);
  }
}

// ============ List Items ============

export async function addItemToList(listId: number | string, url: string, title: string, displayOrder: number = 0) {
  try {
    const res = await query(
      'INSERT INTO list_items (list_id, url, title, display_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [listId, url, title, displayOrder]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Error adding item:', error);
    throw new Error(`Failed to add item: ${error.message}`);
  }
}

export async function getListItems(listId: number | string) {
  try {
    const res = await query(
      'SELECT * FROM list_items WHERE list_id = $1 ORDER BY display_order ASC, created_at ASC',
      [listId]
    );
    return res.rows;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw new Error(`Failed to fetch items: ${error.message}`);
  }
}

export async function updateListItem(itemId: number | string, url: string, title: string) {
  try {
    const res = await query(
      'UPDATE list_items SET url = $1, title = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [url, title, itemId]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Error updating item:', error);
    throw new Error(`Failed to update item: ${error.message}`);
  }
}

export async function deleteListItem(itemId: number | string) {
  try {
    await query('DELETE FROM list_items WHERE id = $1', [itemId]);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw new Error(`Failed to delete item: ${error.message}`);
  }
}

export async function reorderListItems(listId: number | string, itemIds: (number | string)[]) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < itemIds.length; i++) {
      await client.query(
        'UPDATE list_items SET display_order = $1 WHERE id = $2',
        [i, itemIds[i]]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error reordering items:', err);
    throw new Error(`Failed to reorder items: ${err.message}`);
  } finally {
    client.release();
  }
}

// ============ Utility Functions ============

export function generateCustomUrl(): string {
  return 'list-' + Math.random().toString(36).substr(2, 9);
}

export async function isCustomUrlAvailable(customUrl: string): Promise<boolean> {
  try {
    const res = await query(
      'SELECT id FROM url_lists WHERE custom_url = $1 LIMIT 1',
      [customUrl]
    );
    return res.rows.length === 0;
  } catch (error) {
    console.error('Error checking URL availability:', error);
    return false;
  }
}

export async function initializeDatabase(): Promise<boolean> {
  try {
    // Check if tables exist
    const tableRes = await query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'url_lists'
      )`
    );
    
    if (!tableRes.rows[0].exists) {
      console.log('Initializing database schema...');
      // Tables don't exist, need to run init.sql
      return false;
    }
    console.log('Database schema already initialized');
    return true;
  } catch (err) {
    console.error('Error checking database:', err);
    return false;
  }
}

export async function closePool(): Promise<void> {
  try {
    await pool.end();
    console.log('Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
}
