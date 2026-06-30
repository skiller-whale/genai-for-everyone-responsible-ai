export type { UseCase, Stakeholder, Harm, Category, StakeholderType, Severity } from '../types';

export interface AppState {
  functionality: string;
  useCases: import('../types').UseCase[];
  selectedUseCaseId: string | null;
  stakeholders: import('../types').Stakeholder[];
  selectedStakeholderId: string | null;
  harms: import('../types').Harm[];
  loading: 'usecases' | 'stakeholders' | 'harms' | null;
  error: string | null;
}

export type Action =
  | { type: 'SET_FUNCTIONALITY'; text: string }
  | { type: 'SET_USE_CASES'; useCases: import('../types').UseCase[] }
  | { type: 'APPEND_USE_CASES'; useCases: import('../types').UseCase[] }
  | { type: 'SELECT_USE_CASE'; id: string }
  | { type: 'SET_STAKEHOLDERS'; stakeholders: import('../types').Stakeholder[] }
  | { type: 'APPEND_STAKEHOLDERS'; stakeholders: import('../types').Stakeholder[] }
  | { type: 'SELECT_STAKEHOLDER'; id: string }
  | { type: 'SET_HARMS'; harms: import('../types').Harm[] }
  | { type: 'APPEND_HARMS'; harms: import('../types').Harm[] }
  | { type: 'EDIT_CARD'; kind: 'usecase' | 'stakeholder' | 'harm'; id: string; text: string }
  | { type: 'DELETE_CARD'; kind: 'usecase' | 'stakeholder' | 'harm'; id: string }
  | { type: 'ADD_USE_CASE' }
  | { type: 'ADD_STAKEHOLDER'; useCaseId: string }
  | { type: 'ADD_HARM'; stakeholderId: string }
  | { type: 'SET_LOADING'; loading: AppState['loading'] }
  | { type: 'SET_ERROR'; error: string | null };
