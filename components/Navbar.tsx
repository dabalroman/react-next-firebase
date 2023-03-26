import Link from 'next/link';
import { useContext } from 'react';
import { UserContext, UserContextType } from '@/lib/context';

export default function Navbar () {
    const {
        user,
        username
    }: UserContextType = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">Feed</button>
                    </Link>
                </li>
                {username && (
                    <>
                        <li>
                            <Link href="/admin">
                                <button className="btn-blue">Write posts</button>
                            </Link>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>{username}</span>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL ?? ''} alt="Logo"/>
                            </Link>
                        </li>
                    </>
                )}
                {!username && (
                    <>
                        <li>
                            <Link href="/enter">
                                <button className="btn-blue">Log in</button>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}
