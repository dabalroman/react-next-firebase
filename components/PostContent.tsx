import { Post } from '@/lib/firebase';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function PostContent ({ post }: { post: Post }) {
    const createdAt = typeof post.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

    return (
        <div className="card">
            <h1>{post.title}</h1>
            <span className="text-sm">
                Written by {' '}
                <Link className="text-info" href={`/${post.username}/`}>
                    @{post.username}
                </Link>
                &nbsp; on {createdAt.toString()}
            </span>

            <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
    );
}
