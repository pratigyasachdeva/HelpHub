import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  FileText,
  BookCopy,
  HandHelping,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';
import { subscribeApprovedResources } from '../services/resourceService';
import { RESOURCE_CATEGORIES } from '../utils/pricingAndDates';
import ResourceCard from '../features/resources/ResourceCard';

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    return subscribeApprovedResources((list) => setFeatured(list));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/dashboard/browse?q=${encodeURIComponent(searchQuery)}`);
  };

  const totalDownloads = featured.reduce((acc, r) => acc + (r.totalDownloads || 0), 0);
  const completedRentals = featured.reduce((acc, r) => acc + (r.completedRentalsCount || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-indigo-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-900/90 border border-indigo-800 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Student & Neighborhood Knowledge Commons
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Share Resources. Exchange Knowledge. Help Each Other.
          </h1>
          <p className="text-base sm:text-lg text-indigo-200 max-w-2xl mx-auto">
            Download verified study PDFs for free, rent physical spiral-bound notes from ₹3 to ₹10/day, and collaborate on academic or community help requests.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2.5 pt-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Data Structures, Calculus, Circuit Design, PYQs..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-slate-900 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors"
            >
              Search Notes
            </button>
          </form>

          {/* Live Platform Statistics */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto pt-8 border-t border-indigo-900/80">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{featured.length}</p>
              <p className="text-xs text-indigo-300">Active Resources</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{totalDownloads}</p>
              <p className="text-xs text-indigo-300">PDF Downloads</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{completedRentals}</p>
              <p className="text-xs text-indigo-300">Completed Rentals</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How HelpHub Works</h2>
          <p className="text-sm text-slate-600 mt-2">
            Three integrated workflows built for students and local communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: FileText,
              title: '1. Digital PDF Notes & Verified Reviews',
              desc: 'Upload PDFs to Firebase Storage. Only verified downloaders can submit 1–5 star ratings and helpfulness scores.',
            },
            {
              icon: BookCopy,
              title: '2. ₹3–₹10/Day Physical Copy Rentals',
              desc: 'Fair page-count pricing slabs, conflict-free calendar booking, explicit handover confirmation, and return tracking.',
            },
            {
              icon: HandHelping,
              title: '3. Peer & Community Help Board',
              desc: 'Post study questions or neighborhood assistance requests, review incoming offers, and track completion in real time.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-indigo-950 text-emerald-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Browse by Subject Category</h3>
          <div className="flex flex-wrap gap-2.5">
            {RESOURCE_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/dashboard/browse?category=${encodeURIComponent(cat)}`}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-indigo-950 hover:text-indigo-950 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Resources */}
        {featured.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Recently Shared Resources</h3>
              <Link to="/dashboard/browse" className="text-sm font-semibold text-indigo-950 inline-flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featured.slice(0, 3).map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
