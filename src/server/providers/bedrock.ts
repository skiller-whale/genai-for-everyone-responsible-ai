import {
  BedrockRuntimeClient,
  ConverseCommand,
  type ContentBlock,
} from '@aws-sdk/client-bedrock-runtime';
import type { AIProvider } from '../ai';

// In the Skiller Whale hosted environment, `bedrock_proxy: {}` in the module's
// exercise_config.yaml routes Bedrock calls through the proxy below. Auth uses
// the learner's attendance id as the AWS access key (secret is unused) — there
// is no real API key in the VM. See the GenAI curriculum's exercises for the
// equivalent boto3 setup.
const ENDPOINT = process.env.BEDROCK_ENDPOINT ?? 'https://bedrock-runtime.aws-proxy.skillerwhale.com/';
const REGION = process.env.BEDROCK_REGION ?? 'eu-west-1';
const MODEL_ID = process.env.BEDROCK_MODEL_ID ?? 'eu.anthropic.claude-sonnet-5';

const client = new BedrockRuntimeClient({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: process.env.SW_ATTENDANCE_ID ?? '',
    secretAccessKey: 'unused',
  },
});

export class BedrockProvider implements AIProvider {
  async complete(system: string, user: string): Promise<string> {
    if (!process.env.SW_ATTENDANCE_ID) {
      throw new Error('SW_ATTENDANCE_ID is not set — the Bedrock proxy needs it as the access key.');
    }
    const response = await client.send(
      new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: system }],
        messages: [{ role: 'user', content: [{ text: user }] }],
        // Sonnet 5 rejects temperature/top_p. Thinking is off for speed.
        inferenceConfig: { maxTokens: 3072 },
        additionalModelRequestFields: { thinking: { type: 'disabled' } },
      }),
    );
    const blocks: ContentBlock[] = response.output?.message?.content ?? [];
    const text = blocks
      .map((b) => ('text' in b ? b.text : undefined))
      .find((t): t is string => Boolean(t));
    if (!text) throw new Error('Unexpected response from Bedrock (no text block)');
    return text;
  }
}
