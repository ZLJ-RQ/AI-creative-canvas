import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ImageDisplay from './components/ImageDisplay';
import { generateImage } from './services/geminiService';
import { GeneratedImage } from './types';

const App: React.FC = () => {
  // State
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('none');
  const [selectedColor, setSelectedColor] = useState<string>('none');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);

  // Handlers
  const handleGenerate = useCallback(async (canvasData?: string) => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage({
        prompt,
        styleId: selectedStyle,
        colorId: selectedColor,
        referenceImage: canvasData,
      });

      setGeneratedImage({
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      setError(err.message || "生成图片时发生了未知错误");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, selectedStyle, selectedColor]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans selection:bg-brand-500/30 text-slate-200">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-full lg:h-[calc(100vh-8rem)]">
            
            {/* Left Column: Controls */}
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col h-full min-h-[600px]">
               <ControlPanel 
                  prompt={prompt}
                  setPrompt={setPrompt}
                  selectedStyle={selectedStyle}
                  setSelectedStyle={setSelectedStyle}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
               />
            </div>

            {/* Right Column: Display */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col h-full min-h-[500px]">
               <ImageDisplay 
                  image={generatedImage}
                  isLoading={isLoading}
                  error={error}
               />
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;