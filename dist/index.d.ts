/**
 * Buildable MCP Client
 *
 * Official npm package for integrating Buildable with AI assistants
 * Perfect for Cursor AI, Claude Desktop, and other AI development tools
 *
 * Buildable makes any project buildable with AI-powered development assistance
 *
 * @example
 * ```typescript
 * import { BuildableClient } from '@bldbl/mcp';
 *
 * const client = new BuildableClient({
 *   apiUrl: 'https://bldbl.dev/api',
 *   apiKey: 'your-api-key',
 *   projectId: 'your-project-id'
 * });
 *
 * // Get project context for AI
 * const context = await client.getProjectContext();
 *
 * // Find next task to work on
 * const nextTask = await client.getNextTask();
 *
 * // Start working on a task
 * await client.startTask(nextTask.task.id);
 * ```
 */
export { BuildableMCPClient, createBuildableClient } from './client';
export type { BuildableConfig, ProjectContext } from './types';
export declare const version = "1.6.0";
export declare const name = "@bldbl/mcp";
/**
 * Quick setup function for Cursor AI and other tools
 *
 * @example
 * ```javascript
 * const { setupBuildable } = require('@bldbl/mcp');
 *
 * const client = setupBuildable({
 *   apiKey: process.env.BUILDABLE_API_KEY,
 *   projectId: process.env.BUILDABLE_PROJECT_ID
 * });
 *
 * // Ready to use with AI
 * const context = await client.getProjectContext();
 * ```
 */
export declare function setupBuildable(config: {
    apiKey: string;
    projectId: string;
    apiUrl?: string;
    aiAssistantId?: string;
}): import("./client").BuildableMCPClient;
//# sourceMappingURL=index.d.ts.map