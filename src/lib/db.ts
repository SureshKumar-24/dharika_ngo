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

    // Create student_queries table
    await sql`
      CREATE TABLE IF NOT EXISTS student_queries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age VARCHAR(10),
        city VARCHAR(100) NOT NULL,
        locality VARCHAR(100) NOT NULL,
        student_class VARCHAR(10) NOT NULL,
        subject VARCHAR(50) NOT NULL,
        topic TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(255) NOT NULL,
        attending_offline_classes VARCHAR(10) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
        video_url TEXT,
        resolved_at TIMESTAMP,
        source VARCHAR(50) DEFAULT 'website',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create food_alerts table
    await sql`
      CREATE TABLE IF NOT EXISTS food_alerts (
        id SERIAL PRIMARY KEY,
        donor_type VARCHAR(50) NOT NULL,
        establishment_name VARCHAR(150) NOT NULL,
        contact_person_name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        quantity VARCHAR(100) NOT NULL,
        prepared_at VARCHAR(100) NOT NULL,
        expiry_estimate VARCHAR(50) NOT NULL,
        photo_url TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'picked_up', 'delivered', 'cancelled')),
        pickup_photo_url TEXT,
        delivery_photo_url TEXT,
        assigned_volunteer VARCHAR(100),
        source VARCHAR(50) DEFAULT 'website',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
 * Check if volunteer already exists by phone or email
 */
