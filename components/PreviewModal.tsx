
import React from 'react';
import { X, Maximize2, Download, Share2 } from 'lucide-react';
import { CharacterScene } from './CharacterScene';
import { CharacterState } from '../types';

interface PreviewModalProps {
  state: CharacterState;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ state, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between z-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">{state.name}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium uppercase tracking-widest">
               <span>PBR Shader</span>
               <div className="w-1 h-1 rounded-full bg-slate-700" />
               <span>Rigged Humanoid</span>
               <div className="w-1 h-1 rounded-full bg-slate-700" />
               <span>12.4k Tris</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all">
               <Share2 size={16} /> Share
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-blue-500/20">
               <Download size={16} /> Download
            </button>
            <div className="w-[1px] h-8 bg-white/10 mx-2" />
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* 3D Scene */}
        <div className="flex-1">
           <CharacterScene state={state} />
        </div>

        {/* Footer / Info */}
        <div className="p-8 flex justify-center z-10">
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-xs font-bold text-white border border-white/10 transition-all flex items-center gap-2"
           >
             <X size={16} /> Close Preview
           </button>
        </div>
      </div>
    </div>
  );
};
