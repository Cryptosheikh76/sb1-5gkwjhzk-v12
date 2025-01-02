export interface TextPosition {
  text: string;
  color: string;
  font: string;
  animation: string;
  position: {
    x: number;
    y: number;
  };
  scale: number;
  rotation: number;
}

export interface Sticker {
  id: string;
  url: string;
  tags: string[];
}

export type TransitionType = 
  | 'none'
  | 'fade'
  | 'slide'
  | 'zoom'
  | 'rotate'
  | 'glitch';

export interface VideoSegment {
  startTime: number;
  endTime: number;
  transition: TransitionType;
}