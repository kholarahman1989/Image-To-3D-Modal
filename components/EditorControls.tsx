
import React, { useRef } from 'react';
import { EditorTool, CharacterState } from '../types';
import { 
  Maximize2, 
  Palette, 
  Dna, 
  Download, 
  ChevronRight, 
  Zap, 
  Box, 
  Layers,
  Sparkles,
  Image as ImageIcon,
  X
} from 'lucide-react';

interface EditorControlsProps {
  tool: EditorTool;
  state: CharacterState;
  onUpdate: (updates: Partial<CharacterState>) => void;
  onToolChange: (tool: EditorTool) => void;
  onAIGenerate: () => void;
  onExport: () => void;
  isLoadingAI: boolean;
  referenceImage: string | null;
  onImageUpload: (base64: string | null) => void;
}

const ControlGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-6">
    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
      <ChevronRight size={14} className="mr-1" /> {label}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const SliderControl: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
}> = ({ label, value, min, max, step, onChange }) => (
  <div>
    <div className="flex justify-between mb-1">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <span className="text-xs text-slate-500">{value.toFixed(2)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
    />
  </div>
);

export const EditorControls: React.FC<EditorControlsProps> = ({ 
  tool, 
  state, 
  onUpdate, 
  onToolChange, 
  onAIGenerate, 
  onExport,
  isLoadingAI,
  referenceImage,
  onImageUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-80 h-full bg-[#111827] border-l border-slate-800 flex flex-col overflow-hidden">
      {/* Tool Tabs */}
      <div className="grid grid-cols-4 border-b border-slate-800">
        <button 
          onClick={() => onToolChange(EditorTool.SCULPT)}
          className={`p-4 flex flex-col items-center gap-1 transition-colors ${tool === EditorTool.SCULPT ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Box size={20} />
          <span className="text-[10px] font-bold">MESH</span>
        </button>
        <button 
          onClick={() => onToolChange(EditorTool.PAINT)}
          className={`p-4 flex flex-col items-center gap-1 transition-colors ${tool === EditorTool.PAINT ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Palette size={20} />
          <span className="text-[10px] font-bold">LOOK</span>
        </button>
        <button 
          onClick={() => onToolChange(EditorTool.RIG)}
          className={`p-4 flex flex-col items-center gap-1 transition-colors ${tool === EditorTool.RIG ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Dna size={20} />
          <span className="text-[10px] font-bold">RIG</span>
        </button>
        <button 
          onClick={() => onToolChange(EditorTool.EXPORT)}
          className={`p-4 flex flex-col items-center gap-1 transition-colors ${tool === EditorTool.EXPORT ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Download size={20} />
          <span className="text-[10px] font-bold">OUT</span>
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {tool === EditorTool.SCULPT && (
          <>
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                <ImageIcon size={14} className="mr-1" /> Reference Image
              </h3>
              
              <div className="space-y-3">
                {referenceImage ? (
                  <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-video">
                    <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => onImageUpload(null)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/80 rounded-full text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-blue-500 hover:text-slate-300 transition-all bg-slate-800/20"
                  >
                    <ImageIcon size={24} />
                    <span className="text-xs font-medium">Upload Character Reference</span>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            <div className="mb-8">
              <button 
                onClick={onAIGenerate}
                disabled={isLoadingAI}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                <Sparkles size={18} className={isLoadingAI ? "animate-pulse" : ""} />
                {isLoadingAI ? "Architecting..." : referenceImage ? "Generate from Reference" : "AI Concept Architect"}
              </button>
              <p className="text-[10px] text-slate-500 mt-2 text-center">
                {referenceImage ? "Analyzing visual features with Gemini Vision" : "Use Gemini to generate unique body proportions"}
              </p>
            </div>

            <ControlGroup label="Body Dimensions">
              <SliderControl 
                label="Height" value={state.height} min={0.5} max={2.5} step={0.05} 
                onChange={(val) => onUpdate({ height: val })} 
              />
              <SliderControl 
                label="Torso Width" value={state.width} min={0.5} max={1.8} step={0.05} 
                onChange={(val) => onUpdate({ width: val })} 
              />
              <SliderControl 
                label="Torso Depth" value={state.depth} min={0.5} max={1.5} step={0.05} 
                onChange={(val) => onUpdate({ depth: val })} 
              />
            </ControlGroup>

            <ControlGroup label="Physiology">
              <SliderControl 
                label="Muscle Definition" value={state.muscleMass} min={0} max={1} step={0.01} 
                onChange={(val) => onUpdate({ muscleMass: val })} 
              />
            </ControlGroup>
          </>
        )}

        {tool === EditorTool.PAINT && (
          <>
            <ControlGroup label="Skin Shader">
              <div className="flex gap-2 flex-wrap">
                {['#f9d5b0', '#c68642', '#8d5524', '#e0ac69', '#3c2e28', '#ffffff', '#4ade80', '#6366f1'].map(color => (
                  <button
                    key={color}
                    onClick={() => onUpdate({ skinColor: color })}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${state.skinColor === color ? 'border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </ControlGroup>
            
            <ControlGroup label="Material Properties">
              <SliderControl 
                label="Roughness" value={state.roughness} min={0} max={1} step={0.01} 
                onChange={(val) => onUpdate({ roughness: val })} 
              />
              <SliderControl 
                label="Metallic" value={state.metalness} min={0} max={1} step={0.01} 
                onChange={(val) => onUpdate({ metalness: val })} 
              />
            </ControlGroup>
          </>
        )}

        {tool === EditorTool.RIG && (
          <>
            <ControlGroup label="Skeleton Settings">
              <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
                <input 
                  type="checkbox" 
                  checked={state.showSkeleton}
                  onChange={(e) => onUpdate({ showSkeleton: e.target.checked })}
                  className="w-4 h-4 rounded accent-blue-500"
                />
                <span className="text-sm font-medium text-slate-300">View Armature Bones</span>
              </label>
            </ControlGroup>

            <ControlGroup label="Calibration Poses">
              <div className="grid grid-cols-1 gap-2">
                {['T-Pose', 'A-Pose', 'Action'].map(p => (
                  <button
                    key={p}
                    onClick={() => onUpdate({ pose: p as any })}
                    className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${state.pose === p ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    {p} Mode
                  </button>
                ))}
              </div>
            </ControlGroup>
          </>
        )}

        {tool === EditorTool.EXPORT && (
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Layers size={40} className="text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Ready for Export</h2>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              Your character is ready for Blender and Unity. The package includes high-topology mesh, auto-generated UV maps, and standard humanoid rig.
            </p>
            <button 
              onClick={onExport}
              className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 mb-4"
            >
              <Download size={20} />
              Download .GLB Package
            </button>
            <p className="text-[11px] text-slate-500">Includes .gltf, .bin, and .png textures</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={14} className="text-yellow-500" />
          <span className="text-xs font-bold text-slate-300">SYSTEM STATS</span>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>Triangles: 12,452</span>
          <span>Bones: 56</span>
          <span>Draw Calls: 1</span>
        </div>
      </div>
    </div>
  );
};
