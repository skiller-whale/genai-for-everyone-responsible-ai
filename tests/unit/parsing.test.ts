import { describe, test, expect } from 'bun:test';
import { parseUseCases, parseStakeholders, parseHarms } from '../../src/server/parsing';

describe('parseUseCases', () => {
  test('parses a single intended use case', () => {
    const xml = '<intended>Students use it to learn.</intended>';
    const result = parseUseCases(xml);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Students use it to learn.');
    expect(result[0].category).toBe('intended');
    expect(result[0].id).toBeTruthy();
  });

  test('parses all three categories', () => {
    const xml = `
      <intended>A.</intended>
      <highstakes>B.</highstakes>
      <misuse>C.</misuse>
    `;
    const result = parseUseCases(xml);
    expect(result).toHaveLength(3);
    const cats = result.map((r) => r.category);
    expect(cats).toContain('intended');
    expect(cats).toContain('highstakes');
    expect(cats).toContain('misuse');
  });

  test('parses multiple items in same category', () => {
    const xml = `
      <intended>A.</intended>
      <intended>B.</intended>
    `;
    expect(parseUseCases(xml)).toHaveLength(2);
  });

  test('trims whitespace from text', () => {
    const xml = '<intended>  Padded text.  </intended>';
    expect(parseUseCases(xml)[0].text).toBe('Padded text.');
  });

  test('returns empty array when no matches', () => {
    expect(parseUseCases('no xml here at all')).toEqual([]);
  });

  test('each item gets a unique id', () => {
    const xml = '<intended>A.</intended><intended>B.</intended>';
    const result = parseUseCases(xml);
    expect(result[0].id).not.toBe(result[1].id);
  });
});

describe('parseStakeholders', () => {
  test('parses direct stakeholder', () => {
    const xml = '<stakeholder type="direct">Teacher</stakeholder>';
    const result = parseStakeholders(xml, 'uc-1');
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Teacher');
    expect(result[0].type).toBe('direct');
    expect(result[0].useCaseId).toBe('uc-1');
  });

  test('parses indirect stakeholder', () => {
    const xml = '<stakeholder type="indirect">Parent</stakeholder>';
    const result = parseStakeholders(xml, 'uc-1');
    expect(result[0].type).toBe('indirect');
  });

  test('parses multiple stakeholders', () => {
    const xml = `
      <stakeholder type="direct">Teacher</stakeholder>
      <stakeholder type="indirect">Parent</stakeholder>
    `;
    const result = parseStakeholders(xml, 'uc-1');
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.useCaseId === 'uc-1')).toBe(true);
  });

  test('returns empty for malformed xml', () => {
    expect(parseStakeholders('<stakeholder>broken</stakeholder>', 'x')).toEqual([]);
  });
});

describe('parseHarms', () => {
  test('parses harm with type and severity', () => {
    const xml = `<harm>
<explain>Students may lose chances.</explain>
<type>Opportunity loss</type>
<severity>severe</severity>
</harm>`;
    const result = parseHarms(xml, 'sh-1');
    expect(result).toHaveLength(1);
    expect(result[0].harmType).toBe('Opportunity loss');
    expect(result[0].severity).toBe('severe');
    expect(result[0].text).toBe('Students may lose chances.');
    expect(result[0].stakeholderId).toBe('sh-1');
  });

  test('parses multiple harms', () => {
    const xml = `
<harm>
<explain>A loses privacy.</explain>
<type>Privacy violations</type>
<severity>very severe</severity>
</harm>
<harm>
<explain>A loses money.</explain>
<type>Economic loss</type>
<severity>not severe</severity>
</harm>`;
    const result = parseHarms(xml, 'sh-1');
    expect(result).toHaveLength(2);
    expect(result[0].severity).toBe('very severe');
    expect(result[1].severity).toBe('not severe');
  });

  test('trims whitespace', () => {
    const xml = `<harm>
<explain>  Padded.  </explain>
<type>Alienation</type>
<severity>severe</severity>
</harm>`;
    expect(parseHarms(xml, 'x')[0].text).toBe('Padded.');
  });

  test('returns empty for no matches', () => {
    expect(parseHarms('nothing here', 'sh-1')).toEqual([]);
  });
});
