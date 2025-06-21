import 'dotenv/config';
import { initializeFirebaseAdmin } from '../lib/firebase-admin';
import { sampleBusinesses } from '../lib/sample-data';
import { promises as fs } from 'fs';
import path from 'path';

// Some random logo images (Unsplash, placeholder, etc.)
const logoImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&h=256',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=256&h=256',
  'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=256&h=256',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=256&h=256',
  '/placeholder-logo.png',
  '/placeholder-logo.svg',
];

// Some random owner images (UI Avatars, Unsplash, etc.)
const ownerImages = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/65.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/12.jpg',
  'https://randomuser.me/api/portraits/women/21.jpg',
  'https://ui-avatars.com/api/?name=Premium+Owner&background=0D8ABC&color=fff',
  '/placeholder-user.jpg',
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function zeroAnalytics() {
  return {
    views: 0,
    clicks: 0,
    leads: 0,
    whatsappClicks: 0,
    phoneClicks: 0,
    mapClicks: 0,
    lastVisit: '',
    dailyStats: {},
    topPages: [],
    deviceStats: { mobile: 0, desktop: 0, tablet: 0 },
    locationStats: {},
  };
}

async function resetSampleAnalytics() {
  const { db } = await initializeFirebaseAdmin();
  const businessesCollection = db.collection('businesses');
  const sampleIds = sampleBusinesses.map(b => b.id);

  for (const id of sampleIds) {
    const docRef = businessesCollection.doc(id);
    const doc = await docRef.get();
    if (doc.exists) {
      const data = doc.data();
      await docRef.update({
        analytics: zeroAnalytics(),
        logoUrl: getRandom(logoImages),
        ownerPictureUrl: getRandom(ownerImages),
        updatedAt: new Date().toISOString(),
      });
      if (data && data.businessName) {
        console.log(`🔄 Reset analytics for sample business: ${data.businessName}`);
      } else {
        console.log(`🔄 Reset analytics for sample business with id: ${id}`);
      }
    }
  }
  console.log('Sample analytics reset complete!');
}

resetSampleAnalytics();

async function migrateToFirestore() {
  try {
    // Initialize Firebase Admin
    const { db } = await initializeFirebaseAdmin();
    const businessesCollection = db.collection('businesses');

    // Migrate sample businesses
    for (const business of sampleBusinesses) {
      // Check if business already exists
      const docRef = businessesCollection.doc(business.id);
      const doc = await docRef.get();

      if (!doc.exists) {
        // Add timestamps and random images
        const businessWithTimestamps = {
          ...business,
          logoUrl: getRandom(logoImages),
          ownerPictureUrl: getRandom(ownerImages),
          analytics: zeroAnalytics(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Add to Firestore
        await docRef.set(businessWithTimestamps);
        console.log(`✅ Migrated business: ${business.businessName}`);
      } else {
        console.log(`⏭️ Business already exists: ${business.businessName}`);
      }
    }

    // Migrate existing JSON files
    const dataDir = path.join(process.cwd(), 'data');
    let files: string[] = [];
    try {
      files = await fs.readdir(dataDir);
    } catch (e) {
      // No data dir, skip
    }

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(dataDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const business = JSON.parse(content);

        // Skip sample businesses as they're already migrated
        if (business.id.startsWith('sample-')) {
          continue;
        }

        const docRef = businessesCollection.doc(business.id);
        const doc = await docRef.get();

        if (!doc.exists) {
          // Add random images to imported businesses too
          business.logoUrl = getRandom(logoImages);
          business.ownerPictureUrl = getRandom(ownerImages);
          business.analytics = zeroAnalytics();
          await docRef.set(business);
          console.log(`✅ Migrated business: ${business.businessName}`);
        } else {
          console.log(`⏭️ Business already exists: ${business.businessName}`);
        }
      }
    }

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migrateToFirestore(); 