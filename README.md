# my-pi-setup

Custom, feature-rich setup for [Pi Coding Agent](https://github.com/badlogic/pi-mono), configured with multi-agent orchestration, MCP integration, LSP diagnostics, plan mode, web access, and custom OpenAI-compatible providers.

## Features

- **MCP Integration**: `pi-mcp-adapter` for on-demand, token-efficient Model Context Protocol server tools (`/mcp`, `--mcp-config`).
- **Subagents & Fleet View**: `pi-subagents` for Claude Code-like child agent delegation, parallel audits, and TUI fleet view (`/subagents`).
- **Workflow Orchestration**: Local `workflows` extension for multi-subagent orchestration in ordered phases with parallel fan-out (`/workflow`, `ultracode`).
- **Plan Mode**: `@narumitw/pi-plan-mode` for read-only exploration and architectural planning before edits (`/plan`).
- **Language Server Protocol (LSP)**: `@narumitw/pi-lsp` providing `lsp_diagnostics` and `lsp_fix` for compile/type checking.
- **Web Access**: `pi-web-access` with zero-config search, URL scraping, git cloning, PDF/video understanding.
- **Task Management**: `@juicesharp/rpiv-todo` persistent live overlay task list (`/todos`).
- **Interactive Questionnaires**: `@juicesharp/rpiv-ask-user-question` for structured terminal dialogs with choices and notes.
- **Side Questions**: `@narumitw/pi-btw` for isolated side-threads without polluting main context (`/btw`).
- **Senior Dev Guardrail**: `@dietrichgebert/ponytail` to prevent AI over-engineering and keep code minimal.
- **UI/UX Linter**: `@bacnh85/pi-ux` for deterministic anti-slop design system and APCA contrast auditing (`/ux`).
- **Skills Library**: 20 preloaded skills — anti-slop (core + UI/human/copywriting/code/mobile), design direction (taste, minimalist, soft, brutalist, redesign, image-to-code), and engineering discipline (systematic-debugging, security-guard, backend-db-discipline, doc-coauthoring).
- **Slash Commands**: Custom `/exit`, `/q`, and `/exot` commands for clean exit.
- **Background Terminals**: Local extension for background process management (`/ps`).
- **Fast Search Tools**: `fd` (file discovery) and `rg` (content search).
- **Custom Providers**: Preconfigured for OpenAI-compatible providers (inference-provider, Provider B, etc.).

## Setup

1. **Clone this repository into your code directory:**
   ```bash
   git clone git@github.com:arbasyaa/my-pi-setup.git ~/Code/my-pi-setup
   ```

2. **Symlink to Pi's agent directory:**
   ```bash
   ln -s ~/Code/my-pi-setup ~/.pi/agent
   ```

3. **Install dependencies:**
   ```bash
   cd ~/Code/my-pi-setup
   npm install
   ```

4. **Configure settings & models:**
   ```bash
   cp settings.json.example settings.json
   cp models.json.example models.json
   chmod 600 models.json
   ```
   Edit `models.json` to insert your actual API keys. On startup pi auto-installs the `npm:` extensions listed in `settings.json`.

5. **Theme:**
   Set `"theme": "github-dark-default"` in `settings.json` (already present in the example).

6. **Firecrawl (optional):**
   The search/scrape/crawl tools need a Firecrawl API key. Copy `.env.example` to `.env` and add your key (see `SETUP.md`).

7. **Start Pi:**
   ```bash
   pi
   ```

## License

MIT
