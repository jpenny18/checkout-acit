# Firebase User Sync Script

This script syncs existing Firebase Authentication users to Firestore.

## Setup Instructions

### 1. Get Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon (⚙️) next to "Project Overview"
4. Go to **Project Settings**
5. Navigate to the **Service Accounts** tab
6. Click **"Generate New Private Key"**
7. Save the downloaded JSON file as `serviceAccountKey.json` in this `server` folder

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Run the Sync Script

```bash
node syncUsers.js
```

## What This Script Does

- ✅ Lists all Firebase Authentication users
- ✅ Creates Firestore documents for users that don't have one
- ✅ Preserves existing Firestore user documents (won't overwrite)
- ✅ Extracts user data from Firebase Auth (email, creation time, etc.)
- ✅ Logs progress and any errors

## Output

The script will show:
- Each user being synced with a ✓ checkmark
- Users that already exist with a - dash
- Any errors with a ✗ mark
- Final summary with total synced users and error count

## Security Notes

⚠️ **IMPORTANT**: Never commit `serviceAccountKey.json` to version control!

The `.gitignore` file is already configured to exclude:
- `serviceAccountKey.json`
- `.env`
- `node_modules/`

## Running Again

You can run this script multiple times safely - it will only create documents for users that don't already have them in Firestore.
