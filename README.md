# CSV Analytics Workspace

Professional full-stack workspace for CSV ingestion, automated chart generation, and data-driven reporting with live streaming insights and exportable deliverables.

**Live Demo:** https://csv-workspace.vercel.app

**Category:** Data Analytics / File Processing

**Stack:** React 18 Â· Vite Â· Tailwind CSS Â· Vega / Vega-Lite Â· Workflow Engine Â· Platform Services

## Overview

CSV Analytics Workspace turns raw CSV files into actionable reports â€” interactive Vega-Lite charts, written insights with concrete metrics, and downloadable Markdown/HTML deliverables. The pipeline uses a two-stage service workflow connected through streaming events, with sandbox tools handling encoding detection, column profiling, and chart rendering for reliable enterprise-grade data workflows.

Designed as a reusable pattern for any "inspect a file and generate a report" solution with real-time progress, persistent history, and production-ready deployment.

## Features

- **Drag-and-Drop Ingestion** â€” Handles encoding detection (UTF-8 / GBK / UTF-16), column profiling, and sample extraction before processing.
- **Automated Chart Generation** â€” Data profiling service plans and renders 3â€“6 Vega-Lite charts as scalable SVGs with embedded metadata.
- **Data-Driven Insights** â€” Insight service reads chart metadata and column statistics to write per-chart and overall summaries with concrete numbers.
- **Live Streaming Telemetry** â€” Frontend state machine (`scanning â†’ charting â†’ insights â†’ report`) driven by typed service events over SSE for real-time visibility.
- **Exportable Reports & History** â€” Generates Markdown and HTML reports with embedded SVGs; persists analysis history for retrieval by task ID.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5, Tailwind CSS v4, Framer Motion |
| Visualization | Vega 6, Vega-Lite 6, Simple Statistics |
| Workflow | Workflow Engine, State Workflow |
| Services | Platform Services (model gateway, sandbox tools) |
| Persistence | Cloud Functions (history, history-detail), session-scoped storage |
| Deployment | EdgeOne / GitHub Pages, Node.js 18+ |

## Project Structure

```
csv-analyze-agent/
â”œâ”€â”€ services/                      # Stateful service functions (Node/TS)
â”‚   â”œâ”€â”€ _lib/                      # Shared modules â€” orchestration, sessions, events, reports
â”‚   â”‚   â”œâ”€â”€ analyze.ts             # Two-stage orchestration
â”‚   â”‚   â”œâ”€â”€ system-prompt.ts       # Chart / Insight service prompts
â”‚   â”‚   â”œâ”€â”€ report.ts              # Markdown/HTML report assembly
â”‚   â”‚   â”œâ”€â”€ session.ts             # In-memory Map<conversationId, Session>
â”‚   â”‚   â”œâ”€â”€ events.ts              # Typed service event union
â”‚   â”‚   â””â”€â”€ tools/                 # Service tools (chart-service, insight-service, shared)
â”‚   â”œâ”€â”€ upload/index.ts            # POST /upload â€” multipart CSV ingestion + profiling
â”‚   â”œâ”€â”€ analyze/index.ts           # POST /analyze â€” get | start | cancel | delete
â”‚   â”œâ”€â”€ analyze/stream.ts          # POST /analyze/stream â€” SSE event stream
â”‚   â”œâ”€â”€ analyze/rerun-insights.ts  # POST /analyze/rerun-insights
â”‚   â”œâ”€â”€ analyze/download.ts        # POST /analyze/download â€” report download
â”‚   â”œâ”€â”€ analyze/stop.ts            # POST /analyze/stop â€” abort active run
â”‚   â””â”€â”€ static/index.ts            # POST /static â€” serve generated SVGs
â”œâ”€â”€ cloud-functions/               # Stateless cloud functions
â”‚   â”œâ”€â”€ history/index.ts           # POST /history â€” per-conversation records
â”‚   â”œâ”€â”€ history-detail/index.ts    # POST /history-detail â€” full artifacts for one taskId
â”‚   â”œâ”€â”€ _http.ts                   # Shared HTTP helpers
â”‚   â””â”€â”€ _logger.ts                 # Logger utility
â”œâ”€â”€ src/                           # Frontend (React + Vite + Tailwind v4)
â”‚   â”œâ”€â”€ components/                # DropZone, PassCard, Canvas, ReportView
â”‚   â”œâ”€â”€ hooks/useAgentStream.ts    # SSE state machine reducer
â”‚   â”œâ”€â”€ lib/                       # API client, event types, formatters
â”‚   â””â”€â”€ types.ts                   # Frontend type definitions
â”œâ”€â”€ edgeone.json                   # Deployment configuration
â””â”€â”€ index.html
```

> `services/` is the canonical service directory and maps to the former `agents/` path in the codebase.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `SERVICE_API_KEY` | Yes | Platform gateway API key (platform-compatible). |
| `SERVICE_BASE_URL` | Yes | Gateway base URL, e.g. `https://gateway.edgeone.link/v1` |
| `SERVICE_MODEL` | No | Model identifier. Defaults to `@makers/deepseek-v4-flash` |
| `SERVICE_SMALL_MODEL` | No | Optional small model for internal sub-calls |
| `WORK_ROOT` | No | Artifact root, defaults to `$TMPDIR/csv-analyze-sessions` |
| `SESSION_TTL_MS` | No | In-memory session expiry, defaults to 24h |

> Note: `SERVICE_*` is an alias for `AI_GATEWAY_*` for backward compatibility.

### Development

```bash
npm run dev
# Services (EdgeOne runtime)
npm run dev:agents
# Or unified
# edgeone makers dev
```

Open http://localhost:5173 (Vite) and http://localhost:8080/agent-metrics for service traces.

### Build

```bash
npm run build
npm run preview
```

## Deployment

### EdgeOne Makers

Configured via `edgeone.json`:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- `services.framework`: `workflow`
- `services.timeout`: `300`
- `services.sandbox.timeout`: `300`

Bind `SERVICE_*` variables in the deployment environment and deploy via EdgeOne console or CLI.

### GitHub Pages / Static Hosting

Standard Vite build outputs to `dist`. Deploy to GitHub Pages or any static host.

Live Demo: https://csv-workspace.vercel.app

## Customization

- **Charts:** Adjust Vega-Lite specs in `services/_lib/tools/` and `services/_lib/report.ts` to change chart types, palettes, and thresholds.
- **Insights:** Edit service prompts in `services/_lib/system-prompt.ts` to tailor tone, depth, and metric emphasis.
- **Frontend:** Theme and layout in `src/theme.css`, components in `src/components/`, and streaming logic in `src/hooks/useAgentStream.ts`.
- **Persistence:** Cloud functions in `cloud-functions/` can be extended to external databases or object storage.
- **Upload Limits:** Modify encoding handling and profiling in `services/upload/index.ts`.

## License

MIT

