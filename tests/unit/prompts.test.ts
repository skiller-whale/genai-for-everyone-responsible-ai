import { describe, test, expect } from 'bun:test';
import { useCasesPrompt, stakeholdersPrompt, harmsPrompt } from '../../src/server/prompts';

describe('useCasesPrompt', () => {
  test('includes functionality in user message', () => {
    const { user } = useCasesPrompt('translate text to French');
    expect(user).toContain('translate text to French');
  });

  test('asks for all three categories', () => {
    const { user } = useCasesPrompt('anything');
    expect(user).toContain('intended');
    expect(user).toContain('highstakes');
    expect(user).toContain('misuse');
  });

  test('includes avoid section when existing items provided', () => {
    const { user } = useCasesPrompt('translate', ['Students use it.']);
    expect(user).toContain('Students use it.');
    expect(user).toContain('Avoid repeating');
  });

  test('no avoid section when no existing items', () => {
    const { user } = useCasesPrompt('translate');
    expect(user).not.toContain('Avoid repeating');
  });

  test('system prompt describes role', () => {
    const { system } = useCasesPrompt('anything');
    expect(system).toContain('product manager');
  });
});

describe('stakeholdersPrompt', () => {
  test('includes functionality and use case', () => {
    const { user } = stakeholdersPrompt('translate text', 'students use it to learn');
    expect(user).toContain('translate text');
    expect(user).toContain('students use it to learn');
  });

  test('asks for direct and indirect', () => {
    const { user } = stakeholdersPrompt('f', 'uc');
    expect(user).toContain('direct');
    expect(user).toContain('indirect');
  });

  test('includes avoid section for existing stakeholders', () => {
    const { user } = stakeholdersPrompt('f', 'uc', ['Teacher']);
    expect(user).toContain('Teacher');
    expect(user).toContain('Avoid repeating');
  });
});

describe('harmsPrompt', () => {
  test('includes all three inputs', () => {
    const { user } = harmsPrompt('translate text', 'students use it', 'immigrant');
    expect(user).toContain('translate text');
    expect(user).toContain('students use it');
    expect(user).toContain('immigrant');
  });

  test('lists harm categories', () => {
    const { user, system } = harmsPrompt('f', 'uc', 'sh');
    expect(user).toContain('Opportunity loss');
    expect(system).toContain('Privacy violations');
  });

  test('lists severity options', () => {
    const { user } = harmsPrompt('f', 'uc', 'sh');
    expect(user).toContain('very severe');
    expect(user).toContain('not severe');
  });
});
