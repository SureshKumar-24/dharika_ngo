import { neon } from '@neondatabase/serverless';

// Lazy-load database connection
let sql: ReturnType<typeof neon> | null = null;

function getDb() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

/**
 * Initialize database tables
 * Run this once to create the tables
 */
export async function initializeDatabase() {
  const sql = getDb();
  try {
    // Create volunteers table
    await sql`
      CREATE TABLE IF NOT EXISTS volunteers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        interest VARCHAR(20) NOT NULL CHECK (interest IN ('food', 'teaching', 'both')),
        availability TEXT NOT NULL,
        source VARCHAR(50) DEFAULT 'website',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create suggestions table
    await sql`
      CREATE TABLE IF NOT EXISTS suggestions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(255),
        message TEXT NOT NULL,
        source VARCHAR(50) DEFAULT 'website',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database tables initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Insert volunteer data into database
 */
export async function insertVolunteer(data: {
  name: string;
  phone: string;
  email: string;
  city: string;
  interest: 'food' | 'teaching' | 'both';
  availability: string;
}) {
  const sql = getDb();
  try {
    const result = await sql`
      INSERT INTO volunteers (name, phone, email, city, interest, availability, source)
      VALUES (${data.name}, ${data.phone}, ${data.email}, ${data.city}, ${data.interest}, ${data.availability}, 'website')
      RETURNING id, created_at
    ` as Array<{ id: number; created_at: Date }>;

    return result[0];
  } catch (error) {
    console.error('Error inserting volunteer:', error);
    throw error;
  }
}

/**
 * Insert suggestion data into database
 */
export async function insertSuggestion(data: {
  name?: string;
  email?: string;
  message: string;
}) {
  const sql = getDb();
  try {
    const result = await sql`
      INSERT INTO suggestions (name, email, message, source)
      VALUES (${data.name || null}, ${data.email || null}, ${data.message}, 'website')
      RETURNING id, created_at
    ` as Array<{ id: number; created_at: Date }>;

    return result[0];
  } catch (error) {
    console.error('Error inserting suggestion:', error);
    throw error;
  }
}

/**
 * Get all volunteers
 */
export async function getVolunteers(limit = 100) {
  const sql = getDb();
  try {
    const result = await sql`
      SELECT * FROM volunteers
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return result;
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    throw error;
  }
}

/**
 * Get all suggestions
 */
export async function getSuggestions(limit = 100) {
  const sql = getDb();
  try {
    const result = await sql`
      SELECT * FROM suggestions
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return result;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
}

/**
 * Test database connection
 */
export async function testConnection() {
  const sql = getDb();
  try {
    const result = await sql`SELECT NOW()` as Array<{ now: Date }>;
    console.log('Database connection successful:', result);
    return { success: true, timestamp: result[0].now };
  } catch (error) {
    console.error('Database connection failed:', error);
    return { success: false, error };
  }
}

export { getDb };
