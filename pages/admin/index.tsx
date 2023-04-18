import Metatags from '@/components/Metatags';
import AuthCheck from '@/components/AuthCheck';
import { auth, firestore, postToJSON } from '@/lib/firebase';
import { collection, doc, orderBy, query, serverTimestamp, setDoc } from '@firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import PostFeed from '@/components/PostFeed';
import { useRouter } from 'next/router';
import { FormEvent, useContext, useState } from 'react';
import { UserContext, UserContextType } from '@/lib/context';
import toast from 'react-hot-toast';
import kebabCase from 'lodash.kebabcase';


export default function AdminPostsPage ({}) {
    return (
        <main>
            <AuthCheck>
                <Metatags title="Admin page"/>
                <PostList/>
                <CreateNewPost/>
            </AuthCheck>
        </main>
    );
}

function PostList () {
    if (!auth.currentUser) {
        throw new Error('User is null');
    }

    const ref = collection(firestore, 'users', auth?.currentUser.uid, 'posts');
    const postQuery = query(ref, orderBy('createdAt'));

    const [querySnapshot] = useCollection(postQuery);
    const posts = querySnapshot?.docs.map((doc) => postToJSON(doc)) ?? [];

    return (
        <>
            <h1>Manage your Posts</h1>
            <PostFeed posts={posts} admin={true}/>
        </>
    );

}

function CreateNewPost () {
    const router = useRouter();
    const { username } = useContext<UserContextType>(UserContext);
    const [title, setTitle] = useState('');

    const slug = encodeURI(kebabCase(title));

    const isValid = title.length > 3 && title.length < 100;

    const createPost = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!auth.currentUser) {
            throw new Error('User is null');
        }

        const ref = doc(firestore, 'users', auth?.currentUser.uid, 'posts', slug);

        const data = {
            title,
            slug,
            uid: auth?.currentUser.uid,
            username,
            published: false,
            content: '# hello world',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0
        };

        await setDoc(ref, data);
        toast.success('Post created!');
        await router.push(`/admin/${slug}`);
    };

    return (
        <form onSubmit={createPost}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My awesome article!"
                className="input"
            />
            <p>
                <strong>Slug:</strong> {slug}
            </p>
            <button type="submit" disabled={!isValid} className="btn-green">
                Create New Post
            </button>
        </form>
    );
}
