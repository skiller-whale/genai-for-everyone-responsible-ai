import { ClaudeProvider } from './providers/claude';
import { OllamaProvider } from './providers/ollama';
import { BedrockProvider } from './providers/bedrock';

export interface AIProvider {
  complete(system: string, user: string): Promise<string>;
}

let _provider: AIProvider | null = null;

export function getProvider(): AIProvider {
  if (_provider) return _provider;
  const name = process.env.AI_PROVIDER ?? 'claude';
  switch (name) {
    case 'bedrock':
      // Used in the Skiller Whale hosted environment (LLM via the Bedrock proxy).
      _provider = new BedrockProvider();
      break;
    case 'ollama':
      _provider = new OllamaProvider();
      break;
    default:
      _provider = new ClaudeProvider();
  }
  console.log(`Using AI provider: ${name}`);
  return _provider;
}
