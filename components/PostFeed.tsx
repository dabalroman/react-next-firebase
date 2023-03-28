import { Post } from '@/lib/firebase';
import React from 'react';
import Link from 'next/link';

export default function PostFeed ({
    posts,
    admin
}: { posts: Post[], admin: boolean }) {
    return <>
        {posts.map((post: Post) => <PostItem post={post} key={post.slug} admin={admin}/>)}
    </>;
}

function PostItem ({
    post,
    admin
}: { post: Post, admin: boolean }) {
    const wordCount = post.content.trim()
        .split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);

    return (
        <div className="card">
            <Link href={`/${post.username}`}>
                <strong>By @{post.username}</strong>
            </Link>
            <Link href={`/${post.username}/${post.slug}`}>
                <h2>{post.title}</h2>
            </Link>

            <footer>
                <span>{wordCount} words. It will take you <b>{minutesToRead} min</b> to read.</span>&nbsp;
                <span>❤️ {post.heartCount} Hearts</span>
            </footer>
        </div>
    );
}
