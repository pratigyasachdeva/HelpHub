import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/authentication/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './features/authentication/LoginPage';
import SignupPage from './features/authentication/SignupPage';
import ForgotPasswordPage from './features/authentication/ForgotPasswordPage';
import ProfileSettingsPage from './features/authentication/ProfileSettingsPage';

import DashboardOverviewPage from './pages/DashboardOverviewPage';
import BrowseResourcesPage from './features/resources/BrowseResourcesPage';
import ResourceDetailPage from './features/resources/ResourceDetailPage';
import UploadResourcePage from './features/resources/UploadResourcePage';
import MyListingsPage from './features/resources/MyListingsPage';
import MyDownloadsPage from './features/resources/MyDownloadsPage';
import MyRentalsPage from './features/rentals/MyRentalsPage';
import CommunityHelpPage from './features/help/CommunityHelpPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboardPage from './features/admin/AdminDashboardPage';
import { isSupabaseConfigured } from './supabase/client';

export default function App() {
  const { isFirebaseConfigured } = useAuth();

  return (
    <>
      {!isFirebaseConfigured && (
        <div className="bg-amber-500 text-slate-950 text-xs font-semibold px-4 py-2 text-center">
          Setup Notice: Copy <code>.env.example</code> to <code>.env</code> and add your Firebase Web SDK keys to activate live Authentication, Firestore, and Storage.
        </div>
      )}
      {isFirebaseConfigured && !isSupabaseConfigured && (
        <div className="bg-amber-100 text-amber-950 text-xs font-semibold px-4 py-2 text-center">
          File uploads need Supabase Storage setup. Add the Supabase URL and publishable key to <code>.env</code>.
        </div>
      )}

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverviewPage />} />
          <Route path="browse" element={<BrowseResourcesPage />} />
          <Route path="resources/:id" element={<ResourceDetailPage />} />
          <Route path="upload" element={<UploadResourcePage />} />
          <Route path="help" element={<CommunityHelpPage />} />
          <Route path="listings" element={<MyListingsPage />} />
          <Route path="downloads" element={<MyDownloadsPage />} />
          <Route path="rentals" element={<MyRentalsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
          <Route
            path="admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
