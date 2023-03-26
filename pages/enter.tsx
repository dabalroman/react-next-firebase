import { signInWithPopup } from '@firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase';
import { UserContext, UserContextType } from '@/lib/context';
import { useContext } from 'react';

export default function EnterPage ({}) {
    const {
        user,
        username
    }: UserContextType = useContext(UserContext);

    return (
        <main>
            {
                (user
                        ? (username ? <UsernameForm/> : <SignOutButton/>)
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

}
