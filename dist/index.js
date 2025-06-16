"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = exports.version = exports.createBuildableClient = exports.BuildableMCPClient = void 0;
exports.setupBuildable = setupBuildable;
const client_1 = require("./client");
// CLI is now handled internally - no need to export server class
var client_2 = require("./client");
Object.defineProperty(exports, "BuildableMCPClient", { enumerable: true, get: function () { return client_2.BuildableMCPClient; } });
// Export utilities
var client_3 = require("./client");
Object.defineProperty(exports, "createBuildableClient", { enumerable: true, get: function () { return client_3.createBuildableClient; } });
// Package metadata
exports.version = '1.6.0';
exports.name = '@bldbl/mcp';
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
function setupBuildable(config) {
    return (0, client_1.createBuildableClient)({
        apiUrl: config.apiUrl || 'https://bldbl.dev/api',
        apiKey: config.apiKey,
        projectId: config.projectId,
        aiAssistantId: config.aiAssistantId || 'buildable-client',
    });
}
//# sourceMappingURL=index.js.map