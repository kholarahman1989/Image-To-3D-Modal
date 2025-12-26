
import React from 'react';
import { 
  MousePointer2, 
  Eraser, 
  UserMinus, 
  Scissors, 
  Crop, 
  Type as TypeIcon, 
  Box, 
  Download, 
  HelpCircle,
  Zap,
  Maximize2,
  Undo2,
  Redo2,
  Image as ImageIcon
} from 'lucide-react';

interface TopBarProps {
  onOpenGenerate: () => void;
  isGenerating: boolean;
  onExport: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenGenerate, isGenerating, onExport }) => {
  return (
    <header className="h-[52px] bg-[#1a1a1a] border-b border-white/5 px-4 flex items-center justify-between z-50">
      {/* Left Tools */}
      <div className="flex items-center gap-0.5">
        <ToolButton icon={<MousePointer2 size={16} />} label="Select" active />
        <div className="h-4 w-[1px] bg-white/10 mx-1.5" />
        <ToolButton icon={<Eraser size={16} />} label="AI Eraser" />
        <ToolButton icon={<UserMinus size={16} />} label="Remove Background" />
        <ToolButton icon={<Scissors size={16} />} label="Edit Cutout" />
        <ToolButton icon={<Crop size={16} />} label="Crop" />
        <ToolButton icon={<TypeIcon size={16} />} label="SVG" />
        <div className="h-4 w-[1px] bg-white/10 mx-1.5" />
        
        {/* Main 3D Trigger */}
        <button 
          onClick={onOpenGenerate}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-[#2a2a2a] text-slate-300 hover:bg-[#333333] hover:text-white border border-white/5 shadow-inner`}
        >
          <Box size={16} className={isGenerating ? 'animate-spin' : ''} />
          3D
        </button>

        <ToolButton icon={<ImageIcon size={16} />} label="Upload" />
        <ToolButton icon={<Download size={16} />} label="Download" />
      </div>

      {/* Center Group (Undo/Redo) - Sometimes centered in DZINE */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1">
         <button className="p-2 text-slate-500 hover:text-white transition-colors"><Undo2 size={16}/></button>
         <button className="p-2 text-slate-500 hover:text-white transition-colors"><Redo2 size={16}/></button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 bg-[#2a2a2a] px-2.5 py-1 rounded-md border border-white/5">
            <Zap size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-white">Unlimited</span>
          </div>
          <span className="hover:text-white cursor-pointer flex items-center gap-1.5">
            46% <Maximize2 size={12} />
          </span>
        </div>
        
        <button 
          onClick={onExport}
          className="px-4 py-1.5 bg-[#e2e8f0] hover:bg-white text-black rounded-lg text-xs font-bold transition-all shadow-lg"
        >
          Export
        </button>
        
        <button className="text-slate-500 hover:text-white p-1">
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  );
};

const ToolButton: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${active ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
    {icon}
    <span className="hidden lg:inline">{label}</span>
  </button>
);
