import { doc, DocumentReference, increment, writeBatch } from '@firebase/firestore';
import { auth, firestore } from '@/lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';

export default function HeartButton ({ postRef }: { postRef: DocumentReference }) {
    const heartsRef = doc(firestore, postRef.path, 'hearts', auth.currentUser?.uid ?? '');
    const [heartDoc] = useDocument(heartsRef);

    const addHeart = async () => {
        const batch = writeBatch(firestore);

        batch.update(postRef, { heartCount: increment(1) });
        batch.set(heartsRef, { uid: auth.currentUser?.uid });

        await batch.commit();
    };

    const removeHeart = async () => {
        const batch = writeBatch(firestore);

        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(heartsRef);

        await batch.commit();
    };

    return heartDoc?.exists() ? (
        <button onClick={removeHeart}>💔 Unheart</button>
    ) : (
        <button onClick={addHeart}>❤️ Heart</button>
    );
}
