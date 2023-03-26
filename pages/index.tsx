import { Inter } from 'next/font/google';
import Link from 'next/link';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function Home () {
    return (
        <main>
            <Loader show/>
            <h1>Hello world!</h1>
            <Link prefetch href={{
                pathname: '/[username]',
                query: { username: 'roman' }
            }}>
                Roman's profile
            </Link>

            <button onClick={() => toast.success('hello there!')}>Make a toast!</button>
        </main>
    );
}
