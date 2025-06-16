#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { type BuildableMCPClient, createBuildableClient } from './client.js';
import type { BuildableConfig, ClientOptions } from './types.js';

class BuildableMCPServer {
  private client: BuildableMCPClient | null = null;
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: 'buildable',
      version: '1.5.1',
    });

    this.setupTools();
  }

  private setupTools(): void {
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
    this.server.tool(
      'start_task',
      {
        task_id: z.string().describe('The ID of the task to start'),
        approach: z
          .string()
          .optional()
          .describe('Optional approach or strategy for the task'),
        estimated_duration: z
          .number()
          .optional()
          .describe('Estimated duration in minutes'),
        notes: z.string().optional().describe('Optional notes about the task'),
      },
      async ({ task_id, approach, estimated_duration, notes }) => {
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
      }
    );

    // Update progress
    this.server.tool(
      'update_progress',
      {
        task_id: z.string().describe('The ID of the task being updated'),
        progress: z
          .number()
          .min(0)
          .max(100)
          .describe('Progress percentage (0-100)'),
        status_update: z.string().describe('Brief status update message'),
        completed_steps: z
          .array(z.string())
          .optional()
          .describe('List of completed steps'),
        current_step: z
          .string()
          .optional()
          .describe('Current step being worked on'),
        challenges: z
          .array(z.string())
          .optional()
          .describe('Any challenges or blockers encountered'),
        files_modified: z
          .array(z.string())
          .optional()
          .describe('List of files that were modified'),
        time_spent: z.number().optional().describe('Time spent in minutes'),
        notes: z.string().optional().describe('Additional notes'),
      },
      async ({
        task_id,
        progress,
        status_update,
        completed_steps,
        current_step,
        challenges,
        files_modified,
        time_spent,
        notes,
      }) => {
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
      }
    );

    // Complete task
    this.server.tool(
      'complete_task',
      {
        task_id: z.string().describe('The ID of the task to complete'),
        completion_notes: z.string().describe('Notes about task completion'),
        files_modified: z
          .array(z.string())
          .optional()
          .describe('List of files that were modified'),
        testing_completed: z
          .boolean()
          .optional()
          .describe('Whether testing was completed'),
        documentation_updated: z
          .boolean()
          .optional()
          .describe('Whether documentation was updated'),
        time_spent: z
          .number()
          .optional()
          .describe('Total time spent in minutes'),
      },
      async ({
        task_id,
        completion_notes,
        files_modified,
        testing_completed,
        documentation_updated,
        time_spent,
      }) => {
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
      }
    );

    // Create discussion/question
    this.server.tool(
      'create_discussion',
      {
        title: z.string().describe('Title of the discussion/question'),
        content: z.string().describe('Detailed question or discussion content'),
        urgency: z
          .enum(['low', 'medium', 'high'])
          .optional()
          .describe('Urgency level of the question'),
        tags: z
          .array(z.string())
          .optional()
          .describe('Tags to categorize the discussion'),
      },
      async ({ title, content, urgency }) => {
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
      }
    );

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

  async initialize(): Promise<void> {
    // Get config from environment variables
    const config: BuildableConfig = {
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

    const options: ClientOptions = {
      logLevel:
        (process.env.BUILDABLE_LOG_LEVEL as
          | 'debug'
          | 'info'
          | 'warn'
          | 'error') || 'info',
      enableRealTimeUpdates: process.env.BUILDABLE_REAL_TIME === 'true',
    };

    // Create client
    this.client = createBuildableClient(config, options);

    // Test connection and create AI connection record
    try {
      await this.client.healthCheck();
      await this.client.connect();
    } catch (error) {
      // Connection issues are non-fatal during initialization
      console.error('Warning: Could not connect to Buildable API:', error);
    }
  }

  async run(): Promise<void> {
    await this.initialize();

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

async function main(): Promise<void> {
  try {
    const server = new BuildableMCPServer();
    await server.run();
  } catch (error) {
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
