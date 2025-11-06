'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { postsAPI } from '@/lib/api';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchPosts();
    }
  }, [user, authLoading]);

  const fetchPosts = async () => {
    try {
      const data = await postsAPI.getAll();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setError('Error loading posts');
      }
    } catch (err) {
      setError('Failed to load posts');
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-semibold text-lg mb-2">Error</div>
          <div className="text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-gray-800">
          All Posts
        </h1>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"></div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 sm:py-24">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl font-semibold text-gray-800 mb-2">No posts yet</p>
            <p className="text-gray-600">Create your first post through the admin panel!</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
            >
              <div className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {post.content.substring(0, 150)}
                  {post.content.length > 150 ? '...' : ''}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {post.author?.username || 'Unknown'}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
