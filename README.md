# How to build an app end-to-end with Agent Mode, MCP servers, and a PRD

## Overview
**Goal:** Show how modern agent-enabled workflows let you feed a Product Requirements Document (PRD) to an editor-backed agent, wire up MCP servers for tool access (database, REST APIs, filesystem, terminals), and have the agent implement, test, and run a complete app.

## Why this matters
Agents + MCP change the developer UX: instead of manual integration work, an LLM-driven agent can read project requirements, call tools, scaffold code, run migrations, and verify behavior — all from inside your editor. That speeds prototyping and reduces context-switching, while placing security and governance requirements around tool access.

## Core components

### PRD (Product Requirements Document)
- Machine- and human-readable spec that captures scope, user stories, data model, flows, and acceptance criteria.  
- Serves as the single source of truth the agent uses to plan work, prioritize features, and make tradeoffs.

### Agent Mode (editor-hosted agent)
- An LLM-powered agent embedded in an IDE (e.g., VS Code agent mode).  
- Reads the PRD, breaks the project into tasks, invokes tools (formatters, test runners, DB), and iterates until acceptance criteria are met.  
- Typical responsibilities: planning, coding, refactoring, testing, and producing commit-ready changes.

### MCP Servers (Model Context Protocol)
- Lightweight servers that expose local resources and tools to agents via a standardized interface (file read/write, DB queries, command execution, custom tools).  
- Each MCP server scopes and mediates access to a specific capability: a Postgres server, a REST API proxy, a terminal tool, or a docs-reader.  
- Advantages: interoperability between different agent hosts and tool implementations; more guarded, discoverable tool surface.

## End-to-end workflow (high level)

1. Create/curate a PRD
   - Include goals, user flows, data model, sample payloads, and clear acceptance tests (e.g., endpoints, UI states, DB schema expectations).

2. Configure agent environment
   - Enable agent mode in your editor and add the PRD to the workspace (drag/drop or point the agent at the PRD file).  
   - Register MCP servers your agent needs: DB server, docs reader, shell execution, third-party API proxies. In many setups this is a workspace config file (e.g., `.vscode/mcp.json`) or Docker-based MCP toolkit.

3. Agent planning phase
   - Agent ingests PRD, generates a task list and implementation plan (back-end, DB schema, API endpoints, front-end views, tests).  
   - Agent sequences tasks and proposes a minimal viable slice to implement first (MVP).

4. Implementation via tool calls
   - Agent scaffolds project files, installs dependencies, creates migration scripts, and writes code using the editor’s filesystem tool via MCP.  
   - For DB work the agent calls the MCP database server to apply migrations and run schema checks or queries.  
   - For external APIs or secrets it uses scoped MCP proxies so credentials don’t leak to the model.

5. Test & iterate
   - Agent runs unit and integration tests using the test runner tool exposed through MCP.  
   - If failures occur, agent debugs: reads logs, updates code, re-runs tests.  
   - Agent repeats until acceptance criteria from the PRD are satisfied.

6. Finalize and commit
   - Agent prepares commit messages, documents TODOs, and optionally opens PRs or deploys to a staging environment if configured.

## Design and security best practices
- **Principle of least privilege:** expose only the directories, DB schemas, and APIs the agent needs (scope-limited MCP servers / ephemeral tunnels).  
- **Human-in-the-loop for risky actions:** require manual approval for `write_file`, `run-command`, deploy, or secret access.  
- **Audit and logging:** keep an immutable trail of agent requests and tool outputs for review.  
- **Sandbox MCP servers:** run them in containers with resource limits and network restrictions.  
- **Secrets handling:** use credential vaults and prevent raw secret values from being passed to the model or stored in logs.

## Practical tips for a smooth run
- Write clear, testable acceptance criteria in the PRD (example: `POST /lists` returns `201` and creates row in `lists` with fields `id`, `title`, `created_at`).  
- Start with a tiny vertical slice (one endpoint + DB table + minimal UI) so the agent can validate end-to-end quickly.  
- Provide sample data and expected responses in the PRD so the agent can create fixtures and tests.  
- Use prebuilt MCP servers where possible (Docker MCP catalog) for common integrations to avoid reinventing connectors.  
- Keep workspace config deterministic (`.vscode/mcp.json`, pinned dependency versions) to reduce non-deterministic failures.

## Example deliverables an agent can produce from a PRD
- Project scaffold and package manifests  
- Database schema and migration scripts  
- REST API endpoints and handler code  
- Unit and integration tests  
- Minimal web UI or API docs  
- Commit history and a deployment/run script

## Limitations and failure modes
- Ambiguous or incomplete PRDs lead to incorrect assumptions: the agent will pick defaults; be explicit.  
- Long-running, multi-step changes can accumulate context drift — break work into smaller tasks.  
- Agents are powerful, but not omniscient: complex business logic or nuanced UX choices may need human review.  
- Security risks if MCP servers are misconfigured or tunnels are overly broad.

## When to use this approach
- Rapid prototyping and MVPs where speed matters.  
- Small-to-medium internal tools where iterative developer feedback is easy.  
- Teams wanting to augment dev productivity while keeping control over code and infra.

## When not to rely solely on agents
- High-risk production deployments without thorough human review.  
- Complex domain modeling or legal/regulatory logic that demands subject-matter expert oversight.

## Closing (practical next steps)
- Draft a focused PRD with explicit acceptance tests.  
- Enable agent mode in your editor and add the PRD to the workspace.  
- Stand up scoped MCP servers: database, shell, docs reader.  
- Ask the agent to implement a single, testable feature first; review commits and tests, then expand.