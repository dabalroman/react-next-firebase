import { signInWithPopup } from '@firebase/auth';
import { auth, firestore, googleAuthProvider } from '@/lib/firebase';
import { UserContext, UserContextType } from '@/lib/context';
import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import { doc, getDoc, writeBatch } from '@firebase/firestore';
import debounce from 'lodash.debounce';
import Metatags from '@/components/Metatags';

export default function EnterPage ({}) {
    const {
        user,
        username
    }: UserContextType = useContext(UserContext);

    return (
        <main>
            <Metatags title='Login page'/>
            {
                (user
                        ? (!username ? <UsernameForm/> : <SignOutButton/>)
                        : <SignInButton/>
                )
            }
        </main>
    );
}

function SignInButton () {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    };

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} alt="Google logo"/> Sign in with Google
        </button>
    );
}

function SignOutButton () {
    return <button onClick={() => auth.signOut()}>Sign out</button>;
}

function UsernameForm () {
    const [formValue, setFormValue] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const {
        user,
        username
    }: UserContextType = useContext(UserContext);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        const validation = /^[a-z0-9-.]{3,15}$/;

        if (value.length < 3) {
            setFormValue(value);
            setLoading(false);
            setIsValid(false);
        }

        if (validation.test(value)) {
            setFormValue(value);
            setLoading(true);
            setIsValid(false);
        }
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.uid) {
            throw new Error('User UID not present!');
        }

        const userDoc = doc(firestore, 'users', user?.uid);
        const usernameDoc = doc(firestore, 'usernames', formValue);

        await writeBatch(firestore)
            .set(
                userDoc,
                {
                    username: formValue,
                    photoURL: user.photoURL,
                    displayName: user.displayName
                }
            )
            .set(usernameDoc, { uid: user.uid })
            .commit();
    };

    const checkUsername = useCallback(
        debounce(async (username: string) => {
            if (username.length >= 3) {
                const ref = doc(firestore, 'usernames', username);
                const snapshot = await getDoc(ref);
                setIsValid(!snapshot.exists());
                setLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        checkUsername(formValue);
    }, [checkUsername, formValue]);

    return (
        !username && (
            <section>
                <h3>Choose username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="username" value={formValue} onChange={onChange}/>
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading}/>
                    <button type="submit" className="btn-green" disabled={!isValid}>Register</button>
                </form>

                <br/>
                <p>Form value: {formValue}</p>
                <p>Valid: {isValid.toString()}</p>
                <p>Loading: {loading.toString()}</p>
            </section>
        )
        || <p>No.</p>
    );
}

function UsernameMessage ({
    username,
    isValid,
    loading
}: { username: string, isValid: boolean, loading: boolean }) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username) {
        return <p className="text-danger">That username is already taken!</p>;
    }

    return <p></p>;
}
