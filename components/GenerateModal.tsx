
import React, { useState } from 'react';
import { X, Box, Info } from 'lucide-react';

interface GenerateModalProps {
  onClose: () => void;
  onGenerate: (config: any) => void;
}

export const GenerateModal: React.FC<GenerateModalProps> = ({ onClose, onGenerate }) => {
  const [complexity, setComplexity] = useState('Standard');
  const [textureSize, setTextureSize] = useState(1024);
  const [fileType, setFileType] = useState('GLB');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-[420px] bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Box size={18} className="text-blue-500" />
            <h2 className="text-sm font-bold text-white">3D Model</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Mesh Complexity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mesh Complexity</label>
              <Info size={14} className="text-slate-600" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['Simple', 'Standard', 'Complex'].map(c => (
                <button
                  key={c}
                  onClick={() => setComplexity(c)}
                  className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${
                    complexity === c 
                      ? 'bg-[#353535] text-white border-white/20' 
                      : 'bg-[#252525] text-slate-500 border-white/5 hover:border-white/10'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Texture Size */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Texture Size</label>
            <div className="grid grid-cols-4 gap-2">
              {[512, 1024, 1536, 2048].map(size => (
                <button
                  key={size}
                  onClick={() => setTextureSize(size)}
                  className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${
                    textureSize === size 
                      ? 'bg-[#353535] text-white border-white/20' 
                      : 'bg-[#252525] text-slate-500 border-white/5 hover:border-white/10'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* File Type */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">File Type</label>
            <div className="flex gap-2">
              {['GLB', 'OBJ', 'FBX'].map(type => (
                <button
                  key={type}
                  onClick={() => setFileType(type)}
                  className={`flex-1 py-2 text-[11px] font-bold rounded-lg border transition-all ${
                    fileType === type 
                      ? 'bg-[#353535] text-white border-white/20' 
                      : 'bg-[#252525] text-slate-500 border-white/5 hover:border-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <button
            onClick={() => onGenerate({ complexity, textureSize, fileType })}
            className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold transition-all shadow-lg"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};
