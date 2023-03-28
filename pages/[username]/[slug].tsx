import { firestore, getUserWithUsername, Post, postToJSON } from '@/lib/firebase';
import { collectionGroup, doc, DocumentSnapshot, getDoc, getDocs, limit, query } from '@firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import PostContent from '@/components/PostContent';
import Metatags from '@/components/Metatags';

export async function getStaticProps ({ params }: { params: { username: string, slug: string } }) {
    const {
        username,
        slug
    } = params;

    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
        return { notFound: true };
    }

    try {
        const postRef = doc(firestore, userDoc.ref.path, 'posts', slug);
        const post = postToJSON(await getDoc(postRef));
        const path = postRef.path;

        return {
            props: {
                post,
                path
            },
            revalidate: 100
        };
    } catch (e) {
        return { notFound: true };
    }
}

export async function getStaticPaths () {
    const q = query(collectionGroup(firestore, 'posts'), limit(20));
    const snapshot = await getDocs(q);

    const paths = snapshot.docs.map((doc: DocumentSnapshot) => {
        const {
            slug,
            username
        } = doc.data() as { slug: string, username: string };

        return {
            params: {
                username,
                slug
            }
        };
    });

    return {
        paths,
        fallback: 'blocking'
    };
}

export default function PostPage (props: { post: Post, path: string }) {
    const postDoc = doc(firestore, props.path);
    const [realtimePost] = useDocumentData(postDoc);

    const post: Post = realtimePost as Post || props.post;

    return (
        <main className="container">
            <Metatags title={post.title}/>
            <section>
                <PostContent post={post}/>
            </section>

            <aside className="card">
                <p>
                    <strong>{post.heartCount || 0} ❤️</strong>
                </p>
            </aside>
            <small style={{
                textAlign: 'center',
                display: 'block'
            }}>This post is kept {realtimePost ? 'up-to-date' : 'cached'} by our
                latest technology.</small>
        </main>
    );
}
