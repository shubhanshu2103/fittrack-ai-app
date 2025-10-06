// client/src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import Button from '../components/button.jsx';
import Input from '../components/input.jsx';

const ProfilePage = () => {
  // Dummy data, which we will later fetch from our API
  const [formData, setFormData] = useState({
    name: 'Sophia Carter',
    email: 'sophia.carter@example.com',
    phone: '+1 (555) 123-4567',
  });

  const [preferences, setPreferences] = useState({
    language: 'English',
    theme: 'Dark',
    units: 'Metric',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePreferenceChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Here we would make an API call to save the changes
    console.log('Saving profile...', { formData, preferences });
    setTimeout(() => setIsLoading(false), 1500); // Simulate API call
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="text-slate-400 mt-1">Manage your personal information and preferences.</p>
      </header>

      <div className="max-w-4xl mx-auto bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
        <form onSubmit={handleSubmit}>
          {/* Profile Header Section */}
          <div className="flex items-center space-x-6 mb-8">
            <img 
              src="https://i.pravatar.cc/150?u=sophia" 
              alt="User Avatar" 
              className="w-24 h-24 rounded-full border-4 border-cyan-500"
            />
            <div>
              <h2 className="text-2xl font-bold">{formData.name}</h2>
              <p className="text-cyan-400">Premium Member</p>
              <button type="button" className="text-sm mt-2 px-4 py-1 bg-slate-700 rounded-full hover:bg-slate-600">
                Change Avatar
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-slate-700 pb-2">Personal Details</h3>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Name</label>
                <Input name="name" type="text" value={formData.name} onChange={handleFormChange} />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Email</label>
                <Input name="email" type="email" value={formData.email} onChange={handleFormChange} />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Phone</label>
                <Input name="phone" type="tel" value={formData.phone} onChange={handleFormChange} />
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
               <h3 className="text-lg font-semibold border-b border-slate-700 pb-2">Preferences</h3>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Language</label>
                <select name="language" value={preferences.language} onChange={handlePreferenceChange} className="w-full p-3 bg-slate-800 text-white rounded-lg border-2 border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option>English</option>
                  <option>Spanish</option>
                </select>
              </div>
               <div>
                <label className="text-sm text-slate-400 mb-1 block">Theme</label>
                <select name="theme" value={preferences.theme} onChange={handlePreferenceChange} className="w-full p-3 bg-slate-800 text-white rounded-lg border-2 border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option>Dark</option>
                  <option>Light</option>
                </select>
              </div>
               <div>
                <label className="text-sm text-slate-400 mb-1 block">Measurement Units</label>
                <select name="units" value={preferences.units} onChange={handlePreferenceChange} className="w-full p-3 bg-slate-800 text-white rounded-lg border-2 border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option>Metric</option>
                  <option>Imperial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-auto px-8">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;