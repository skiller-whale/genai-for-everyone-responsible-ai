# sw-harms — Harms Envisioner

A mind-mapping canvas for AI harm analysis. Four columns: Functionality → Use Cases → Stakeholders → Harms. Prompts adapted from PAIR-code/farsight.

## Quick Start

```bash
bun install
cp .env.example .env   # fill in values
bun run dev            # frontend :8000, backend :8001
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `AI_PROVIDER` | `claude` | `claude` or `ollama` |
| `ANTHROPIC_API_KEY` | — | Required when `AI_PROVIDER=claude` |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `qwen2.5:7b` | Model name for Ollama |

### Ollama Setup

```bash
# Install Ollama from https://ollama.ai, then:
ollama pull qwen2.5:7b   # ~5GB, good structured output
# or lighter:
ollama pull qwen2.5:3b   # ~2GB
# Set AI_PROVIDER=ollama in .env
```

## Testing

```bash
bun test               # unit tests (prompts, parsing)
bunx playwright test   # e2e tests (mocks API calls, auto-starts dev server)
```

## Architecture

### Backend (`src/server/`)
- `index.ts` — Hono server on port 8001
- `routes.ts` — `POST /api/use-cases`, `/api/stakeholders`, `/api/harms`
- `ai.ts` — provider factory; reads `AI_PROVIDER` env var
- `prompts.ts` — prompt builders for each generation step
- `parsing.ts` — XML response parsers
- `providers/claude.ts` — `@anthropic-ai/sdk` wrapper (model: `claude-sonnet-5`)
- `providers/ollama.ts` — `ollama` package wrapper

### Frontend (`src/client/`)
- `App.tsx` — root with `useReducer` state and all event handlers
- `api.ts` — `fetch` wrappers for `/api/*`
- `components/Canvas.tsx` — dotted grid, scrollable container, hosts SVG overlay
- `components/ConnectorLines.tsx` — SVG bezier curves between cards (measures via `getBoundingClientRect`)
- `components/Column.tsx` — titled column wrapper
- `components/Card.tsx` — editable (double-click), selectable, deletable
- `components/FunctionalityCard.tsx` — textarea + generate button

### Shared (`src/types.ts`)
`UseCase`, `Stakeholder`, `Harm` and related types used by both server and client.

## Generation Flow

1. User types functionality → clicks Generate → `POST /api/use-cases`
2. Server: `prompts.useCasesPrompt()` → Claude/Ollama → `parsing.parseUseCases()` → JSON array
3. User clicks use case → `POST /api/stakeholders`
4. User clicks stakeholder → `POST /api/harms`
5. "What else?" cards send existing items to avoid repetition
