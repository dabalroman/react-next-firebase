import { FirebaseApp, getApp, initializeApp } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider } from '@firebase/auth';
import {
    collection,
    Firestore,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    Query,
    query,
    QueryDocumentSnapshot,
    where
} from '@firebase/firestore';
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

/// Helper functions
export async function getUserWithUsername (username: string): Promise<QueryDocumentSnapshot> {
    const q: Query = query(
        collection(firestore, 'users'),
        where('username', '==', username),
        limit(1)
    );

    return (await getDocs(q)).docs[0];
}

export async function getUserPosts (userDoc: QueryDocumentSnapshot): Promise<Post[]> {
    const q: Query = query(
        collection(firestore, userDoc.ref.path, 'posts'),
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        limit(5)
    );

    return (await getDocs(q)).docs.map((doc: QueryDocumentSnapshot): Post => {
        const data = doc.data();

        return {
            ...data,
            createdAt: data.createdAt.toMillis() || 0,
            updatedAt: data.updatedAt.toMillis() || 0
        } as Post;
    });
}

export interface AppUser {
    displayName: string,
    username: string,
    photoURL: string
}

export interface Post {
    title: string,
    slug: string,
    uid: string,
    username: string,
    published: boolean,
    content: string,
    createdAt: number,
    updatedAt: number
    heartCount: number
}
