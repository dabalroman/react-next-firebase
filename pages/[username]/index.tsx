import React from 'react';
import UserProfile from '@/components/UserProfile';
import PostFeed from '@/components/PostFeed';
import { AppUser, getUserPosts, getUserWithUsername, Post } from '@/lib/firebase';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import Metatags from '@/components/Metatags';

export async function getServerSideProps ({ query }: { query: NextParsedUrlQuery }) {
    const { username } = query;

    if (typeof username !== 'string') {
        return;
    }

    const userDoc: QueryDocumentSnapshot = await getUserWithUsername(username);

    if (!userDoc) {
        return {
            notFound: true
        };
    }

    const user = userDoc.data() as AppUser;
    const posts = await getUserPosts(userDoc);

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
            <Metatags title={`@${user.username}`}/>
            <UserProfile user={user}/>
            <PostFeed posts={posts} admin={false}/>
        </main>
    );
}
