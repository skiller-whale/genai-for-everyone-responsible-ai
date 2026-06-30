import type { UseCase, Stakeholder, Harm } from '../types';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}

export function generateUseCases(functionality: string, existing: string[] = []) {
  return post<UseCase[]>('/api/use-cases', { functionality, existing });
}

export function generateStakeholders(
  functionality: string,
  useCase: string,
  useCaseId: string,
  existing: string[] = [],
) {
  return post<Stakeholder[]>('/api/stakeholders', { functionality, useCase, useCaseId, existing });
}

export function generateHarms(
  functionality: string,
  useCase: string,
  stakeholder: string,
  stakeholderId: string,
  existing: string[] = [],
) {
  return post<Harm[]>('/api/harms', {
    functionality,
    useCase,
    stakeholder,
    stakeholderId,
    existing,
  });
}
