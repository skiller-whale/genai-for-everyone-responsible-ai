import type { UseCase, Stakeholder, Harm, StakeholderType, Severity } from '../types';

export function parseUseCases(xml: string): UseCase[] {
  const items: UseCase[] = [];
  for (const cat of ['intended', 'highstakes', 'misuse'] as const) {
    const regex = new RegExp(`<${cat}>([\\s\\S]+?)</${cat}>`, 'gi');
    let match;
    while ((match = regex.exec(xml)) !== null) {
      items.push({ id: crypto.randomUUID(), text: match[1].trim(), category: cat });
    }
  }
  return items;
}

export function parseStakeholders(xml: string, useCaseId: string): Stakeholder[] {
  const items: Stakeholder[] = [];
  const regex = /<stakeholder[^>]*type="(direct|indirect)"[^>]*>([\s\S]+?)<\/stakeholder>/gi;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    items.push({
      id: crypto.randomUUID(),
      text: match[2].trim(),
      type: match[1] as StakeholderType,
      useCaseId,
    });
  }
  return items;
}

export function parseHarms(xml: string, stakeholderId: string): Harm[] {
  const items: Harm[] = [];
  const harmRegex = /<harm>([\s\S]+?)<\/harm>/gi;
  let match;
  while ((match = harmRegex.exec(xml)) !== null) {
    const block = match[1];
    const explain = block.match(/<explain>([\s\S]+?)<\/explain>/i)?.[1]?.trim() ?? '';
    const type = block.match(/<type>([\s\S]+?)<\/type>/i)?.[1]?.trim() ?? '';
    const severity = block.match(/<severity>([\s\S]+?)<\/severity>/i)?.[1]?.trim() ?? 'not severe';
    if (explain) {
      items.push({
        id: crypto.randomUUID(),
        text: explain,
        harmType: type,
        severity: severity as Severity,
        stakeholderId,
      });
    }
  }
  return items;
}
