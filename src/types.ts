export type Category = 'intended' | 'highstakes' | 'misuse';
export type StakeholderType = 'direct' | 'indirect';
export type Severity = 'very severe' | 'severe' | 'not severe';

export interface UseCase {
  id: string;
  text: string;
  category: Category;
}

export interface Stakeholder {
  id: string;
  text: string;
  type: StakeholderType;
  useCaseId: string;
}

export interface Harm {
  id: string;
  text: string;
  harmType: string;
  severity: Severity;
  stakeholderId: string;
}
