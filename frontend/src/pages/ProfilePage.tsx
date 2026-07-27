import React, { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/CSS/ProfilePage.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import api from '../api/axiosConfig'; // Import the configured axios instance

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  profileUrl?: string;
  projectRole: string;
  emailNotifications: boolean;
  id: number;
}

interface MyJwtPayload {
  sub: string;
  username: string;
  role: string;
  userId: number;
  FirstName: string;
  LastName: string;
  exp: number;
  iat: number;
  profileUrl?: string; // Optional profile URL claim
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [initialProfile, setInitialProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    profileUrl: undefined,
    projectRole: 'Lead Worldbuilder',
    emailNotifications: true,
    id: 0,
  });

  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    

    (async () => {
      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        const res = await api.get(`/auth/${decoded.userId}/profile`, {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        const profileData = res.data;
      
      const loadedProfile: UserProfile = {
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        profileUrl: profileData.profileUrl || undefined,
        projectRole: 'Lead Worldbuilder',
        emailNotifications: true,
        id: decoded.userId,
      };

      setInitialProfile(loadedProfile);
      setProfile(loadedProfile);



    } catch (err) {
      console.error("Invalid or expired token:", err);
      localStorage.removeItem('token');
      navigate('/login');
    }
    })();
  }, [navigate]);

  // Track field edits
  const handleChange = (field: keyof UserProfile, value: string | boolean | undefined) => {
    setProfile((prev) => {
      const updated = { ...prev, [field]: value };
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(initialProfile));
      return updated;
    });
  };

  // Trigger file picker
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Upload image to server immediately when selected
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const data = await res.json();

      if (data.imageUrl) {
        handleChange('profileUrl', data.imageUrl);
      } else {
        console.warn("Upload response missing 'imageUrl' key:", data);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image. Please check server logs or network connection.");
    } finally {
      setIsUploading(false);
    }
  };

  // Save profile state updates to the API
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/update-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });

      if (!res.ok) {
        throw new Error(`Failed to save profile. Status: ${res.status}`);
      }

      setInitialProfile(profile);
      setHasChanges(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setHasChanges(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Resolve absolute backend path vs full HTTP URLs
  const getImageUrl = () => {
    if (!profile.profileUrl) return null;
    if (profile.profileUrl.startsWith("http://") || profile.profileUrl.startsWith("https://") || profile.profileUrl.startsWith("blob:")) {
      return profile.profileUrl;
    }
    const cleanPath = profile.profileUrl.startsWith("/") ? profile.profileUrl : `/${profile.profileUrl}`;
    return `http://localhost:8080${cleanPath}`;
  };

  const currentImageUrl = getImageUrl();

  return (
    <div className="profile-container">
      <div className="profile-wrapper">

        {/* Header */}
        <header className="profile-header">
          <div className="header-title-group">
            <h1>Account Settings</h1>
          </div>
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Back
          </button>
        </header>

        {/* Profile Avatar Card */}
        <section className="profile-card">
          <div className="avatar-section">
            <div className="avatar-wrapper" onClick={handleAvatarClick}>
              {currentImageUrl ? (
                <img src={currentImageUrl} alt="Profile" className="avatar-img" />
              ) : (
                <div className="avatar-placeholder">
                  {profile.firstName ? profile.firstName[0].toUpperCase() : 'U'}
                </div>
              )}
              <div className="avatar-overlay">
                {isUploading ? "Uploading..." : "Change Photo"}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <div className="avatar-info">
              <h2>{profile.firstName} {profile.lastName}</h2>
            </div>
          </div>
        </section>

        {/* Form Settings */}
        <section className="profile-card form-section">
          <h3 className="section-title">Personal Details</h3>

          <div className="form-grid">
            {/* First Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                className="form-input"
                value={profile.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                className="form-input"
                value={profile.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </div>

            {/* Read-Only Email */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input readonly"
                value={profile.email}
                readOnly
              />
              <p className="input-hint">🔒 Email address is managed by your account authentication and cannot be changed here.</p>
            </div>
          </div>
        </section>

        {/* Save Bar */}
        {hasChanges && (
          <div className="save-bar">
            <span className="save-bar-text">You have unsaved changes</span>
            <div className="save-bar-actions">
              {/* <button onClick={handleCancel} className="btn-cancel">Discard</button> */}
              <button onClick={handleSave} className="btn-save" disabled={isUploading}>
                {isUploading ? "Uploading Image..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Logout / Danger Zone */}
        <section className="danger-card">
          <div className="danger-info">
            <h3>Log Out</h3>
            <p>Safely sign out of your session on this device</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Log Out
          </button>
        </section>

      </div>
    </div>
  );
}