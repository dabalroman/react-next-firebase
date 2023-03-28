import React from 'react';
import UserProfile from '@/components/UserProfile';
import PostFeed from '@/components/PostFeed';
import { AppUser, getUserPosts, getUserWithUsername, Post } from '@/lib/firebase';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { QueryDocumentSnapshot } from '@firebase/firestore';

export async function getServerSideProps ({ query }: { query: NextParsedUrlQuery }) {
    const { username } = query;

    if (typeof username !== 'string') {
        return;
    }

    const userDoc: QueryDocumentSnapshot = await getUserWithUsername(username);

    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data() as AppUser;
        posts = await getUserPosts(userDoc);
    }

    return {
        props: {
            user,
            posts
        }
    };
}

export default function UserProfilePage ({
    user,
    posts
}: { user: AppUser, posts: Post[] }) {
    return (
        <main>
            <UserProfile user={user}/>
            <PostFeed posts={posts} admin={false}/>
        </main>
    );
}
