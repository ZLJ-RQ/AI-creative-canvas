import React, { useRef } from 'react';
import { Sparkles, Wand2, PaintBucket, Brush } from 'lucide-react';
import { ART_STYLES, COLOR_THEMES } from '../constants';
import DrawingCanvas, { DrawingCanvasRef } from './DrawingCanvas';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (p: string) => void;
  selectedStyle: string;
  setSelectedStyle: (s: string) => void;
  selectedColor: string;
  setSelectedColor: (c: string) => void;
  onGenerate: (canvasData?: string) => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
  selectedStyle,
  setSelectedStyle,
  selectedColor,
  setSelectedColor,
  onGenerate,
  isLoading,
}) => {
  const canvasRef = useRef<DrawingCanvasRef>(null);

  const handleGenerateClick = () => {
    const canvasData = canvasRef.current?.exportImage() || undefined;
    onGenerate(canvasData);
  };

  return (
    <div className="glass-panel rounded-3xl flex flex-col h-full overflow-hidden shadow-2xl shadow-black/20">
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        
        {/* Prompt Input */}
        <div className="space-y-3">
          <label htmlFor="prompt" className="flex items-center text-sm font-semibold text-slate-200">
            <Sparkles className="w-4 h-4 mr-2 text-brand-400" />
            画面描述
          </label>
          <div className="relative group">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述您想象中的画面..."
              className="w-full h-28 p-4 glass-input rounded-2xl text-slate-200 placeholder-slate-500 outline-none resize-none transition-all text-sm leading-relaxed"
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-slate-600 font-mono">
              {prompt.length} chars
            </div>
          </div>
        </div>

        {/* Drawing Canvas */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-semibold text-slate-200">
            <Brush className="w-4 h-4 mr-2 text-brand-400" />
            手绘草图 <span className="ml-2 text-xs font-normal text-slate-500">(可选辅助)</span>
          </label>
          <DrawingCanvas ref={canvasRef} disabled={isLoading} />
        </div>

        {/* Style Selection */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-semibold text-slate-200">
            <Wand2 className="w-4 h-4 mr-2 text-indigo-400" />
            艺术风格
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {ART_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                disabled={isLoading}
                className={`px-3 py-2.5 text-xs font-medium rounded-xl border transition-all duration-200 text-left relative overflow-hidden ${
                  selectedStyle === style.id
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                }`}
              >
                <span className="relative z-10">{style.name}</span>
                {selectedStyle === style.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-semibold text-slate-200">
            <PaintBucket className="w-4 h-4 mr-2 text-pink-400" />
            色调氛围
          </label>
          <div className="flex flex-wrap gap-3 p-2 bg-black/20 rounded-xl border border-white/5">
            {COLOR_THEMES.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                disabled={isLoading}
                className={`relative w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center ${
                  selectedColor === color.id
                    ? 'scale-110 shadow-lg ring-2 ring-white/20'
                    : 'hover:scale-105 hover:ring-2 hover:ring-white/10 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {selectedColor === color.id && (
                   <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm animate-in zoom-in duration-200"></div>
                )}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400 self-center font-mono px-2">
              {COLOR_THEMES.find(c => c.id === selectedColor)?.name}
            </span>
          </div>
        </div>

        {/* Spacing for bottom button */}
        <div className="h-12"></div>
      </div>

      {/* Sticky Footer Button */}
      <div className="p-5 bg-dark-950/40 backdrop-blur-md border-t border-white/5 z-10">
        <button
          onClick={handleGenerateClick}
          disabled={isLoading || !prompt.trim()}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden group ${
            isLoading || !prompt.trim()
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-brand-600 via-brand-500 to-blue-500 text-white shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="tracking-wide">AI 正在绘制...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="tracking-wide">{canvasRef.current?.hasContent() ? '基于草图生成' : '开始创作'}</span>
            </>
          )}
          
          {/* Button Glow Effect */}
          {!isLoading && prompt.trim() && (
             <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;