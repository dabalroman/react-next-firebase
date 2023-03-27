import { UserContext, UserContextType } from '@/lib/context';
import { useContext } from 'react';

export default function UserPage ({}) {
    const {
        username
    }: UserContextType = useContext(UserContext);

    return (
        <main>
            Hello {username}!
        </main>
    );
}
