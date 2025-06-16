export interface BuildableConfig {
    apiUrl: string;
    apiKey: string;
    projectId: string;
    aiAssistantId?: string;
    timeout?: number;
}
export interface ProjectContext {
    project: {
        id: string;
        title: string;
        description: string;
        status: 'planning' | 'in_progress' | 'completed' | 'paused';
        created_at: string;
        updated_at: string;
    };
    plan: {
        overview: string;
        technology_stack: string[];
        architecture: string;
        timeline: string;
        requirements: string[];
        technical_specifications: string;
    };
    tasks: {
        total: number;
        completed: number;
        in_progress: number;
        pending: number;
        summary: TaskSummary[];
    };
    context: {
        recent_activity: string[];
        current_phase: string;
        next_priorities: string[];
    };
}
export interface TaskSummary {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    phase: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimated_hours: number;
    technologies: string[];
    dependencies: string[];
    files_to_modify: string[];
    acceptance_criteria: string[];
    context_summary?: string;
    commands?: string[];
    reference_impl?: string;
    rollback_plan?: string;
    success_checks?: string[];
    estimated_tokens?: number;
    skill_tags?: string[];
}
export interface NextTaskResponse {
    success: boolean;
    task?: TaskSummary;
    message: string;
    context?: {
        phase: string;
        dependencies_met: boolean;
        recommended_approach: string;
        related_files: string[];
    };
}
export interface StartTaskOptions {
    approach?: string;
    estimated_duration?: number;
    notes?: string;
}
export interface StartTaskResponse {
    success: boolean;
    task_id: string;
    message: string;
    started_at: string;
    guidance?: {
        step_by_step: string[];
        key_considerations: string[];
        testing_requirements: string[];
        documentation_needs: string[];
    };
}
export interface ProgressUpdate {
    progress: number;
    status_update: string;
    completed_steps?: string[];
    current_step?: string;
    challenges?: string[];
    time_spent?: number;
    files_modified?: string[];
    notes?: string;
}
export interface ProgressResponse {
    success: boolean;
    message: string;
    updated_at: string;
    overall_progress: number;
    next_suggestions?: string[];
}
export interface CompleteTaskRequest {
    completion_notes: string;
    files_modified: string[];
    testing_completed: boolean;
    documentation_updated: boolean;
    time_spent: number;
    challenges_faced?: string[];
    lessons_learned?: string[];
    next_recommendations?: string[];
}
export interface CompleteTaskResponse {
    success: boolean;
    message: string;
    completed_at: string;
    task_summary: {
        title: string;
        time_spent: number;
        files_modified: string[];
        impact: string;
    };
    next_task_suggestion?: {
        id: string;
        title: string;
        reason: string;
    };
}
export interface CreateDiscussionRequest {
    topic: string;
    message: string;
    context?: {
        current_task_id?: string;
        related_files?: string[];
        specific_challenge?: string;
        urgency?: 'low' | 'medium' | 'high';
    };
}
export interface DiscussionResponse {
    success: boolean;
    discussion_id: string;
    status: 'pending' | 'responded' | 'resolved';
    created_at: string;
    estimated_response_time?: string;
    ai_response?: string;
    follow_up_questions?: string[];
}
export interface AIConnection {
    id: string;
    ai_assistant_id: string;
    status: 'connected' | 'working' | 'disconnected';
    connected_at: string;
    last_activity_at: string;
    current_task_id?: string;
    capabilities: string[];
    metadata: Record<string, unknown>;
}
export interface APIError {
    error: string;
    code?: string;
    details?: Record<string, unknown>;
    timestamp: string;
}
export interface MCPResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: APIError;
    timestamp: string;
}
export interface MCPCapability {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
}
export interface MCPTool {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
}
export interface TaskProgressEvent {
    type: 'task_progress';
    task_id: string;
    progress: number;
    update: string;
    timestamp: string;
}
export interface ConnectionEvent {
    type: 'connection_status';
    ai_assistant_id: string;
    status: 'connected' | 'disconnected' | 'working';
    timestamp: string;
}
export interface DiscussionEvent {
    type: 'discussion_response';
    discussion_id: string;
    response: string;
    timestamp: string;
}
export type BuildableEvent = TaskProgressEvent | ConnectionEvent | DiscussionEvent;
export interface ClientOptions {
    retryAttempts?: number;
    retryDelay?: number;
    enableRealTimeUpdates?: boolean;
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
}
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'paused';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Urgency = 'low' | 'medium' | 'high';
//# sourceMappingURL=types.d.ts.map