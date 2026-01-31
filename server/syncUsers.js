const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function syncUsersToFirestore() {
  try {
    console.log('Starting user sync...');
    
    let syncedCount = 0;
    let errorCount = 0;
    
    // List all users (up to 1000 per batch)
    const listAllUsers = async (nextPageToken) => {
      const listUsersResult = await auth.listUsers(1000, nextPageToken);
      
      for (const userRecord of listUsersResult.users) {
        try {
          // Check if user document already exists
          const userDoc = await db.collection('users').doc(userRecord.uid).get();
          
          if (!userDoc.exists) {
            // Parse display name if available
            const displayName = userRecord.displayName || '';
            const nameParts = displayName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Create user document in Firestore
            await db.collection('users').doc(userRecord.uid).set({
              email: userRecord.email || '',
              firstName: firstName,
              lastName: lastName,
              phone: userRecord.phoneNumber || '',
              createdAt: new Date(userRecord.metadata.creationTime),
              lastActive: new Date(userRecord.metadata.lastSignInTime || userRecord.metadata.creationTime),
              role: 'user',
              syncedFromAuth: true
            });
            
            syncedCount++;
            console.log(`✓ Synced user: ${userRecord.email}`);
          } else {
            console.log(`- User already exists: ${userRecord.email}`);
          }
        } catch (error) {
          errorCount++;
          console.error(`✗ Error syncing user ${userRecord.email}:`, error.message);
        }
      }
      
      // If there are more users, continue with next page
      if (listUsersResult.pageToken) {
        await listAllUsers(listUsersResult.pageToken);
      }
    };
    
    // Start syncing from the first page
    await listAllUsers();
    
    console.log('\n=== Sync Complete ===');
    console.log(`Total users synced: ${syncedCount}`);
    console.log(`Errors: ${errorCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Fatal error during sync:', error);
    process.exit(1);
  }
}

// Run the sync
syncUsersToFirestore();
