import { collectionGroup, getDocs, limit, orderBy, query, startAfter, Timestamp, where } from '@firebase/firestore';
import { firestore, Post, postToJSON } from '@/lib/firebase';
import { useState } from 'react';
import PostFeed from '@/components/PostFeed';
import Loader from '@/components/Loader';
import Metatags from '@/components/Metatags';

const LIMIT = 3;

export async function getServerSideProps () {
    const q = query(
        collectionGroup(firestore, 'posts'),
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        limit(LIMIT)
    );

    const posts = (await getDocs(q)).docs.map(postToJSON);

    return {
        props: { posts }
    };
}

export default function Home (props: { posts: Post[] }) {
    const [posts, setPosts] = useState<Post[]>(props.posts);
    const [loading, setLoading] = useState<boolean>(false);
    const [postsEnd, setPostsEnd] = useState<boolean>(false);

    const getMorePosts = async () => {
        setLoading(true);
        const last = posts[posts.length - 1];

        const cursor: Timestamp = typeof last.createdAt === 'number'
            ? Timestamp.fromMillis(last.createdAt)
            : last.createdAt;

        const q = query(
            collectionGroup(firestore, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            startAfter(cursor),
            limit(LIMIT)
        );

        const newPosts: Post[] = (await getDocs(q)).docs.map(postToJSON);

        setPosts(posts.concat(newPosts));
        setLoading(false);

        if (newPosts.length < LIMIT) {
            setPostsEnd(true);
        }
    };

    return (
        <main>
            <Metatags title="Home"/>
            <PostFeed posts={posts} admin={false}/>
            {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
            <Loader show={loading}/>
            {postsEnd && <p style={{textAlign: 'center'}}>You have reached the end!</p>}
        </main>
    );
}
