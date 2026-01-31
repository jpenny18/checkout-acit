# 🔄 Sync Firebase Users to Firestore

## Quick Start Guide

This guide will help you sync all existing Firebase Authentication users to your Firestore database so they appear in the Admin Users page.

---

## 📋 Step-by-Step Instructions

### Step 1: Get Your Firebase Service Account Key

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **⚙️ Settings icon** (gear) next to "Project Overview"
4. Go to **"Project Settings"**
5. Click on the **"Service Accounts"** tab
6. Click the **"Generate New Private Key"** button
7. Click **"Generate Key"** in the confirmation dialog
8. A JSON file will download - this is your service account key

### Step 2: Place the Service Account Key

1. Rename the downloaded file to `serviceAccountKey.json`
2. Move it to the `server/` folder in your project:
   ```
   checkout-acit/
   └── server/
       └── serviceAccountKey.json  ← Place it here
   ```

### Step 3: Install Dependencies (if not already done)

```bash
cd server
npm install
```

### Step 4: Run the Sync Script

```bash
npm run sync-users
```

Or directly:
```bash
node syncUsers.js
```

---

## 📊 What You'll See

The script will output:
- ✓ **Green checkmarks** for users successfully synced
- - **Dashes** for users that already exist in Firestore
- ✗ **Red X marks** for any errors
- **Summary** at the end with total synced users

Example output:
```
Starting user sync...
✓ Synced user: user1@example.com
✓ Synced user: user2@example.com
- User already exists: user3@example.com

=== Sync Complete ===
Total users synced: 2
Errors: 0
```

---

## ✅ Verify the Sync

After running the script:

1. Go to your admin dashboard: `http://localhost:3000/admin`
2. Click on the **"Users"** tab
3. You should now see all your Firebase Auth users listed!
4. The **"Copy All Emails for BCC"** button will now work

---

## 🔒 Security Notes

**IMPORTANT**: The `serviceAccountKey.json` file contains sensitive credentials!

- ✅ It's already in `.gitignore` - will not be committed to git
- ✅ Never share this file publicly
- ✅ Never commit it to version control
- ✅ Store it securely

---

## 🔄 Running Again

You can safely run this script multiple times:
- It will NOT duplicate users
- It will NOT overwrite existing user data
- It only creates Firestore documents for users that don't have them yet

---

## 🆘 Troubleshooting

### "Cannot find module 'firebase-admin'"
Run: `cd server && npm install`

### "Error: Could not load the default credentials"
Make sure `serviceAccountKey.json` is in the `server/` folder

### "Permission denied"
Your service account needs Firestore write permissions. Check your Firebase Console IAM settings.

### Users still not showing up
1. Check that the script completed successfully
2. Refresh your admin page
3. Check your Firebase Console > Firestore Database to see if the `users` collection exists

---

## 📝 What Data Gets Synced?

For each Firebase Auth user, the script creates a Firestore document with:

- **email**: User's email address
- **firstName**: Parsed from display name (if available)
- **lastName**: Parsed from display name (if available)
- **phone**: Phone number (if available)
- **createdAt**: Account creation timestamp
- **lastActive**: Last sign-in timestamp
- **role**: Set to "user" by default
- **syncedFromAuth**: Flag indicating this was synced (true)

---

## 🎉 Done!

After syncing, all your existing users will appear in the Admin Users page, and you can:
- View all user information
- Copy all emails for BCC
- Export to CSV
- Edit or delete users

New users signing up will automatically be added to Firestore (no need to run this script again).
