#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const client_js_1 = require("./client.js");
class BuildableMCPServer {
    constructor() {
        this.client = null;
        this.server = new mcp_js_1.McpServer({
            name: 'buildable',
            version: '1.5.1',
        });
        this.setupTools();
    }
    setupTools() {
        // Get project context
        this.server.tool('get_project_context', {}, async () => {
            if (!this.client) {
                throw new Error('Not connected to Buildable API');
            }
            const context = await this.client.getProjectContext();
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(context, null, 2),
                    },
                ],
            };
        });
        // Get next task
        this.server.tool('get_next_task', {}, async () => {
            if (!this.client) {
                throw new Error('Not connected to Buildable API');
            }
            const nextTask = await this.client.getNextTask();
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(nextTask, null, 2),
                    },
                ],
            };
        });
        // Start task
        this.server.tool('start_task', {
            task_id: zod_1.z.string().describe('The ID of the task to start'),
            approach: zod_1.z
                .string()
                .optional()
                .describe('Optional approach or strategy for the task'),
            estimated_duration: zod_1.z
                .number()
                .optional()
                .describe('Estimated duration in minutes'),
            notes: zod_1.z.string().optional().describe('Optional notes about the task'),
        }, async ({ task_id, approach, estimated_duration, notes }) => {
            if (!this.client) {
                throw new Error('Not connected to Buildable API');
            }
            const result = await this.client.startTask(task_id, {
                approach,
                estimated_duration,
                notes,
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        });
        // Update progress
        this.server.tool('update_progress', {
            task_id: zod_1.z.string().describe('The ID of the task being updated'),
            progress: zod_1.z
                .number()
                .min(0)
                .max(100)
                .describe('Progress percentage (0-100)'),
            status_update: zod_1.z.string().describe('Brief status update message'),
            completed_steps: zod_1.z
                .array(zod_1.z.string())
                .optional()
                .describe('List of completed steps'),
            current_step: zod_1.z
                .string()
                .optional()
                .describe('Current step being worked on'),
            challenges: zod_1.z
                .array(zod_1.z.string())
                .optional()
                .describe('Any challenges or blockers encountered'),
            files_modified: zod_1.z
                .array(zod_1.z.string())
                .optional()
                .describe('List of files that were modified'),
            time_spent: zod_1.z.number().optional().describe('Time spent in minutes'),
            notes: zod_1.z.string().optional().describe('Additional notes'),
        }, async ({ task_id, progress, status_update, completed_steps, current_step, challenges, files_modified, time_spent, notes, }) => {
            if (!this.client) {
                throw new Error('Not connected to Buildable API');
            }
            const result = await this.client.updateProgress(task_id, {
                progress,
                status_update,
                completed_steps,
                current_step,
                challenges,
                files_modified,
                time_spent,
                notes,
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        });
        // Complete task
        this.server.tool('complete_task', {
            task_id: zod_1.z.string().describe('The ID of the task to complete'),
            completion_notes: zod_1.z.string().describe('Notes about task completion'),
            files_modified: zod_1.z
                .array(zod_1.z.string())
                .optional()
                .describe('List of files that were modified'),
            testing_completed: zod_1.z
                .boolean()
                .optional()
                .describe('Whether testing was completed'),
            documentation_updated: zod_1.z
                .boolean()
                .optional()
                .describe('Whether documentation was updated'),
            time_spent: zod_1.z
                .number()
                .optional()
                .describe('Total time spent in minutes'),
        }, async ({ task_id, completion_notes, files_modified, testing_completed, documentation_updated, time_spent, }) => {
            if (!this.client) {
                throw new Error('Not connected to Buildable API');
            }
            const result = await this.client.completeTask(task_id, {
                completion_notes,
                files_modified: files_modified || [],
                testing_completed: testing_completed || false,
                documentation_updated: documentation_updated || false,
                time_spent: time_spent || 0,
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        });
        // Create discussion/question
        this.server.tool('create_discussion', {
            title: zod_1.z.string().describe('Title of the discussion/question'),
            content: zod_1.z.string().describe('Detailed question or discussion content'),
            urgency: zod_1.z
                .enum(['low', 'medium', 'high'])
                .optional()
                .describe('Urgency level of the question'),
            tags: zod_1.z
                .array(zod_1.z.string())
                .optional()
                .describe('Tags to categorize the discussion'),
        }, async ({ title, content, urgency }) => {
            if (!this.client) {
                throw new Error('Not connected to Buildable API');
            }
            const result = await this.client.createDiscussion({
                topic: title,
                message: content,
                context: {
                    urgency,
                },
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        });
        // Health check
        this.server.tool('health_check', {}, async () => {
            if (!this.client) {
                throw new Error('Not connected to Buildable API');
            }
            const result = await this.client.healthCheck();
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        });
    }
    async initialize() {
        // Get config from environment variables
        const config = {
            apiUrl: process.env.BUILDABLE_API_URL || 'https://bldbl.dev/api',
            apiKey: process.env.BUILDABLE_API_KEY || '',
            projectId: process.env.BUILDABLE_PROJECT_ID || '',
            aiAssistantId: process.env.BUILDABLE_AI_ASSISTANT_ID || 'cursor-ide',
        };
        // Validate required config
        if (!config.apiKey) {
            throw new Error('BUILDABLE_API_KEY environment variable is required');
        }
        if (!config.projectId) {
            throw new Error('BUILDABLE_PROJECT_ID environment variable is required');
        }
        const options = {
            logLevel: process.env.BUILDABLE_LOG_LEVEL || 'info',
            enableRealTimeUpdates: process.env.BUILDABLE_REAL_TIME === 'true',
        };
        // Create client
        this.client = (0, client_js_1.createBuildableClient)(config, options);
        // Test connection and create AI connection record
        try {
            await this.client.healthCheck();
            await this.client.connect();
        }
        catch (error) {
            // Connection issues are non-fatal during initialization
            console.error('Warning: Could not connect to Buildable API:', error);
        }
    }
    async run() {
        await this.initialize();
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
    }
}
async function main() {
    try {
        const server = new BuildableMCPServer();
        await server.run();
    }
    catch (error) {
        console.error('Fatal error starting Buildable MCP server:', error);
        process.exit(1);
    }
}
// Handle graceful shutdown
process.on('SIGINT', () => {
    console.error('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.error('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});
main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map