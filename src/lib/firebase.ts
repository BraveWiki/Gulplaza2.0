import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getDatabase, Database } from 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
let app: FirebaseApp | null = null
let database: Database | null = null

try {
  if (typeof window !== 'undefined') {
    // Check if required config is available
    if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
      console.warn('⚠️ Firebase config not fully set. Chat will be disabled.')
    }

    // Only initialize on client side
    const apps = getApps()
    if (!apps.length) {
      app = initializeApp(firebaseConfig)
      database = getDatabase(app)
      console.log('✅ Firebase initialized successfully')
    } else {
      app = apps[0]
      database = getDatabase(app)
      console.log('✅ Firebase using existing app')
    }
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error)
  // Don't throw - let the app work without chat
}

export { app, database }
