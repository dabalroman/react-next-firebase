import { UserContext, UserContextType } from '@/lib/context';
import { useContext } from 'react';

export default function PostsPage ({}) {
    const {
        username
    }: UserContextType = useContext(UserContext);

    return (
        <main>
            Hello {username} slug!
        </main>
    );
}
