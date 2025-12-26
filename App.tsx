
import React, { useState, useCallback } from 'react';
import { EditorTool, CharacterState } from './types';
import { CharacterScene } from './components/CharacterScene';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { GenerateModal } from './components/GenerateModal';
import { PreviewModal } from './components/PreviewModal';
import { generateCharacterConcept } from './services/geminiService';

const INITIAL_STATE: CharacterState = {
  height: 1.0,
  width: 1.0,
  depth: 1.0,
  muscleMass: 0.2,
  skinColor: '#c68642',
  roughness: 0.5,
  metalness: 0.1,
  showSkeleton: false,
  pose: 'A-Pose',
  name: 'New Avatar',
  description: 'A standard humanoid model.'
};

export interface TaskResult {
  id: string;
  name: string;
  type: 'image-to-3d' | 'text-to-image';
  status: 'processing' | 'completed';
  state: CharacterState;
  thumbnail?: string;
}

const App: React.FC = () => {
  const [state, setState] = useState<CharacterState>(INITIAL_STATE);
  const [variations, setVariations] = useState<CharacterState[]>([INITIAL_STATE]);
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  
  // New UI states for DZINE-like flow
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [tasks, setTasks] = useState<TaskResult[]>([]);

  const handleUpdate = useCallback((updates: Partial<CharacterState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      const newVariations = [...variations];
      newVariations[activeVariationIndex] = newState;
      setVariations(newVariations);
      return newState;
    });
  }, [variations, activeVariationIndex]);

  const selectVariation = (index: number) => {
    setActiveVariationIndex(index);
    setState(variations[index]);
  };

  const handleGenerate = async (config: any) => {
    setShowGenerateModal(false);
    setIsAiLoading(true);
    
    const taskId = Math.random().toString(36).substr(2, 9);
    const newTask: TaskResult = {
      id: taskId,
      name: referenceImage ? "Image to 3D" : "Text to 3D",
      type: 'image-to-3d',
      status: 'processing',
      state: state
    };
    setTasks(prev => [newTask, ...prev]);

    let prompt = referenceImage 
      ? "Match the character in the provided image. Extract body shape and skin tone." 
      : "Generate a unique 3D humanoid character concept.";
    
    const result = await generateCharacterConcept(prompt, referenceImage || undefined);
    
    if (result && result.attributes) {
      const newState: CharacterState = {
        ...state,
        name: result.name,
        description: result.description,
        height: result.attributes.height,
        width: result.attributes.width,
        muscleMass: result.attributes.muscleMass,
        skinColor: result.attributes.skinColor || '#ffffff'
      };
      
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed', state: newState } : t));
      setVariations(prev => [...prev, newState]);
      setActiveVariationIndex(variations.length);
      setState(newState);
    }
    setIsAiLoading(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0a0a0a] text-slate-200 overflow-hidden font-sans">
      <TopBar 
        onOpenGenerate={() => setShowGenerateModal(true)}
        isGenerating={isAiLoading} 
        onExport={() => alert('Exporting model...')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Workspace */}
        <main className="flex-1 relative bg-[#121212] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
          </div>
          
          <div className="w-full h-full cursor-crosshair">
            <CharacterScene state={state} />
          </div>

          {/* View Selection Controls (Floating) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 p-1 rounded-xl shadow-2xl">
             <button onClick={() => setShowPreviewModal(true)} className="px-4 py-1.5 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">Preview</button>
             <div className="w-[1px] h-3 bg-white/10 mx-1" />
             <button className="px-4 py-1.5 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">Reset View</button>
          </div>
        </main>

        {/* Right Sidebar */}
        <Sidebar 
          state={state}
          variations={variations}
          tasks={tasks}
          activeVariationIndex={activeVariationIndex}
          onSelectVariation={selectVariation}
          onUpdate={handleUpdate}
          referenceImage={referenceImage}
          onImageUpload={setReferenceImage}
          onOpenGenerate={() => setShowGenerateModal(true)}
          isGenerating={isAiLoading}
          onPreviewResult={(task) => {
            setState(task.state);
            setShowPreviewModal(true);
          }}
        />
      </div>

      {showGenerateModal && (
        <GenerateModal 
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerate}
        />
      )}

      {showPreviewModal && (
        <PreviewModal 
          state={state}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};

export default App;
