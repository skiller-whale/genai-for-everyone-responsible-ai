# Harms Envisioner

A mind-mapping canvas for AI harm analysis, used in the Skiller Whale
**Responsible AI** session (*Generative AI for Everyone*). Four columns:
Functionality → Use Cases → Stakeholders → Harms. Prompts adapted from
[PAIR-code/farsight](https://github.com/PAIR-code/farsight).

During a session this runs in the hosted environment — you don't need to install
anything locally. It starts automatically and you open it via a link in the
session.

## How it runs in a session

The hosted environment builds and starts the tool with:

```bash
docker compose up --build --wait
```

The Hono server serves the built frontend and the `/api` routes together on a
single port (container `3000`, published to host `1001`). The LLM is reached
through the Skiller Whale **Bedrock proxy** (`AI_PROVIDER=bedrock`), authenticated
with the learner's attendance id — there is no API key to manage.

## Local development

```bash
bun install
cp .env.example .env   # set AI_PROVIDER=claude (+ ANTHROPIC_API_KEY) or =ollama
bun run dev            # frontend :8000, backend :8001 (Vite proxies /api)
```

Production single-port serve (what the container runs):

```bash
bun run build && bun run start   # serves frontend + /api on :3000
```

## Testing

```bash
bun test               # unit tests (prompts, parsing)
bunx playwright test   # e2e (mocks /api, auto-starts the dev server)
```

> This codebase is published automatically from the curriculum repo
> (`teaching_content/ai/core_genai_for_non_engineers/responsible_ai/_code`). Edit
> it there, not here.
