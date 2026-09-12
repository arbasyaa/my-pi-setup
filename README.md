# my-pi-setup

Custom, feature-rich setup for [Pi Coding Agent](https://github.com/badlogic/pi-mono), configured with multi-agent orchestration, MCP integration, LSP diagnostics, plan mode, web access, and custom OpenAI-compatible providers.

## Features

- **MCP Integration**: `pi-mcp-adapter` for on-demand, token-efficient Model Context Protocol server tools (`/mcp`, `--mcp-config`).
- **Subagents & Fleet View**: `pi-subagents` for Claude Code-like child agent delegation, parallel audits, and TUI fleet view (`/subagents`).
- **Plan Mode**: `@narumitw/pi-plan-mode` for read-only exploration and architectural planning before edits (`/plan`).
- **Language Server Protocol (LSP)**: `@narumitw/pi-lsp` providing `lsp_diagnostics` and `lsp_fix` for compile/type checking.
- **Web Access**: `pi-web-access` with zero-config search, URL scraping, git cloning, PDF/video understanding.
- **Task Management**: `@juicesharp/rpiv-todo` persistent live overlay task list (`/todos`).
- **Interactive Questionnaires**: `@juicesharp/rpiv-ask-user-question` for structured terminal dialogs with choices and notes.
- **Side Questions**: `@narumitw/pi-btw` for isolated side-threads without polluting main context (`/btw`).
- **Senior Dev Guardrail**: `@dietrichgebert/ponytail` to prevent AI over-engineering and keep code minimal.
- **UI/UX Linter**: `@bacnh85/pi-ux` for deterministic anti-slop design system and APCA contrast auditing (`/ux`).
- **Slash Commands**: Custom `/exit`, `/q`, and `/exot` commands for clean exit.
- **Background Terminals**: Local extension for background process management (`/ps`).
- **Fast Search Tools**: `fd` (file discovery) and `rg` (content search).
- **Custom Providers**: Preconfigured for OpenAI-compatible providers (9inference, AgentRouter, etc.).

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
   Edit `models.json` to insert your actual API keys.

5. **Start Pi:**
   ```bash
   pi
   ```

## License

MIT
