'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { postsAPI } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PostDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && params.id) {
      fetchPost();
    }
  }, [user, authLoading, params.id]);

  const fetchPost = async () => {
    try {
      const data = await postsAPI.getById(params.id);
      if (data.id) {
        setPost(data);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-gray-600 text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-6">
            <div className="text-6xl mb-4">⚠️</div>
            <div className="text-red-600 font-semibold text-xl mb-2">{error || 'Post not found'}</div>
            <p className="text-red-700 text-sm">The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 mb-8 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back to Posts</span>
      </Link>

      <article className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-4xl mx-auto">
        <div className="p-6 sm:p-8 lg:p-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {post.author?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Author</div>
                <div className="text-gray-800 font-semibold">{post.author?.username || 'Unknown'}</div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap space-y-4">
              {post.content.split('\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index} className="mb-4">{paragraph}</p>
                ) : (
                  <br key={index} />
                )
              ))}
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></div>
      </article>
    </div>
  );
}
