
import React from 'react';
import { ShieldCheck, Cloud, BookOpen, 
  FileText, Users, ArrowUpRight, 
  GraduationCap, Sparkles } from 'lucide-react';

import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Trust & Authenticity',
    description:
      'Ratings are restricted to users who actually downloaded a PDF or completed a physical rental, preventing spam or inflated popularity metrics.',
    tag: 'TRUST FIRST',
  },
  {
    icon: Cloud,
    title: 'Cloud-Native Security',
    description:
      'Built on Firebase Authentication, Cloud Firestore Security Rules, and Storage rules enforcing role-based access control.',
    tag: 'SECURE BY DESIGN',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FC] text-slate-900 overflow-hidden">
      <PublicNavbar />

      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-24">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] -z-0" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-indigo-100/40 rounded-full blur-[100px] -z-0" />

          <div className="relative max-w-6xl mx-auto">
            <div className="flex justify-center mb-7">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 text-blue-700 text-xs font-bold tracking-widest shadow-sm">
                <Sparkles size={14} />
                OUR STORY
              </span>
            </div>

            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
                Making knowledge
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                  accessible to everyone.
                </span>
              </h1>

              <p className="mt-8 text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
                A smarter way to share knowledge, exchange study
                materials, and make learning more affordable.
                Because great notes deserve more than one semester.
              </p>
            </div>

            {/* Main About Card */}
            <div className="mt-16 bg-white rounded-[32px] border border-slate-200/80 shadow-[0_20px_70px_-30px_rgba(30,64,175,0.18)] overflow-hidden">
              <div className="grid lg:grid-cols-2">

                <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                  <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
                    About HelpHub
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-bold mt-4 leading-tight tracking-tight">
                    One platform.
                    <br />
                    <span className="text-slate-400">
                      Endless possibilities.
                    </span>
                  </h2>

                  <p className="mt-6 text-slate-600 leading-8 text-[15px]">
                    HelpHub bridges the gap between digital knowledge
                    sharing and affordable physical study material access.
                    Instead of letting spiral-bound notebooks sit unused
                    after exams, students can list physical copies for
                    ₹3 to ₹10 per day based on transparent page-count
                    slabs while sharing searchable PDFs with peers.
                  </p>

                  <div className="mt-8 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <GraduationCap size={23} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Built for students</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Powered by sharing and collaboration
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative Visual */}
                <div className="relative bg-gradient-to-br from-[#101C45] via-[#172B61] to-[#293D83] p-10 sm:p-14 flex items-center justify-center min-h-[350px] overflow-hidden">
                  <div className="absolute w-72 h-72 rounded-full border border-white/10" />
                  <div className="absolute w-52 h-52 rounded-full border border-white/10" />
                  <div className="absolute w-36 h-36 rounded-full bg-blue-400/10 blur-2xl" />

                  <div className="relative w-full max-w-xs">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl rotate-[-4deg]">
                      <div className="flex justify-between items-center">
                        <div className="w-11 h-11 rounded-xl bg-blue-400/20 flex items-center justify-center text-blue-200">
                          <BookOpen size={24} />
                        </div>
                        <span className="text-[10px] text-blue-200 font-bold tracking-widest">
                          HELP • SHARE • GROW
                        </span>
                      </div>

                      <h3 className="text-white text-2xl font-bold mt-7">
                        Knowledge
                        <br />
                        is better shared.
                      </h3>

                      <div className="mt-7 space-y-3">
                        <div className="h-2 rounded-full bg-white/20 w-full" />
                        <div className="h-2 rounded-full bg-white/20 w-4/5" />
                        <div className="h-2 rounded-full bg-white/20 w-3/5" />
                      </div>

                      <div className="mt-8 pt-5 border-t border-white/15 flex justify-between items-center">
                        <span className="text-blue-100 text-xs">
                          Learn together
                        </span>
                        <ArrowUpRight size={18} className="text-blue-200" />
                      </div>
                    </div>

                    <div className="absolute -right-7 -bottom-8 bg-white rounded-2xl p-4 shadow-xl rotate-[5deg]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                          <FileText size={21} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Study resources
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Shared with care
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-white border-y border-slate-100">
          <div className="max-w-6xl mx-auto">

            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
                WHAT MAKES US DIFFERENT
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 tracking-tight">
                Designed around
                <span className="text-blue-600"> trust.</span>
              </h2>
              <p className="text-slate-500 mt-4 leading-relaxed">
                A student-focused platform where security,
                authenticity, and accessibility come first.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={index}
                    className="group p-8 sm:p-10 rounded-[28px] border border-slate-200 bg-[#FAFBFF] hover:bg-white hover:border-blue-200 hover:shadow-[0_20px_50px_-25px_rgba(37,99,235,0.25)] transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <Icon size={26} strokeWidth={1.8} />
                      </div>

                      <span className="text-[10px] tracking-widest font-bold text-slate-400 bg-white border border-slate-200 px-3 py-2 rounded-full">
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mt-8 text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-4 text-sm text-slate-500 leading-7">
                      {feature.description}
                    </p>

                    <div className="mt-7 w-12 h-1 rounded-full bg-blue-500 group-hover:w-20 transition-all duration-300" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#101C45] to-[#293D83] p-10 sm:p-16 text-center">
            <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full border border-white/10" />

            <div className="relative">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-200 mb-6">
                <Users size={27} />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Knowledge grows when shared.
              </h2>

              <p className="text-blue-100/70 mt-5 max-w-xl mx-auto leading-relaxed">
                HelpHub is built on a simple belief:
                every student deserves access to quality learning
                resources, without unnecessary barriers.
              </p>

              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white">
                Learn more. Share more. Grow together.
                <Sparkles size={16} />
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
