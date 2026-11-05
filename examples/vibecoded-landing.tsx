import React from 'react';
import { Sparkles, Zap, Rocket, Shield, Brain, Wand2 } from 'lucide-react';

export function VibecodedLanding() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <header className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-6">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-ping" />
          <span>Introducing Next-Generation Workflow AI</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Supercharge your engineering workflow — Built for modern teams
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
          Unleash the power of autonomous context pipelines with seamless integration across your stack. Trusted by 10,000+ developers with 99.9% uptime.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => console.log('clicked start')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold"
          >
            Get Started Free
          </button>
          <a href="#" className="px-6 py-3 rounded-xl border border-white/10 text-indigo-200">
            Watch Demo
          </a>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 p-3 text-indigo-400 mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-indigo-100">Lightning Fast</h3>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 p-3 text-purple-400 mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-purple-100">Enterprise Grade</h3>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 p-3 text-violet-400 mb-4">
            <Rocket className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-violet-100">Instant Scale</h3>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <blockquote className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" alt="avatar" />
          <p>"Cut our deployment cycle in half in week one."</p>
          <footer>Sarah Chen, CTO at TechFlow AI</footer>
        </blockquote>
        <blockquote className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <img src="https://i.pravatar.cc/150?img=12" alt="avatar" />
          <p>"Replaced three internal scripts overnight."</p>
          <footer>Alex Rivera, Staff Engineer at Acme Corp</footer>
        </blockquote>
      </section>
    </div>
  );
}
