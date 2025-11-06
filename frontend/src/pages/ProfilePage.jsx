import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, changePassword } from '../services/api';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.success) {
        setUser(response.data);
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateUserProfile(formData);
      if (response.success) {
        setUser(response.data);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword(passwordData);
      if (response.success) {
        setMessage({ type: 'success', text: response.message });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading && !user) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation */}
      <div className="navbar bg-primary text-primary-content">
        <div className="flex-1">
          <button 
            className="btn btn-ghost normal-case text-xl"
            onClick={() => navigate('/')}
          >
            Food Hub
          </button>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><a href="/orders">Orders</a></li>
            <li><a href="/cart">Cart</a></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="avatar placeholder mb-4">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-20">
                    <span className="text-2xl">{user?.name?.[0] || 'U'}</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-center">{user?.name}</h2>
                <p className="text-center text-gray-500">{user?.email}</p>
                
                <div className="tabs tabs-boxed mt-4">
                  <button 
                    className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile
                  </button>
                  <button 
                    className={`tab ${activeTab === 'password' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('password')}
                  >
                    Password
                  </button>
                </div>

                <button 
                  className="btn btn-error btn-outline w-full mt-4"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                {message.text && (
                  <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
                    <span>{message.text}</span>
                    <button 
                      className="btn btn-sm btn-ghost"
                      onClick={() => setMessage({ type: '', text: '' })}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="card-title">Profile Information</h2>
                      {!isEditing && (
                        <button 
                          className="btn btn-primary"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <form onSubmit={handleProfileUpdate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Name</span>
                            </label>
                            <input 
                              type="text" 
                              className="input input-bordered"
                              value={formData.name || ''}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              required
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Email</span>
                            </label>
                            <input 
                              type="email" 
                              className="input input-bordered"
                              value={formData.email || ''}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              required
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Phone</span>
                            </label>
                            <input 
                              type="tel" 
                              className="input input-bordered"
                              value={formData.phone || ''}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                          </div>

                          <div className="form-control md:col-span-2">
                            <label className="label">
                              <span className="label-text">Address</span>
                            </label>
                            <textarea 
                              className="textarea textarea-bordered"
                              value={formData.address || ''}
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="form-control mt-6">
                          <div className="flex gap-2">
                            <button 
                              type="submit" 
                              className={`btn btn-primary ${loading ? 'loading' : ''}`}
                              disabled={loading}
                            >
                              Save Changes
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-ghost"
                              onClick={() => {
                                setIsEditing(false);
                                setFormData(user);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Name</label>
                            <p className="text-lg">{user?.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-lg">{user?.email}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Phone</label>
                            <p className="text-lg">{user?.phone || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Member Since</label>
                            <p className="text-lg">{user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-500">Address</label>
                            <p className="text-lg">{user?.address || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'password' && (
                  <div>
                    <h2 className="card-title mb-6">Change Password</h2>
                    <form onSubmit={handlePasswordChange}>
                      <div className="space-y-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Current Password</span>
                          </label>
                          <input 
                            type="password" 
                            className="input input-bordered"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            required
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">New Password</span>
                          </label>
                          <input 
                            type="password" 
                            className="input input-bordered"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            required
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Confirm New Password</span>
                          </label>
                          <input 
                            type="password" 
                            className="input input-bordered"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-control mt-6">
                        <button 
                          type="submit" 
                          className={`btn btn-primary ${loading ? 'loading' : ''}`}
                          disabled={loading}
                        >
                          Change Password
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;