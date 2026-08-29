# CSV Analytics Workspace

Professional full-stack workspace for CSV ingestion, automated chart generation, and data-driven reporting with live streaming insights and exportable deliverables.

**Live Demo:** https://csv-workspace.vercel.app

**Category:** Data Analytics / File Processing

**Stack:** React 18 · Vite · Tailwind CSS · Vega / Vega-Lite · Workflow Engine · Platform Services

## Overview

CSV Analytics Workspace turns raw CSV files into actionable reports — interactive Vega-Lite charts, written insights with concrete metrics, and downloadable Markdown/HTML deliverables. The pipeline uses a two-stage service workflow connected through streaming events, with sandbox tools handling encoding detection, column profiling, and chart rendering for reliable enterprise-grade data workflows.

Designed as a reusable pattern for any "inspect a file and generate a report" solution with real-time progress, persistent history, and production-ready deployment.

## Features

- **Drag-and-Drop Ingestion** — Handles encoding detection (UTF-8 / GBK / UTF-16), column profiling, and sample extraction before processing.
- **Automated Chart Generation** — Data profiling service plans and renders 3–6 Vega-Lite charts as scalable SVGs with embedded metadata.
- **Data-Driven Insights** — Insight service reads chart metadata and column statistics to write per-chart and overall summaries with concrete numbers.
- **Live Streaming Telemetry** — Frontend state machine (`scanning → charting → insights → report`) driven by typed service events over SSE for real-time visibility.
- **Exportable Reports & History** — Generates Markdown and HTML reports with embedded SVGs; persists analysis history for retrieval by task ID.

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
├── services/                      # Stateful service functions (Node/TS)
│   ├── _lib/                      # Shared modules — orchestration, sessions, events, reports
│   │   ├── analyze.ts             # Two-stage orchestration
│   │   ├── system-prompt.ts       # Chart / Insight service prompts
│   │   ├── report.ts              # Markdown/HTML report assembly
│   │   ├── session.ts             # In-memory Map<conversationId, Session>
│   │   ├── events.ts              # Typed service event union
│   │   └── tools/                 # Service tools (chart-service, insight-service, shared)
│   ├── upload/index.ts            # POST /upload — multipart CSV ingestion + profiling
│   ├── analyze/index.ts           # POST /analyze — get | start | cancel | delete
│   ├── analyze/stream.ts          # POST /analyze/stream — SSE event stream
│   ├── analyze/rerun-insights.ts  # POST /analyze/rerun-insights
│   ├── analyze/download.ts        # POST /analyze/download — report download
│   ├── analyze/stop.ts            # POST /analyze/stop — abort active run
│   └── static/index.ts            # POST /static — serve generated SVGs
├── cloud-functions/               # Stateless cloud functions
│   ├── history/index.ts           # POST /history — per-conversation records
│   ├── history-detail/index.ts    # POST /history-detail — full artifacts for one taskId
│   ├── _http.ts                   # Shared HTTP helpers
│   └── _logger.ts                 # Logger utility
├── src/                           # Frontend (React + Vite + Tailwind v4)
│   ├── components/                # DropZone, PassCard, Canvas, ReportView
│   ├── hooks/useAgentStream.ts    # SSE state machine reducer
│   ├── lib/                       # API client, event types, formatters
│   └── types.ts                   # Frontend type definitions
├── edgeone.json                   # Deployment configuration
└── index.html
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
