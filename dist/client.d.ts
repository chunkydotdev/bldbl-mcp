import type { BuildableConfig, ClientOptions, CompleteTaskRequest, CompleteTaskResponse, CreateDiscussionRequest, DiscussionResponse, NextTaskResponse, ProgressResponse, ProgressUpdate, ProjectContext, StartTaskOptions, StartTaskResponse } from './types';
export declare class BuildableMCPClient {
    private axios;
    private config;
    private options;
    private aiAssistantId;
    constructor(config: BuildableConfig, options?: ClientOptions);
    /**
     * Get complete project context including plan, tasks, and recent activity
     */
    getProjectContext(): Promise<ProjectContext>;
    /**
     * Get the next recommended task to work on
     */
    getNextTask(): Promise<NextTaskResponse>;
    /**
     * Start working on a specific task
     */
    startTask(taskId: string, options?: StartTaskOptions): Promise<StartTaskResponse>;
    /**
     * Update progress on the current task
     */
    updateProgress(taskId: string, progress: ProgressUpdate): Promise<ProgressResponse>;
    /**
     * Complete a task
     */
    completeTask(taskId: string, completion: CompleteTaskRequest): Promise<CompleteTaskResponse>;
    /**
     * Create a discussion/question for human input
     */
    createDiscussion(discussion: CreateDiscussionRequest): Promise<DiscussionResponse>;
    /**
     * Check health/connectivity with Buildable API
     */
    healthCheck(): Promise<{
        status: string;
        timestamp: string;
    }>;
    /**
     * Connect to Buildable (create AI connection record)
     */
    connect(): Promise<void>;
    /**
     * Disconnect from Buildable (cleanup)
     */
    disconnect(): Promise<void>;
    /**
     * Get current AI assistant connection status
     */
    getConnectionStatus(): Promise<{
        status: string;
        connected_at: string;
        last_activity_at: string;
    }>;
    private makeRequest;
    private updateConnectionStatus;
    private formatError;
    private log;
}
export declare function createBuildableClient(config: BuildableConfig, options?: ClientOptions): BuildableMCPClient;
export default BuildableMCPClient;
//# sourceMappingURL=client.d.ts.map