import React from 'react';
import { Download, Share2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImageDisplayProps {
  image: GeneratedImage | null;
  isLoading: boolean;
  error: string | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isLoading, error }) => {
  
  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `ai-creative-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!image) return;
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const file = new File([blob], 'ai-art.png', { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: '我的 AI 创意作品',
          text: `看看我用 AI 创意画板生成的画作：${image.prompt}`,
          files: [file],
        });
      } else {
         alert("您的浏览器不支持直接分享图片文件。图片已生成，您可以手动长按保存或下载！");
      }
    } catch (err) {
      console.error("Share failed", err);
      alert("分享失败，请尝试下载图片。");
    }
  };

  return (
    <div className="glass-panel h-full flex flex-col rounded-3xl border-white/5 p-1 relative overflow-hidden shadow-2xl">
      
      {/* Main Display Area */}
      <div className="flex-1 flex items-center justify-center relative bg-black/20 rounded-2xl overflow-hidden group border border-white/5 m-1">
        
        {/* Placeholder State */}
        {!image && !isLoading && !error && (
          <div className="text-center p-10 max-w-md">
            <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-brand-500/10 rounded-full blur-2xl animate-pulse-slow"></div>
                <div className="relative w-full h-full bg-slate-800/50 rounded-full border border-white/5 flex items-center justify-center backdrop-blur-sm">
                   <ImageIcon className="w-12 h-12 text-slate-600" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">准备创作</h3>
            <p className="text-slate-400 leading-relaxed">
              在左侧输入灵感或绘制草图<br/>
              AI 艺术家将为您呈现惊艳作品
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-dark-950/60 backdrop-blur-sm">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-white/5"></div>
              <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-brand-400 border-r-brand-500 animate-spin shadow-[0_0_30px_rgba(45,212,191,0.2)]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                  <SparklesIcon className="w-8 h-8 text-brand-300 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
                <p className="text-xl font-medium text-white tracking-wide">正在生成艺术作品</p>
                <p className="text-sm text-brand-400/80 animate-pulse">Gemini 正在挥洒创意...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center p-8 max-w-md bg-red-900/10 rounded-3xl border border-red-500/20 backdrop-blur-md">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-red-400 mb-2">生成遇到了问题</h3>
            <p className="text-sm text-red-200/70 mb-4 leading-relaxed">{error}</p>
            <button 
                onClick={() => window.location.reload()}
                className="text-xs px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-full transition-colors"
            >
                刷新页面重试
            </button>
          </div>
        )}

        {/* Success/Image State */}
        {image && !isLoading && (
          <div className="relative w-full h-full flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzE3MTcxNyIvPgo8Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0iIzI2MjYyNiIvPgo8L3N2Zz4=')]">
            <img 
              src={image.url} 
              alt={image.prompt} 
              className="max-w-full max-h-full object-contain shadow-2xl drop-shadow-2xl animate-in fade-in zoom-in duration-500"
            />
            
            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 pt-24 translate-y-4 group-hover:translate-y-0">
              <p className="text-white text-lg font-medium line-clamp-2 shadow-black drop-shadow-md">
                "{image.prompt}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      {image && !isLoading && (
        <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between backdrop-blur-md mt-auto">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Generated</span>
                <span className="text-xs text-slate-300 font-mono">
                    {new Date(image.timestamp).toLocaleTimeString()}
                </span>
            </div>
            <div className="flex space-x-3">
                <button 
                  onClick={handleDownload}
                  className="flex items-center px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg border border-white/10"
                >
                    <Download className="w-4 h-4 mr-2" />
                    保存
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-brand-500/25"
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    分享
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

// Helper component for animation
const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

export default ImageDisplay;