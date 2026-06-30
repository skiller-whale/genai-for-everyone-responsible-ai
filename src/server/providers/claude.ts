import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider } from '../ai';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export class ClaudeProvider implements AIProvider {
  async complete(system: string, user: string): Promise<string> {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      temperature: 0.1,
      system,
      messages: [{ role: 'user', content: user }],
    });
    const block = msg.content[0];
    if (block.type !== 'text') throw new Error('Unexpected response type from Claude');
    return block.text;
  }
}
