#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if Firebase CLI is installed
function checkFirebaseCLI() {
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    console.log('✓ Firebase CLI is installed');
    return true;
  } catch (error) {
    console.error('❌ Firebase CLI is not installed');
    console.log('Install it with: npm install -g firebase-tools');
    return false;
  }
}

// Check if user is logged in to Firebase
function checkFirebaseAuth() {
  try {
    const result = execSync('firebase projects:list', { stdio: 'pipe', encoding: 'utf8' });
    console.log('✓ Firebase authentication verified');
    return true;
  } catch (error) {
    console.error('❌ Not logged in to Firebase');
    console.log('Login with: firebase login');
    return false;
  }
}

// Check if firebase.json exists
function checkFirebaseConfig() {
  const configPath = path.join(process.cwd(), 'firebase.json');
  if (fs.existsSync(configPath)) {
    console.log('✓ Firebase configuration found');
    return true;
  } else {
    console.error('❌ firebase.json not found');
    return false;
  }
}

// Deploy Firestore rules
function deployFirestoreRules() {
  try {
    console.log('📋 Deploying Firestore rules...');
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
    console.log('✓ Firestore rules deployed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to deploy Firestore rules:', error.message);
    return false;
  }
}

// Deploy Firestore indexes
function deployFirestoreIndexes() {
  try {
    console.log('📊 Deploying Firestore indexes...');
    execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
    console.log('✓ Firestore indexes deployed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to deploy Firestore indexes:', error.message);
    return false;
  }
}

// Initialize Firestore with sample data
function initializeSampleData() {
  try {
    console.log('🌱 Initializing sample data...');
    console.log('Note: Run the following in your Next.js app to populate sample data:');
    console.log('import { initializeFirebaseSchema } from "@/lib/firebase-schema";');
    console.log('await initializeFirebaseSchema();');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize sample data:', error.message);
    return false;
  }
}

// Main deployment function
async function deployFirebase() {
  console.log('🚀 Starting Firebase deployment...\n');

  // Pre-deployment checks
  if (!checkFirebaseCLI()) return;
  if (!checkFirebaseAuth()) return;
  if (!checkFirebaseConfig()) return;

  console.log('\n📋 Starting deployment process...\n');

  // Deploy Firestore components
  const rulesDeployed = deployFirestoreRules();
  const indexesDeployed = deployFirestoreIndexes();

  if (rulesDeployed && indexesDeployed) {
    console.log('\n✅ Firebase deployment completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your .env.local file with Firebase configuration');
    console.log('2. Run your Next.js application');
    console.log('3. Initialize sample data from the app or run the schema initialization');
    console.log('\n🔗 Firebase Console: https://console.firebase.google.com/');
  } else {
    console.log('\n❌ Firebase deployment failed');
    process.exit(1);
  }
}

// Run the deployment
if (require.main === module) {
  deployFirebase().catch(console.error);
}

module.exports = { deployFirebase };
