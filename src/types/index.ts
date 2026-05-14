export type ClassLevel = '9th' | '10th' | '11th' | '12th';
export type BoardType = 'CBSE' | 'State Board' | 'ICSE';
export type ContentType = 'pyq' | 'sample_paper' | 'note' | 'important_question' | 'mcq';

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  class: ClassLevel;
  board: BoardType;
  subject: string;
  chapter?: string;
  year?: number;
  fileUrl?: string;
  contentBody?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  selectedClass?: ClassLevel;
  selectedBoard?: BoardType;
  favorites: string[];
  recentlyViewed: string[];
  progress: Record<string, boolean>;
  isAdmin?: boolean;
}
