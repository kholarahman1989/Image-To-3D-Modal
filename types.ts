
export enum EditorTool {
  SCULPT = 'SCULPT',
  PAINT = 'PAINT',
  RIG = 'RIG',
  EXPORT = 'EXPORT'
}

export interface CharacterState {
  // Sculpt properties
  height: number;
  width: number;
  depth: number;
  muscleMass: number;
  
  // Paint properties
  skinColor: string;
  roughness: number;
  metalness: number;
  
  // Rig properties
  showSkeleton: boolean;
  pose: 'A-Pose' | 'T-Pose' | 'Action';
  
  // Metadata
  name: string;
  description: string;
}

export interface Bone {
  name: string;
  position: [number, number, number];
  parent?: string;
}
