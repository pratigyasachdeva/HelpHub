import React from 'react';
import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">About HelpHub</h1>
          <p className="text-slate-600 leading-relaxed">
            HelpHub bridges the gap between digital knowledge sharing and affordable physical study material access. Instead of letting spiral-bound notebooks sit unused after exams, students can list physical copies for ₹3 to ₹10 per day based on transparent page-count slabs while sharing searchable PDFs with peers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Verified Trust & Authenticity</h3>
              <p className="text-xs text-slate-600 mt-1">
                Ratings are restricted to users who actually downloaded a PDF or completed a physical rental, preventing spam or inflated popularity metrics.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Cloud-Native Security</h3>
              <p className="text-xs text-slate-600 mt-1">
                Built on Firebase Authentication, Cloud Firestore Security Rules, and Storage rules enforcing role-based access control.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
