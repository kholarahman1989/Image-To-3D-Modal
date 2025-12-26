
import React, { useState, useRef } from 'react';
import { CharacterState } from '../types';
import { TaskResult } from '../App';
import { 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  ChevronRight,
  History,
  Layers as LayersIcon,
  Info,
  Play,
  Download,
  Loader2
} from 'lucide-react';

interface SidebarProps {
  state: CharacterState;
  variations: CharacterState[];
  tasks: TaskResult[];
  activeVariationIndex: number;
  onSelectVariation: (index: number) => void;
  onUpdate: (updates: Partial<CharacterState>) => void;
  referenceImage: string | null;
  onImageUpload: (base64: string | null) => void;
  onOpenGenerate: () => void;
  isGenerating: boolean;
  onPreviewResult: (task: TaskResult) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  state,
  variations,
  tasks,
  activeVariationIndex,
  onSelectVariation,
  onUpdate,
  referenceImage,
  onImageUpload,
  onOpenGenerate,
  isGenerating,
  onPreviewResult
}) => {
  const [activeTab, setActiveTab] = useState<'Results' | 'Layers'>('Results');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onImageUpload(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-[300px] h-full bg-[#1a1a1a] border-l border-white/5 flex flex-col z-40">
      {/* Sidebar Tabs */}
      <div className="flex border-b border-white/5">
        <TabButton 
          label="Results" 
          icon={<History size={14} />} 
          active={activeTab === 'Results'} 
          onClick={() => setActiveTab('Results')} 
        />
        <TabButton 
          label="Layers" 
          icon={<LayersIcon size={14} />} 
          active={activeTab === 'Layers'} 
          onClick={() => setActiveTab('Layers')} 
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'Results' ? (
          <div className="p-4 space-y-6">
            
            {/* 3D Generation Results (Tasks) */}
            {tasks.length > 0 && (
               <section className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <BoxIcon size={12} className="text-blue-500" /> Image to 3D Results
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {tasks.map(task => (
                      <div key={task.id} className="relative aspect-square bg-[#252525] rounded-xl overflow-hidden group border border-white/5">
                        {task.status === 'processing' ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 backdrop-blur-sm">
                            <Loader2 className="animate-spin text-blue-500" size={24} />
                            <span className="text-[10px] text-white/60 font-medium">Generating...</span>
                          </div>
                        ) : (
                          <>
                             <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
                                <BoxIcon size={48} className="text-white/10" />
                             </div>
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                                <button 
                                  onClick={() => onPreviewResult(task)}
                                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md"
                                >
                                  <Play size={16} fill="white" className="ml-1" />
                                </button>
                                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                  <Download size={16} />
                                </button>
                             </div>
                             <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white/80 font-mono">
                               OBJ / GLB
                             </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
               </section>
            )}

            {/* Variation Section */}
            <section className="pt-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} className="text-yellow-500" /> Text-to-Image Results
                </h3>
              </div>

              {/* Variations Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {variations.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectVariation(i)}
                    className={`aspect-square rounded-lg border-2 overflow-hidden transition-all bg-[#252525] group relative ${
                      activeVariationIndex === i ? 'border-yellow-500' : 'border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-[10px]">
                       VAR-{i+1}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 p-1.5 bg-[#252525] rounded-lg border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-bold ml-2">Variation:</span>
                <div className="flex-1 flex gap-1 justify-end">
                  {[1, 2].map((num, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectVariation(i)}
                      className={`w-8 py-1 rounded-md text-xs font-bold transition-all ${
                        activeVariationIndex === i ? 'bg-[#353535] text-white' : 'text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Layers</h3>
            <div className="space-y-2">
              <LayerItem label="Humanoid Mesh" active />
              <LayerItem label="Skeleton Armature" />
              <LayerItem label="Subsurface Material" />
              <LayerItem label="Base Texture" />
            </div>
          </div>
        )}
      </div>

      {/* Input / Control Bottom Panel */}
      <div className="p-4 bg-[#121212] border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Reference</span>
            {referenceImage && (
               <button onClick={() => onImageUpload(null)} className="text-slate-500 hover:text-white"><X size={12}/></button>
            )}
          </div>
          
          <div className="relative mb-4">
            {referenceImage ? (
              <div className="relative rounded-xl overflow-hidden border border-white/5 aspect-video bg-[#252525]">
                <img src={referenceImage} className="w-full h-full object-contain" alt="Ref" />
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
              >
                <ImageIcon size={20} />
                <span className="text-[10px] font-medium">Click to upload image</span>
              </button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <button
            onClick={onOpenGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {isGenerating ? 'Processing...' : 'Add 3D Task'}
          </button>
      </div>
    </aside>
  );
};

const BoxIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const TabButton: React.FC<{ label: string; icon: React.ReactNode; active: boolean; onClick: () => void }> = ({ label, icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[11px] font-bold transition-all border-b-2 ${
      active ? 'text-white border-white' : 'text-slate-500 border-transparent hover:text-slate-300'
    }`}
  >
    {icon}
    {label}
  </button>
);

const LayerItem: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <div className={`p-2.5 rounded-lg text-[11px] flex items-center gap-3 cursor-pointer transition-all ${active ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
    <ChevronRight size={12} className={active ? 'text-blue-400' : 'text-slate-600'} />
    {label}
  </div>
);
