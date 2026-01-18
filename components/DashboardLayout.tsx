import React from 'react';
import {
  LayoutDashboard,
  Shield,
  Users,
  Target,
  ChevronRight,
  Bell,
  Settings,
  Activity,
  Info
} from 'lucide-react';
import { useDashboardStore } from '../lib/store';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { activeTab, setActiveTab, isLoading } = useDashboardStore();

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#141417]/80 backdrop-blur-xl flex flex-col fixed h-full z-20">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#E90052] flex items-center justify-center shadow-lg shadow-[#E90052]/20">
              <span className="text-white font-black text-xl leading-none">T</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Tactics<span className="text-[#E90052]">Board</span>
            </h1>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 font-mono tracking-widest uppercase">Analytics Engine v1.2</div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {[
            { id: 'match' as const, label: 'Match Analysis', icon: <LayoutDashboard size={20} /> },
            { id: 'team' as const, label: 'Team Stats', icon: <Shield size={20} /> },
            { id: 'player' as const, label: 'Players', icon: <Users size={20} /> },
            { id: 'compare' as const, label: 'Comparison', icon: <Target size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${activeTab === item.id ? 'bg-[#E90052] text-white shadow-lg shadow-[#E90052]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-600'}`}>
                {item.icon}
              </span>
              <span className="tracking-wide uppercase font-black">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#E90052] to-[#38003C] border-2 border-white/10" />
            <div className="text-sm">
              <div className="font-bold text-white">Analyst Mode</div>
              <div className="text-slate-500 text-xs">Premium Access</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col h-full relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-[#E90052]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-[#00FF85]/5 blur-[100px] rounded-full" />

        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-[#0A0A0B]/60 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#00FF85] animate-pulse" />
            <span className="font-semibold text-slate-200 uppercase tracking-[0.2em] text-[10px]">System Status: Ready</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-[11px] font-medium text-slate-300">
              {isLoading ? '⏳ Processing Intelligence...' : '✨ Intelligence Loaded'}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
