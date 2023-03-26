import Link from 'next/link';
import { User } from '@firebase/auth';

export default function Navbar () {
    const user: User | null = null;
    const username: string | null = null;

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className='btn-logo'>Feed</button>
                    </Link>
                </li>
                {username && (
                    <>
                        <li>
                            <Link href="/admin">
                                <button className='btn-blue'>Write posrs</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL} alt="Logo"/>
                            </Link>
                        </li>
                    </>
                )}
                {!username && (
                    <>
                        <li>
                            <Link href='/enter'>
                                <button className='btn-blue'>Log in</button>
                            </Link>
                        </li>
                    </>
                    )}
            </ul>
        </nav>
    );
}
