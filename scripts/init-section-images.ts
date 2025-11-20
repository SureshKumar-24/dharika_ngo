import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const sql = neon(process.env.DATABASE_URL);

async function initSectionImages() {
  try {
    console.log('Dropping existing section_images table if exists...');
    await sql`DROP TABLE IF EXISTS section_images`;
    
    console.log('Creating section_images table...');

    // Create section_images table
    await sql`
      CREATE TABLE section_images (
        id SERIAL PRIMARY KEY,
        section_name VARCHAR(50) NOT NULL,
        image_key VARCHAR(20) NOT NULL,
        image_url TEXT NOT NULL,
        alt_text VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(section_name, image_key)
      )
    `;

    console.log('✓ section_images table created');

    // Insert current hardcoded images
    console.log('Inserting current images...');

    const images = [
      // Food Drives Images
      {
        section_name: 'food_drives',
        image_key: 'image1',
        image_url: 'https://res.cloudinary.com/dsr89dej0/image/upload/v1763639656/Dharika/gallery/dtaq1fx9bvbcrjrngbg1.jpg',
        alt_text: 'Food distribution event',
        display_order: 1,
      },
      {
        section_name: 'food_drives',
        image_key: 'image2',
        image_url: 'https://res.cloudinary.com/dsr89dej0/image/upload/v1763573388/Dharika/gallery/xxm7p9tpc6hrje6phuze.jpg',
        alt_text: 'Volunteers packing meals',
        display_order: 2,
      },
      {
        section_name: 'food_drives',
        image_key: 'image3',
        image_url: 'https://res.cloudinary.com/dsr89dej0/image/upload/v1763573391/Dharika/gallery/lf4cjqhztn9svqnwjcwj.jpg',
        alt_text: 'Community meal service',
        display_order: 3,
      },
      {
        section_name: 'food_drives',
        image_key: 'image4',
        image_url: 'https://res.cloudinary.com/dsr89dej0/image/upload/v1763573389/Dharika/gallery/lbedrmmfeoq9kdvjbhck.jpg',
        alt_text: 'Food donation collection',
        display_order: 4,
      },
      // Teaching Drives Images
      {
        section_name: 'teaching_drives',
        image_key: 'image1',
        image_url: 'https://res.cloudinary.com/dsr89dej0/image/upload/v1763637289/Dharika/gallery/ij1iao5pbnjtasg2mjpf.jpg',
        alt_text: 'Teaching session in progress',
        display_order: 1,
      },
      {
        section_name: 'teaching_drives',
        image_key: 'image2',
        image_url: 'https://res.cloudinary.com/dsr89dej0/image/upload/v1763637288/Dharika/gallery/nlrcndukbyrqtuqpqwg1.jpg',
        alt_text: 'Students learning new skills',
        display_order: 2,
      },
      {
        section_name: 'teaching_drives',
        image_key: 'image3',
        image_url: 'https://res.cloudinary.com/dsr89dej0/image/upload/v1763637289/Dharika/gallery/iyyunuzrizlkvlfxg2x0.jpg',
        alt_text: 'Volunteer teaching children',
        display_order: 3,
      },
      {
        section_name: 'teaching_drives',
        image_key: 'image4',
        image_url: 'https://res.cloudinary.com/dsr89dej0/image/upload/v1763573389/Dharika/gallery/tovc0dg3hxmwsutrmdc9.jpg',
        alt_text: 'Classroom activity',
        display_order: 4,
      },
      // Hero Carousel Images
      {
        section_name: 'hero_carousel',
        image_key: 'slide1',
        image_url: 'https://res.cloudinary.com/dsr89dej0/image/upload/v1763637288/Dharika/gallery/vd61u4egy7yevpn4e3jh.jpg',
        alt_text: 'Every Child Deserves a Window to the World',
        display_order: 1,
      },
      {
        section_name: 'hero_carousel',
        image_key: 'slide2',
        image_url: 'https://res.cloudinary.com/dsr89dej0/image/upload/v1763573388/Dharika/gallery/xxm7p9tpc6hrje6phuze.jpg',
        alt_text: 'A Shared Meal, A Shared Humanity',
        display_order: 2,
      },
      {
        section_name: 'hero_carousel',
        image_key: 'slide3',
        image_url: 'https://res.cloudinary.com/dsr89dej0/image/upload/v1763637290/Dharika/gallery/vtbwckj0bqy8finu44op.jpg',
        alt_text: 'Let\'s Build a Brighter Future',
        display_order: 3,
      },
    ];

    for (const image of images) {
      await sql`
        INSERT INTO section_images (section_name, image_key, image_url, alt_text, display_order)
        VALUES (${image.section_name}, ${image.image_key}, ${image.image_url}, ${image.alt_text}, ${image.display_order})
        ON CONFLICT (section_name, image_key) 
        DO UPDATE SET 
          image_url = EXCLUDED.image_url,
          alt_text = EXCLUDED.alt_text,
          display_order = EXCLUDED.display_order,
          updated_at = CURRENT_TIMESTAMP
      `;
    }

    console.log('✓ Images inserted successfully');
    console.log('\nDatabase initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

initSectionImages();
