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

    const url = admin ? `/admin/${post.slug}` : `/${post.username}/${post.slug}`;

    return (
        <div className="card">
            <Link href={url}>
                <strong>By @{post.username}</strong>
            </Link>
            <Link href={url}>
                <h2>{post.title}</h2>
            </Link>

            <footer>
                <span>{wordCount} words. It will take you <b>{minutesToRead} min</b> to read through.</span>
                <span>❤️ {post.heartCount} Hearts</span>
            </footer>
        </div>
    );
}

PostItem.defaultProps = {
    admin: false
}
