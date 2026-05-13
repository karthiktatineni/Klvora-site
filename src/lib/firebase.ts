import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/*
// App Check (Security) - Disabled temporarily for testing
if (typeof window !== "undefined") {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_KEY || "6Lc-your-key-here"),
    isTokenAutoRefreshEnabled: true,
  });
}
*/

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (client-side only)
export const analytics = typeof window !== "undefined"
  ? isSupported().then((yes) => (yes ? getAnalytics(app) : null))
  : null;

export default app;