export async function checkVolunteerExists(phone: string, email: string) {
  const sql = getDb();
  try {
    const result = await sql`
      SELECT id, phone, email FROM volunteers
      WHERE phone = ${phone} OR email = ${email}
      LIMIT 1
    ` as Array<{ id: number; phone: string; email: string }>;

    if (result.length > 0) {
      const existing = result[0];
      if (existing.phone === phone && existing.email === email) {
        return { exists: true, field: 'both' };
      } else if (existing.phone === phone) {
        return { exists: true, field: 'phone' };
      } else {
        return { exists: true, field: 'email' };
      }
    }

    return { exists: false, field: null };
  } catch (error) {
    console.error('Error checking volunteer existence:', error);
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


/**
 * Section Images Management
 */

export interface SectionImage {
  id: number;
  section_name: string;
  image_key: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  updated_at: Date;
  created_at: Date;
}

export async function getSectionImages(sectionName: string): Promise<SectionImage[]> {
  const sql = getDb();
  try {
    const result = await sql`
      SELECT * FROM section_images
      WHERE section_name = ${sectionName}
      ORDER BY display_order ASC
    `;

    return result as SectionImage[];
  } catch (error) {
    console.error('Error fetching section images:', error);
    return [];
  }
}

export async function getAllSectionImages(): Promise<SectionImage[]> {
  const sql = getDb();
  try {
    const result = await sql`
      SELECT * FROM section_images
      ORDER BY section_name ASC, display_order ASC
    `;

    return result as SectionImage[];
  } catch (error) {
    console.error('Error fetching all section images:', error);
    return [];
  }
}

export async function updateSectionImage(
  id: number,
  data: {
    image_url?: string;
    alt_text?: string;
    display_order?: number;
  }
): Promise<void> {
  const sql = getDb();
  try {
    await sql`
      UPDATE section_images
      SET 
        image_url = COALESCE(${data.image_url}, image_url),
        alt_text = COALESCE(${data.alt_text}, alt_text),
        display_order = COALESCE(${data.display_order}, display_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Error updating section image:', error);
    throw error;
  }
}

/**
 * Student Queries Management
 */

export interface StudentQuery {
  id: number;
  name: string;
  age?: string;
  city: string;
  locality: string;
  student_class: string;
  subject: string;
  topic: string;
  phone: string;
  email: string;
  attending_offline_classes: string;
  status: 'pending' | 'in_progress' | 'resolved';
  video_url?: string;
  resolved_at?: Date;
  created_at: Date;
}

export async function insertStudentQuery(data: {
  name: string;
  age?: string;
  city: string;
  locality: string;
  studentClass: string;
  subject: string;
  topic: string;
  phone: string;
  email: string;
  attendingOfflineClasses: string;
}): Promise<{ id: number; created_at: Date }> {
  const sql = getDb();
  try {
    const result = await sql`
      INSERT INTO student_queries (
        name, age, city, locality, student_class, subject, topic, 
        phone, email, attending_offline_classes, status, source
      )
      VALUES (
        ${data.name}, ${data.age || null}, ${data.city}, ${data.locality}, 
        ${data.studentClass}, ${data.subject}, ${data.topic}, 
        ${data.phone}, ${data.email}, ${data.attendingOfflineClasses}, 
        'pending', 'website'
      )
      RETURNING id, created_at
    ` as Array<{ id: number; created_at: Date }>;

    return result[0];
  } catch (error) {
    console.error('Error inserting student query:', error);
    throw error;
  }
}

export async function getStudentQueries(limit = 100): Promise<StudentQuery[]> {
  const sql = getDb();
  try {
    const result = await sql`
      SELECT * FROM student_queries
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return result as StudentQuery[];
  } catch (error) {
    console.error('Error fetching student queries:', error);
    throw error;
  }
}

export async function updateStudentQueryStatus(
  id: number,
  status: 'pending' | 'in_progress' | 'resolved',
  videoUrl?: string
): Promise<void> {
  const sql = getDb();
  try {
    if (status === 'resolved' && videoUrl) {
      await sql`
        UPDATE student_queries
        SET status = ${status}, video_url = ${videoUrl}, resolved_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE student_queries
        SET status = ${status}
        WHERE id = ${id}
      `;
    }
  } catch (error) {
    console.error('Error updating student query status:', error);
    throw error;
  }
}

/**
 * Food Alerts Management
 */

export interface FoodAlert {
  id: number;
  donor_type: string;
  establishment_name: string;
  contact_person_name: string;
  phone: string;
  address: string;
  city: string;
  quantity: string;
  prepared_at: string;
  expiry_estimate: string;
  photo_url?: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  pickup_photo_url?: string;
  delivery_photo_url?: string;
  assigned_volunteer?: string;
  created_at: Date;
  updated_at: Date;
}

export async function insertFoodAlert(data: {
  donorType: string;
  establishmentName: string;
  contactPersonName: string;
  phone: string;
  address: string;
  city: string;
  quantity: string;
  preparedAt: string;
  expiryEstimate: string;
  photoUrl?: string;
}): Promise<{ id: number; created_at: Date }> {
  const sql = getDb();
  try {
    const result = await sql`
      INSERT INTO food_alerts (
        donor_type, establishment_name, contact_person_name, phone, 
        address, city, quantity, prepared_at, expiry_estimate, 
        photo_url, status, source
      )
      VALUES (
        ${data.donorType}, ${data.establishmentName}, ${data.contactPersonName}, 
        ${data.phone}, ${data.address}, ${data.city}, ${data.quantity}, 
        ${data.preparedAt}, ${data.expiryEstimate}, ${data.photoUrl || null}, 
        'pending', 'website'
      )
      RETURNING id, created_at
    ` as Array<{ id: number; created_at: Date }>;

    return result[0];
  } catch (error) {
    console.error('Error inserting food alert:', error);
    throw error;
  }
}

export async function getFoodAlerts(limit = 100): Promise<FoodAlert[]> {
  const sql = getDb();
  try {
    const result = await sql`
      SELECT * FROM food_alerts
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return result as FoodAlert[];
  } catch (error) {
    console.error('Error fetching food alerts:', error);
    throw error;
  }
}

export async function updateFoodAlertStatus(
  id: number,
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled',
  data?: {
    assignedVolunteer?: string;
    pickupPhotoUrl?: string;
    deliveryPhotoUrl?: string;
  }
): Promise<void> {
  const sql = getDb();
  try {
    await sql`
      UPDATE food_alerts
      SET 
        status = ${status},
        assigned_volunteer = COALESCE(${data?.assignedVolunteer || null}, assigned_volunteer),
        pickup_photo_url = COALESCE(${data?.pickupPhotoUrl || null}, pickup_photo_url),
        delivery_photo_url = COALESCE(${data?.deliveryPhotoUrl || null}, delivery_photo_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Error updating food alert status:', error);
    throw error;
  }
}
