import { Ollama } from 'ollama';
import type { AIProvider } from '../ai';

export class OllamaProvider implements AIProvider {
  private client: Ollama;
  private model: string;

  constructor() {
    this.client = new Ollama({
      host: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
    });
    this.model = process.env.OLLAMA_MODEL ?? 'qwen2.5:7b';
  }

  async complete(system: string, user: string): Promise<string> {
    const response = await this.client.chat({
      model: this.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      options: { temperature: 0.1 },
    });
    return response.message.content;
  }
}
