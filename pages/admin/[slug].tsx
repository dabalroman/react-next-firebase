import AuthCheck from '@/components/AuthCheck';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { doc, DocumentData, DocumentReference, serverTimestamp, updateDoc } from '@firebase/firestore';
import { auth, firestore } from '@/lib/firebase';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import styles from '@/styles/Admin.module.css';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';

export default function AdminPostEdit ({}) {
    return (
        <AuthCheck>
            <PostManager/>
        </AuthCheck>
    );
}

function PostManager () {
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { slug } = router.query;

    const postRef = doc(firestore, 'users', auth.currentUser?.uid || '', 'posts', slug as string);
    const [post] = useDocumentDataOnce(postRef);

    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>
                        <PostForm postRef={postRef} defaultValues={post} preview={preview}/>
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm ({
    defaultValues,
    postRef,
    preview
}: { defaultValues: DocumentData, postRef: DocumentReference<DocumentData>, preview: boolean }) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState
    } = useForm({
        defaultValues,
        mode: 'onChange'
    });

    const {
        isValid,
        isDirty
    } = formState;

    const updatePost = async ({
        content,
        published
    }: any) => {
        await updateDoc(postRef, {
            content,
            published,
            updatedAt: serverTimestamp()
        });

        reset({
            content,
            published
        });

        toast.success('Post updated successfully');
    };

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>
                <ImageUploader/>

                <textarea {...register('content', {
                    maxLength: {
                        value: 2000,
                        message: 'The content is too long.'
                    },
                    minLength: {
                        value: 10,
                        message: 'The content is too short.'
                    },
                    required: {
                        value: true,
                        message: 'The content is required.'
                    }
                })}/>

                {formState.errors.content && (
                    <p className="text-danger">{formState.errors.content.message as string}</p>)}

                <fieldset>
                    <input className={styles.checkbox} type="checkbox" {...register('published')}/>
                    <label>Published</label>
                </fieldset>

                <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
                    {isDirty ? 'Save Changes' : 'No changes detected'}
                </button>
            </div>
        </form>
    );
}
