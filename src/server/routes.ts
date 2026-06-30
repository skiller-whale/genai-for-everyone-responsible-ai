import { Hono } from 'hono';
import { getProvider } from './ai';
import { useCasesPrompt, stakeholdersPrompt, harmsPrompt } from './prompts';
import { parseUseCases, parseStakeholders, parseHarms } from './parsing';

const routes = new Hono();

routes.post('/use-cases', async (c) => {
  try {
    const { functionality, existing = [] } = await c.req.json<{
      functionality: string;
      existing?: string[];
    }>();
    if (!functionality?.trim()) return c.json({ error: 'functionality required' }, 400);

    const { system, user } = useCasesPrompt(functionality, existing);
    const text = await getProvider().complete(system, user);
    return c.json(parseUseCases(text));
  } catch (e) {
    console.error('/api/use-cases error:', e);
    return c.json({ error: String(e) }, 500);
  }
});

routes.post('/stakeholders', async (c) => {
  try {
    const { functionality, useCase, useCaseId, existing = [] } = await c.req.json<{
      functionality: string;
      useCase: string;
      useCaseId: string;
      existing?: string[];
    }>();

    const { system, user } = stakeholdersPrompt(functionality, useCase, existing);
    const text = await getProvider().complete(system, user);
    return c.json(parseStakeholders(text, useCaseId));
  } catch (e) {
    console.error('/api/stakeholders error:', e);
    return c.json({ error: String(e) }, 500);
  }
});

routes.post('/harms', async (c) => {
  try {
    const { functionality, useCase, stakeholder, stakeholderId, existing = [] } = await c.req.json<{
      functionality: string;
      useCase: string;
      stakeholder: string;
      stakeholderId: string;
      existing?: string[];
    }>();

    const { system, user } = harmsPrompt(functionality, useCase, stakeholder, existing);
    const text = await getProvider().complete(system, user);
    return c.json(parseHarms(text, stakeholderId));
  } catch (e) {
    console.error('/api/harms error:', e);
    return c.json({ error: String(e) }, 500);
  }
});

export default routes;
