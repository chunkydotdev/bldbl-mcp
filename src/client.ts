import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import type {
  APIError,
  BuildableConfig,
  ClientOptions,
  CompleteTaskRequest,
  CompleteTaskResponse,
  CreateDiscussionRequest,
  DiscussionResponse,
  MCPResponse,
  NextTaskResponse,
  ProgressResponse,
  ProgressUpdate,
  ProjectContext,
  StartTaskOptions,
  StartTaskResponse,
} from './types';

interface ConnectionData {
  ai_assistant_id: string;
  status: string;
  connected_at: string;
  last_activity_at: string;
}

export class BuildableMCPClient {
  private axios: AxiosInstance;
  private config: BuildableConfig;
  private options: ClientOptions;
  private aiAssistantId: string;

  constructor(config: BuildableConfig, options: ClientOptions = {}) {
    this.config = config;
    this.options = {
      retryAttempts: 3,
      retryDelay: 1000,
      enableRealTimeUpdates: false,
      logLevel: 'info',
      ...options,
    };

    // Generate or use provided AI assistant ID
    this.aiAssistantId =
      config.aiAssistantId || `ai_${uuidv4().substring(0, 8)}`;

    // Create axios instance with authentication
    this.axios = axios.create({
      baseURL: config.apiUrl,
      timeout: config.timeout || 30000,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'X-AI-Assistant-ID': this.aiAssistantId,
        'Content-Type': 'application/json',
        'User-Agent': '@bldbl/mcp/1.0.0',
      },
    });

