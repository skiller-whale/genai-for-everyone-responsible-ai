import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider } from '../ai';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export class ClaudeProvider implements AIProvider {
  async complete(system: string, user: string): Promise<string> {
    const msg = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 3072,
      thinking: { type: 'disabled' },
      system,
      messages: [{ role: 'user', content: user }],
    });
    const block = msg.content.find((b) => b.type === 'text');
    if (!block || block.type !== 'text') throw new Error('Unexpected response type from Claude');
    return block.text;
  }
}
