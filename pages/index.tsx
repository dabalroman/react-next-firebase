import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home () {
    return (
        <main>
            <h1>Hello world!</h1>
            <Link prefetch href={{
                pathname: '/[username]',
                query: { username: 'roman' }
            }}>
                Roman's profile
            </Link>
        </main>
    );
}
