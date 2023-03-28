import { AppUser } from '@/lib/firebase';

export default function UserProfile ({ user }: { user: AppUser }) {
    return (
        <div className="box-center">
            <img src={user.photoURL} className="card-img-center" alt="user photo"/>
            <p>
                <i>@{user.username}</i>
            </p>
            <h1>{user.displayName}</h1>
        </div>
    );
}
