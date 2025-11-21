import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Eraser, Pencil, Trash2, Undo, Redo, Check, Palette } from 'lucide-react';

export interface DrawingCanvasRef {
  exportImage: () => string | null;
  clear: () => void;
  hasContent: () => boolean;
}

interface DrawingCanvasProps {
  disabled?: boolean;
}

const COLORS = [
  { hex: '#1a1a1a', name: 'Black' },
  { hex: '#dc2626', name: 'Red' },
  { hex: '#2563eb', name: 'Blue' },
  { hex: '#16a34a', name: 'Green' },
  { hex: '#94a3b8', name: 'Grey' },
];

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({ disabled }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState('#1a1a1a');
  
  // History for Undo/Redo
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Initial setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Save initial blank state
    saveState();
  }, []);

  useImperativeHandle(ref, () => ({
    exportImage: () => {
      // Only export if we have moved past the initial blank state or drawn something
      if (!canvasRef.current || historyStep <= 0) return null;
      return canvasRef.current.toDataURL('image/png');
    },
    clear: clearCanvas,
    hasContent: () => historyStep > 0
  }));

  // History Management
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    setHistory(prev => {
      // If we are in the middle of history (undid some steps), truncate future
      const newHistory = prev.slice(0, historyStep + 1);
      return [...newHistory, imageData];
    });
    setHistoryStep(prev => prev + 1);
  };

  const undo = () => {
    if (historyStep <= 0) return;
    const newStep = historyStep - 1;
    restoreState(newStep);
    setHistoryStep(newStep);
  };

  const redo = () => {
    if (historyStep >= history.length - 1) return;
    const newStep = historyStep + 1;
    restoreState(newStep);
    setHistoryStep(newStep);
  };

  const restoreState = (stepIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !history[stepIndex]) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(history[stepIndex], 0, 0);
  };

  // Drawing Logic
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);

    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Setup context based on current tool
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : brushColor;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.closePath();
        saveState();
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const isCustomColor = !COLORS.some(c => c.hex === brushColor);

  return (
    <div className="flex flex-col w-full space-y-3">
      {/* Canvas Container */}
      <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden shadow-inner ring-4 ring-white/5 group select-none touch-none">
        <canvas
          ref={canvasRef}
          width={512}
          height={512}
          className="w-full h-full block cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {historyStep <= 0 && !isDrawing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-300 bg-white/50 backdrop-blur-[1px]">
            <div className="w-12 h-12 border-2 border-dashed border-slate-300 rounded-lg mb-2 flex items-center justify-center">
                <Pencil className="w-6 h-6 text-slate-300" />
            </div>
            <span className="text-sm font-medium text-slate-400">在此绘制草图</span>
          </div>
        )}
      </div>

      {/* Tools Palette */}
      <div className="flex flex-col gap-2 p-3 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
        
        {/* Top Row: Tools & Actions */}
        <div className="flex items-center justify-between">
           <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5">
             <button
              onClick={() => setTool('pencil')}
              className={`p-2 rounded-lg transition-all ${tool === 'pencil' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              title="铅笔"
             >
               <Pencil className="w-4 h-4" />
             </button>
             <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-lg transition-all ${tool === 'eraser' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              title="橡皮擦"
             >
               <Eraser className="w-4 h-4" />
             </button>
           </div>

           <div className="flex items-center gap-1">
             <button
               onClick={undo}
               disabled={historyStep <= 0}
               className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
               title="撤销"
             >
               <Undo className="w-4 h-4" />
             </button>
             <button
               onClick={redo}
               disabled={historyStep >= history.length - 1}
               className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
               title="重做"
             >
               <Redo className="w-4 h-4" />
             </button>
             <div className="w-px h-4 bg-white/10 mx-1"></div>
             <button
               onClick={clearCanvas}
               className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
               title="清空"
             >
               <Trash2 className="w-4 h-4" />
             </button>
           </div>
        </div>

        {/* Bottom Row: Color & Size (Only show for pencil) */}
        {tool === 'pencil' && (
          <div className="flex items-center justify-between pt-2 border-t border-white/5 animate-in slide-in-from-top-1 duration-200">
            
            {/* Colors */}
            <div className="flex gap-1.5 items-center">
              {COLORS.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setBrushColor(c.hex)}
                  className={`w-6 h-6 rounded-full border transition-all relative ${brushColor === c.hex && !isCustomColor ? 'border-white scale-110' : 'border-transparent hover:scale-105 opacity-70 hover:opacity-100'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                   {brushColor === c.hex && !isCustomColor && <Check className="w-3 h-3 text-white absolute inset-0 m-auto drop-shadow-md" strokeWidth={3} />}
                </button>
              ))}
              
              {/* RGB Color Picker */}
              <div className="relative group ml-1">
                 <label 
                   className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center cursor-pointer overflow-hidden transition-all ${isCustomColor ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                   style={{ 
                     background: isCustomColor 
                       ? brushColor 
                       : 'conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #00FF00 120deg, #0000FF 240deg, #FF0000 360deg)' 
                   }}
                   title="自定义 RGB 颜色"
                 >
                   <input 
                     type="color" 
                     value={brushColor}
                     onChange={(e) => setBrushColor(e.target.value)}
                     className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                   />
                   {isCustomColor && <Check className="w-3 h-3 text-white drop-shadow-md" strokeWidth={3} />}
                 </label>
              </div>
            </div>

            {/* Size Slider */}
            <div className="flex items-center gap-2 w-20 group">
               <div className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-slate-300 transition-colors"></div>
               <input 
                 type="range" 
                 min="1" 
                 max="20" 
                 value={brushSize} 
                 onChange={(e) => setBrushSize(parseInt(e.target.value))}
                 className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500 hover:accent-brand-400" 
               />
               <div className="w-3 h-3 rounded-full bg-slate-500 group-hover:bg-slate-300 transition-colors"></div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;