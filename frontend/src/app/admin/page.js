'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { postsAPI, usersAPI } from '@/lib/api';
import PostModal from '@/components/PostModal';
import Tabs from '@/components/Tabs';
import { Plus, Edit2, Trash2, Shield, ShieldOff } from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('posts');

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [error, setError] = useState('');

  const tabs = [
    { id: 'posts', label: 'Posts Management' },
    { id: 'users', label: 'Users Management' },
  ];

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push('/');
    } else if (user && user.isAdmin) {
      if (activeTab === 'posts') {
        fetchPosts();
      } else if (activeTab === 'users') {
        fetchUsers();
      }
    }
  }, [user, authLoading, activeTab, router]);

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const data = await postsAPI.getAll();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({ title: '', content: '' });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setFormData({ title: post.title, content: post.content });
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPost(null);
    setFormData({ title: '', content: '' });
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitLoading(true);

    try {
      if (editingPost) {
        await postsAPI.update(editingPost.id, formData);
      } else {
        await postsAPI.create(formData);
      }
      closeModal();
      fetchPosts();
    } catch (err) {
      setError('Failed to save post');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postsAPI.delete(id);
      fetchPosts();
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await usersAPI.getAll();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    try {
      await usersAPI.updateRole(userId, !currentRole);
      fetchUsers();
      setError('');
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  if (authLoading) {
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

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-gray-800">Admin Panel</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"></div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}


      {activeTab === 'posts' && (
        <div>
          <div className="flex justify-end mb-6">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              Create New Post
            </button>
          </div>

          {postsLoading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <div className="text-gray-600">Loading posts...</div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800">All Posts</h2>
              </div>

              {posts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-600 text-lg font-medium mb-2">No posts yet</p>
                  <p className="text-gray-500">Create your first post!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {posts.map((post) => (
                    <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <span>{post.author?.username || 'Unknown'}</span>
                            </div>
                            <span>•</span>
                            <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => openEditModal(post)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}


      {activeTab === 'users' && (
        <div>
          {usersLoading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <div className="text-gray-600">Loading users...</div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
              </div>

              {users.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="text-gray-600 text-lg font-medium">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {u.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{u.username}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{u.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                u.isAdmin
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {u.isAdmin ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(u.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {u.id !== user.id ? (
                              <button
                                onClick={() => handleRoleToggle(u.id, u.isAdmin)}
                                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-white text-sm font-medium ${
                                  u.isAdmin
                                    ? 'bg-orange-600 hover:bg-orange-700'
                                    : 'bg-green-600 hover:bg-green-700'
                                }`}
                              >
                                {u.isAdmin ? (
                                  <>
                                    <ShieldOff className="w-4 h-4" />
                                    Remove Admin
                                  </>
                                ) : (
                                  <>
                                    <Shield className="w-4 h-4" />
                                    Make Admin
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="text-gray-400 italic font-normal">You</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <PostModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        post={editingPost}
        formData={formData}
        setFormData={setFormData}
        loading={submitLoading}
        error={error}
      />
    </div>
  );
}
