import { FirebaseApp, getApp, initializeApp } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider } from '@firebase/auth';
import { Firestore, getFirestore } from '@firebase/firestore';
import { FirebaseStorage, getStorage } from '@firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyB5rbJf6S1pq4MI5_PO560YvJ9zsduJkJA',
    authDomain: 'fireapp-course.firebaseapp.com',
    projectId: 'fireapp-course',
    storageBucket: 'fireapp-course.appspot.com',
    messagingSenderId: '395208071836',
    appId: '1:395208071836:web:99ecaff3f5a60f77f36b59'
};

function createFirebaseApp (config: {}) {
    try {
        return getApp();
    } catch {
        return initializeApp(config);
    }
}

const firebaseApp: FirebaseApp = createFirebaseApp(firebaseConfig);

// @ts-ignore
export const auth: Auth = getAuth(firebaseApp);
export const googleAuthProvider: GoogleAuthProvider = new GoogleAuthProvider();
// @ts-ignore
export const firestore: Firestore = getFirestore(firebaseApp);
// @ts-ignore
export const storage: FirebaseStorage = getStorage(firebaseApp);