    // Setup response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.log('error', 'API request failed:', error.message);
        return Promise.reject(this.formatError(error));
      }
    );

    this.log(
      'info',
      `Buildable MCP Client initialized for project ${config.projectId}`
    );
  }

  /**
   * Get complete project context including plan, tasks, and recent activity
   */
  async getProjectContext(): Promise<ProjectContext> {
    this.log('debug', 'Fetching project context...');

    try {
      const response = await this.makeRequest<ProjectContext>(
        'GET',
        `/projects/${this.config.projectId}/context`
      );

      this.log('info', 'Successfully retrieved project context');
      return response.data!;
    } catch (error) {
      this.log('error', 'Failed to get project context:', error);
      throw error;
    }
  }

  /**
   * Get the next recommended task to work on
   */
  async getNextTask(): Promise<NextTaskResponse> {
    this.log('debug', 'Getting next recommended task...');

    try {
      const response = await this.makeRequest<NextTaskResponse>(
        'GET',
        `/projects/${this.config.projectId}/next-task`
      );

      if (response.data?.task) {
        this.log('info', `Next task: "${response.data.task.title}"`);
      } else {
        this.log('info', 'No tasks available:', response.data?.message);
      }

      return response.data!;
    } catch (error) {
      this.log('error', 'Failed to get next task:', error);
      throw error;
    }
  }

  /**
   * Start working on a specific task
   */
  async startTask(
    taskId: string,
    options: StartTaskOptions = {}
  ): Promise<StartTaskResponse> {
    this.log('debug', `Starting task ${taskId}...`);

    try {
      const response = await this.makeRequest<StartTaskResponse>(
        'POST',
        `/tasks/${taskId}/start`,
        {
          ai_assistant_id: this.aiAssistantId,
          estimated_time_minutes: options.estimated_duration,
          notes: options.notes,
          approach: options.approach,
        }
      );

      this.log('info', `Successfully started task ${taskId}`);

      // Update connection status to 'working'
      await this.updateConnectionStatus('working', taskId);

      return response.data!;
    } catch (error) {
      this.log('error', `Failed to start task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Update progress on the current task
   */
  async updateProgress(
    taskId: string,
    progress: ProgressUpdate
  ): Promise<ProgressResponse> {
    this.log(
      'debug',
      `Updating progress for task ${taskId}: ${progress.progress}%`
    );

    try {
      const response = await this.makeRequest<ProgressResponse>(
        'POST',
        `/tasks/${taskId}/progress`,
        {
          completion_percentage: progress.progress,
          files_created: progress.files_modified,
          files_modified: progress.files_modified,
          notes: progress.notes,
          blockers: progress.challenges,
          time_spent_minutes: progress.time_spent,
          current_step: progress.current_step,
          completed_steps: progress.completed_steps,
        }
      );

      this.log('info', `Progress updated: ${progress.progress}% complete`);

      // Update connection activity
      await this.updateConnectionStatus('working', taskId);

      return response.data!;
    } catch (error) {
      this.log('error', `Failed to update progress for task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Complete a task
   */
  async completeTask(
    taskId: string,
    completion: CompleteTaskRequest
  ): Promise<CompleteTaskResponse> {
    this.log('debug', `Completing task ${taskId}...`);

    try {
      const response = await this.makeRequest<CompleteTaskResponse>(
        'POST',
        `/tasks/${taskId}/complete`,
        {
          files_created: completion.files_modified,
          files_modified: completion.files_modified,
          completion_notes: completion.completion_notes,
          time_spent_minutes: completion.time_spent,
          verification_evidence: completion.testing_completed
            ? 'Tests passed'
            : undefined,
        }
      );

      this.log('info', `Successfully completed task ${taskId}`);

      // Update connection status back to 'connected'
      await this.updateConnectionStatus('connected');

      return response.data!;
    } catch (error) {
      this.log('error', `Failed to complete task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Create a discussion/question for human input
   */
  async createDiscussion(
    discussion: CreateDiscussionRequest
  ): Promise<DiscussionResponse> {
    this.log('debug', `Creating discussion: "${discussion.topic}"`);

    try {
      const response = await this.makeRequest<DiscussionResponse>(
        'POST',
        `/projects/${this.config.projectId}/discuss`,
        {
          type: 'question',
          title: discussion.topic,
          message: discussion.message,
          context: {
            task_id: discussion.context?.current_task_id,
            relevant_files: discussion.context?.related_files,
            specific_challenge: discussion.context?.specific_challenge,
            urgency: discussion.context?.urgency || 'medium',
          },
          urgency: discussion.context?.urgency || 'medium',
          requires_human_response: true,
          created_by: this.aiAssistantId,
        }
      );

      this.log('info', `Discussion created: ${response.data?.discussion_id}`);
      return response.data!;
    } catch (error) {
      this.log('error', 'Failed to create discussion:', error);
      throw error;
    }
  }

  /**
   * Check health/connectivity with Buildable API
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.makeRequest<{
        status: string;
        timestamp: string;
      }>('GET', '/health');

      this.log('debug', 'Health check passed');
      return response.data!;
    } catch (error) {
      this.log('error', 'Health check failed:', error);
      throw error;
    }
  }

  /**
   * Connect to Buildable (create AI connection record)
   */
  async connect(): Promise<void> {
    this.log('info', 'Connecting to Buildable...');

    try {
      await this.updateConnectionStatus('connected');
      this.log('info', 'Successfully connected');
    } catch (error) {
      this.log('warn', 'Failed to update connection status:', error);
      // Don't throw - connection status is non-critical
    }
  }

  /**
   * Disconnect from Buildable (cleanup)
   */
  async disconnect(): Promise<void> {
    this.log('info', 'Disconnecting from Buildable...');

    try {
      await this.updateConnectionStatus('disconnected');
      this.log('info', 'Successfully disconnected');
    } catch (error) {
      this.log('warn', 'Failed to update disconnect status:', error);
      // Don't throw - disconnection should always succeed
    }
  }

  /**
   * Get current AI assistant connection status
   */
  async getConnectionStatus(): Promise<{
    status: string;
    connected_at: string;
    last_activity_at: string;
  }> {
    try {
      const response = await this.axios.get(
        `/projects/${this.config.projectId}/ai-connections`
      );
      const connections = (response.data.connections || []) as ConnectionData[];
      const myConnection = connections.find(
        (conn) => conn.ai_assistant_id === this.aiAssistantId
      );

      return (
        myConnection || {
          status: 'disconnected',
          connected_at: '',
          last_activity_at: '',
        }
      );
    } catch (error) {
      this.log('warn', 'Failed to get connection status:', error);
      return { status: 'unknown', connected_at: '', last_activity_at: '' };
    }
  }

  // Private helper methods

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: Record<string, unknown>
  ): Promise<MCPResponse<T>> {
    const startTime = Date.now();

    try {
      const response = await this.axios.request({
        method,
        url,
        data,
      });

      const duration = Date.now() - startTime;
      this.log('debug', `${method} ${url} completed in ${duration}ms`);

      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.log('error', `${method} ${url} failed after ${duration}ms`);
      throw error;
    }
  }

  private async updateConnectionStatus(
    status: 'connected' | 'working' | 'disconnected',
    currentTaskId?: string
  ): Promise<void> {
    try {
      // This endpoint doesn't exist yet, but it's for internal connection tracking
      await this.axios.post('/internal/ai-connections', {
        ai_assistant_id: this.aiAssistantId,
        status,
        current_task_id: currentTaskId,
        metadata: {
          client_version: '1.0.0',
          capabilities: ['task_management', 'progress_tracking', 'discussions'],
          last_activity: new Date().toISOString(),
        },
      });
    } catch (error) {
      // Connection status updates are non-critical
      this.log(
        'debug',
        'Connection status update failed (non-critical):',
        error
      );
    }
  }

  private formatError(error: AxiosError): APIError {
    const apiError: APIError = {
      error: error.message || 'Unknown API error',
      timestamp: new Date().toISOString(),
    };

    if (error.response?.data) {
      const responseData = error.response.data as Record<string, unknown>;
      apiError.error =
        (responseData.error as string) ||
        (responseData.message as string) ||
        apiError.error;
      apiError.code = responseData.code as string;
      apiError.details = responseData.details as Record<string, unknown>;
    }

    return apiError;
  }

  private log(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _level: 'debug' | 'info' | 'warn' | 'error',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _message: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ..._args: unknown[]
  ): void {
    // Disable all console output in MCP mode to prevent JSON-RPC pollution
    // MCP servers should not output to stdout/stderr as it interferes with the protocol
    return;
  }
}

// Export default instance creator
export function createBuildableClient(
  config: BuildableConfig,
  options?: ClientOptions
): BuildableMCPClient {
  return new BuildableMCPClient(config, options);
}

// Export for convenience
export default BuildableMCPClient;
