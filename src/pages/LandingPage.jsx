
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
  BookOpen,
  GraduationCap,
  Download,
  Users,
  ArrowUpRight,
  CheckCircle2,
  Star,
  Library,
  MoveUpRight
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

  const totalDownloads = featured.reduce(
    (acc, r) => acc + (r.totalDownloads || 0),
    0
  );

  const completedRentals = featured.reduce(
    (acc, r) => acc + (r.completedRentalsCount || 0),
    0
  );

  const workflows = [
    {
      number: '01',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      title: 'Digital PDF Notes',
      subtitle: 'Learn without limits',
      desc: 'Upload PDFs to Firebase Storage. Only verified downloaders can submit 1–5 star ratings and helpfulness scores.',
      tag: 'DIGITAL LIBRARY'
    },
    {
      number: '02',
      icon: BookCopy,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      title: 'Physical Note Rentals',
      subtitle: 'Affordable learning',
      desc: 'Fair page-count pricing slabs, conflict-free calendar booking, explicit handover confirmation, and return tracking.',
      tag: '₹3–₹10 / DAY'
    },
    {
      number: '03',
      icon: HandHelping,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      title: 'Community Help Board',
      subtitle: 'Better together',
      desc: 'Post study questions or neighborhood assistance requests, review incoming offers, and track completion in real time.',
      tag: 'COMMUNITY'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD] text-slate-900 overflow-hidden">
      <PublicNavbar />

      <main className="flex-1">

        {/* ================= HERO ================= */}
        <section className="relative bg-[#0D1738] text-white overflow-hidden">

          {/* Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.25),transparent_50%)]" />
          <div className="absolute top-20 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]" />

          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-20 pb-16 lg:pt-28 lg:pb-24">

            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-8 items-center">

              {/* Hero Content */}
              <div className="text-center lg:text-left">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.07] border border-white/10 text-blue-200 text-[11px] sm:text-xs font-semibold tracking-wider mb-8">
                  <Sparkles size={14} className="text-emerald-400" />
                  STUDENT & NEIGHBORHOOD KNOWLEDGE COMMONS
                </div>

                <h1 className="text-[42px] sm:text-5xl lg:text-[62px] xl:text-[68px] font-extrabold leading-[1.08] tracking-[-0.04em]">
                  Share Resources.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-violet-300">
                    Exchange Knowledge.
                  </span>
                  <br />
                  Help Each Other.
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-slate-300/80 mt-7 leading-8 max-w-xl mx-auto lg:mx-0">
                  Download verified study PDFs for free, rent physical
                  spiral-bound notes from ₹3 to ₹10/day, and collaborate
                  on academic or community help requests.
                </p>

                {/* Search */}
                <form
                  onSubmit={handleSearch}
                  className="mt-9 max-w-2xl mx-auto lg:mx-0"
                >
                  <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-2xl shadow-2xl shadow-black/20">

                    <div className="relative flex-1">
                      <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes, subjects, PYQs..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-900 text-sm outline-none placeholder:text-slate-400 bg-transparent"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-7 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      Search Notes
                      <ArrowRight size={17} />
                    </button>

                  </div>
                </form>

                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mt-5 text-xs text-slate-400">
                  <span>Popular searches:</span>
                  {['Data Structures', 'Calculus', 'PYQs'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item);
                        navigate(`/dashboard/browse?q=${encodeURIComponent(item)}`);
                      }}
                      className="text-blue-200 hover:text-white transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Decorative Resource Illustration */}
              <div className="relative hidden lg:flex justify-center items-center min-h-[450px]">

                <div className="absolute w-[390px] h-[390px] rounded-full border border-white/10" />
                <div className="absolute w-[310px] h-[310px] rounded-full border border-white/10" />
                <div className="absolute w-[230px] h-[230px] rounded-full bg-indigo-500/10 blur-3xl" />

                {/* Main Card */}
                <div className="relative z-10 w-[290px] bg-white rounded-[28px] p-6 shadow-2xl shadow-black/30 rotate-[-5deg]">

                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <BookOpen size={25} />
                    </div>
                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                      VERIFIED
                    </span>
                  </div>

                  <p className="text-[10px] tracking-widest font-bold text-indigo-500 mt-7">
                    STUDY RESOURCE
                  </p>

                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    Data Structures
                    <br />
                    & Algorithms
                  </h3>

                  <p className="text-xs text-slate-400 mt-2">
                    Complete study material
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="h-2 rounded-full bg-slate-100 w-full" />
                    <div className="h-2 rounded-full bg-slate-100 w-4/5" />
                    <div className="h-2 rounded-full bg-slate-100 w-3/5" />
                  </div>

                  <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck size={16} className="text-emerald-500" />
                      Trusted resources
                    </div>
                    <ArrowUpRight size={18} className="text-indigo-600" />
                  </div>
                </div>

                {/* Floating Download Card */}
                <div className="absolute top-16 right-0 z-20 bg-white rounded-2xl p-4 shadow-xl rotate-[5deg]">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Download size={19} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Free PDF Access
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Learn anytime
                      </p>
                    </div>
                    <CheckCircle2 size={17} className="text-emerald-500 ml-2" />
                  </div>
                </div>

                {/* Floating Community Card */}
                <div className="absolute bottom-14 left-0 z-20 bg-white rounded-2xl p-4 shadow-xl rotate-[4deg]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Learn Together
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Share knowledge, grow together
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Statistics */}
            <div className="mt-20 lg:mt-24 pt-8 border-t border-white/10">
              <div className="grid grid-cols-3 max-w-3xl mx-auto lg:mx-0">

                <div className="text-center lg:text-left px-3">
                  <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {featured.length}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-2 font-medium">
                    Active Resources
                  </p>
                </div>

                <div className="text-center px-3 border-x border-white/10">
                  <p className="text-3xl sm:text-4xl font-extrabold text-blue-300 tracking-tight">
                    {totalDownloads}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-2 font-medium">
                    PDF Downloads
                  </p>
                </div>

                <div className="text-center lg:text-left lg:pl-8 px-3">
                  <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {completedRentals}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-2 font-medium">
                    Completed Rentals
                  </p>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-24">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-600 uppercase">
              SIMPLE. SMART. STUDENT-FIRST.
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4 tracking-tight">
              Everything you need to
              <span className="text-indigo-600"> learn better.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-500 mt-5 leading-relaxed">
              Three integrated workflows built to make knowledge
              sharing easier, more affordable, and accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {workflows.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="group relative bg-white rounded-[26px] border border-slate-200/80 p-7 sm:p-8 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/[0.05] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={26} strokeWidth={1.8} />
                    </div>

                    <span className="text-4xl font-extrabold text-slate-100 group-hover:text-indigo-100 transition-colors">
                      {item.number}
                    </span>
                  </div>

                  <div className="mt-8">
                    <span className="text-[10px] font-bold tracking-widest text-indigo-500">
                      {item.tag}
                    </span>

                    <h3 className="text-xl font-bold text-slate-900 mt-2">
                      {item.title}
                    </h3>

                    <p className="text-xs font-medium text-slate-400 mt-1">
                      {item.subtitle}
                    </p>

                    <p className="text-sm text-slate-500 mt-5 leading-7">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-8 h-1 w-10 rounded-full bg-indigo-500 group-hover:w-16 transition-all duration-300" />
                </div>
              );
            })}

          </div>
        </section>

        {/* ================= CATEGORIES ================= */}
        <section className="bg-white border-y border-slate-100 py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-9">
              <div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-600 uppercase">
                  FIND YOUR SUBJECT
                </span>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
                  Explore by category
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Find the right material for your next learning goal.
                </p>
              </div>

              <Link
                to="/dashboard/browse"
                className="text-sm font-bold text-indigo-600 inline-flex items-center gap-2 hover:gap-3 transition-all"
              >
                Explore all resources
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {RESOURCE_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/dashboard/browse?category=${encodeURIComponent(cat)}`}
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F8F9FD] border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-600/15 transition-all duration-200"
                >
                  {cat}
                  <MoveUpRight size={14} className="opacity-40 group-hover:opacity-100" />
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* ================= FEATURED RESOURCES ================= */}
        {featured.length > 0 && (
          <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-24">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-9">

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Library size={17} />
                  </div>
                  <span className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase">
                    COMMUNITY LIBRARY
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Recently shared resources
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Explore the latest study material from the community.
                </p>
              </div>

              <Link
                to="/dashboard/browse"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-800 transition-all"
              >
                View All Resources
                <ArrowRight size={17} />
              </Link>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 3).map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>

          </section>
        )}

        {/* ================= TRUST SECTION ================= */}
        <section className="px-5 sm:px-8 lg:px-12 pb-24">
          <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#111C46] to-[#293F83] p-9 sm:p-14">

            <div className="absolute -right-20 -top-32 w-96 h-96 border border-white/10 rounded-full" />
            <div className="absolute -right-5 -top-16 w-64 h-64 border border-white/10 rounded-full" />

            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">

              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-blue-200 text-xs font-bold tracking-widest">
                  <ShieldCheck size={17} />
                  BUILT ON TRUST
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-white mt-5 leading-tight">
                  Knowledge should be
                  <br />
                  accessible, not expensive.
                </h2>

                <p className="text-sm sm:text-base text-blue-100/70 mt-5 leading-relaxed max-w-xl">
                  HelpHub brings students and communities together
                  through affordable resources, verified reviews,
                  and meaningful collaboration.
                </p>
              </div>

              <div className="flex flex-col gap-4 lg:min-w-[220px]">
                <div className="flex items-center gap-3 text-sm text-white">
                  <CheckCircle2 className="text-emerald-400" size={19} />
                  Verified resource reviews
                </div>

                <div className="flex items-center gap-3 text-sm text-white">
                  <CheckCircle2 className="text-emerald-400" size={19} />
                  Secure cloud infrastructure
                </div>

                <div className="flex items-center gap-3 text-sm text-white">
                  <CheckCircle2 className="text-emerald-400" size={19} />
                  Affordable learning access
                </div>

                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 mt-4 px-6 py-3.5 rounded-xl bg-white text-indigo-950 text-sm font-bold hover:bg-blue-50 transition-colors"
                >
                  Discover HelpHub
                  <ArrowUpRight size={17} />
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
