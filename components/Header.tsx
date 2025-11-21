import React from 'react';
import { Palette, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full px-6 py-4 sticky top-0 z-50 transition-all duration-300">
      {/* Glass Background for Sticky Header */}
      <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-md border-b border-white/5"></div>
      
      <div className="relative max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative p-2 bg-gradient-to-br from-brand-500 to-blue-600 rounded-xl shadow-lg shadow-brand-500/20 border border-white/10">
              <Palette className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight flex items-center gap-2">
              AI 创意画板
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-brand-400/80 font-semibold hidden sm:block">
              Creative Generation Studio
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4 text-sm">
          <div className="flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-brand-400" />
            <span>Powered by Gemini 2.5</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;