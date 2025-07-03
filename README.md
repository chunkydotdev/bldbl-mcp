# @bldbl/mcp

**Official MCP client for Buildable - AI-powered development platform that makes any project buildable**

<a href="https://glama.ai/mcp/servers/@chunkydotdev/bldbl-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@chunkydotdev/bldbl-mcp/badge" alt="@bldbl/mcp MCP server" />
</a>

[![npm version](https://badge.fury.io/js/@bldbl%2Fmcp.svg)](https://badge.fury.io/js/@bldbl%2Fmcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![smithery badge](https://smithery.ai/badge/@buildable/bldbl-mcp)](https://smithery.ai/server/@buildable/bldbl-mcp)

This package enables AI assistants (Claude, GPT, etc.) to work directly with Buildable projects using the Model Context Protocol (MCP). AI assistants can get project context, manage tasks, track progress, and communicate with human developers.

## 🌟 What is Buildable?

Buildable (bldbl.dev) is an AI-powered development platform that makes any project buildable. It provides:

- **AI-Generated Build Plans**: Comprehensive project roadmaps with implementation details
- **Smart Task Management**: Automated task breakdown with dependencies and priorities  
- **AI Assistant Integration**: Direct integration with Claude, GPT, and other AI assistants
- **Real-time Collaboration**: Seamless human-AI collaboration on complex projects
- **Progress Tracking**: Live monitoring of development progress and blockers

## 🚀 Features

- **Full Project Integration**: Get complete project context, plans, and task details
- **Autonomous Task Management**: Start, update progress, and complete tasks
- **Human Collaboration**: Create discussions for questions and blockers
- **Real-time Progress Tracking**: Live updates and status monitoring
- **Type-Safe API**: Full TypeScript support with comprehensive type definitions
- **Claude Desktop Ready**: CLI interface for seamless Claude Desktop integration

## 📦 Installation

### Installing via Smithery

To install @bldbl/mcp for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@buildable/bldbl-mcp):

```bash
npx -y @smithery/cli install @buildable/bldbl-mcp --client claude
```

### Manual Installation
```bash
npm install @bldbl/mcp
```

## 🚀 Quick Start

### **Step 1: Install the MCP Server**
```bash
npm install -g @bldbl/mcp
```

### **Step 2: Get Your Buildable API Key**
1. Go to [bldbl.dev](https://bldbl.dev) and create an account
2. Create or select a project 
3. Go to **Project Settings** → **AI Assistants** → **Generate API Key**

### **Step 3: Configure Your AI Assistant**

#### **🤖 For Claude Desktop:**
Add this to your Claude Desktop config file (`~/.config/claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "buildable": {
      "command": "npx",
      "args": ["-y", "@bldbl/mcp"],
      "env": {
        "BUILDABLE_API_KEY": "bp_your_api_key_here",
        "BUILDABLE_PROJECT_ID": "your-project-id",
        "BUILDABLE_AI_ASSISTANT_ID": "claude-desktop"
      }
    }
  }
}
```

*Minimal setup - only API URL is auto-detected.*

#### **✨ For Cursor AI:**

**Option 1: One-Click Setup (Recommended)**
1. Go to your project on [bldbl.dev](https://bldbl.dev) 
2. Navigate to **Integrations** 
3. Click **"Add to Cursor"** - Done! 🎉

**Option 2: Manual Configuration**
Add this to your Cursor AI config file:

```json
{
  "mcpServers": {
    "buildable": {
      "command": "npx",
      "args": ["-y", "@bldbl/mcp"],
      "env": {
        "BUILDABLE_API_KEY": "bp_your_api_key_here",
        "BUILDABLE_PROJECT_ID": "your-project-id",
        "BUILDABLE_AI_ASSISTANT_ID": "cursor-ide"
      }
    }
  }
}
```

*Minimal setup - only API URL is auto-detected.*

### **Step 4: Start AI-Powered Development!**

Once configured, your AI assistant has access to these powerful tools:

- **🏗️ `get_project_context`** - Understand your entire project structure
- **📋 `get_next_task`** - Find what to work on next based on priorities  
- **▶️ `start_task`** - Begin working on a specific task
- **📊 `update_progress`** - Report detailed progress updates
- **✅ `complete_task`** - Mark tasks finished with comprehensive notes
- **💬 `create_discussion`** - Ask questions when you need human input
- **🔍 `health_check`** - Verify connection to Buildable

### **💡 Example AI Conversation:**

```
You: "What should I work on next in my project?"

AI: *calls get_project_context & get_next_task*
    "I see you're building a React dashboard app. The next 
     high-priority task is 'Implement user authentication'. 
     Should I start working on it?"

You: "Yes, go ahead!"

AI: *calls start_task*
    "Perfect! I'm starting the authentication task. I'll use 
     NextAuth.js with GitHub OAuth. Let me break this down:
     1. Install dependencies
     2. Set up NextAuth config  
     3. Create login/logout components
     4. Add protected routes
     
     I'll update you on progress as I work!"

[AI works and calls update_progress periodically]

AI: *calls update_progress*
    "Progress update: 75% complete! I've implemented:
     ✅ NextAuth.js configuration
     ✅ GitHub OAuth provider setup  
     ✅ Login/logout components
     🔄 Currently working on: Protected route middleware
     
     Should I continue with the remaining work?"
```

## 🔧 Advanced Configuration

### **Environment Variables**
3 environment variables are recommended for proper AI assistant tracking:

```bash
export BUILDABLE_API_KEY="bp_your_api_key_here"           # Your API key (required)
export BUILDABLE_PROJECT_ID="your-project-id"             # Target project (required)
export BUILDABLE_AI_ASSISTANT_ID="my-ai-assistant"        # AI Assistant ID (recommended)

# Optional (has smart default):
# export BUILDABLE_API_URL="https://bldbl.dev/api"        # API endpoint (default)
```

**Why AI Assistant ID matters:** This helps you track which AI assistant is doing what work in your project dashboard.

### **CLI Usage**
You can also run the MCP server directly:

```bash
# Install globally and use bldbl command
npm install -g @bldbl/mcp
bldbl

# Or run with npx (no installation needed)
npx @bldbl/mcp
```

### **Multiple Projects**
To work with multiple Buildable projects, create different MCP server configs:

```json
{
  "mcpServers": {
    "buildable-frontend": {
      "command": "npx",
      "args": ["-y", "@bldbl/mcp"],
      "env": {
        "BUILDABLE_API_KEY": "bp_frontend_key_here",
        "BUILDABLE_PROJECT_ID": "frontend-project-id",
        "BUILDABLE_AI_ASSISTANT_ID": "claude-frontend"
      }
    },
    "buildable-backend": {
      "command": "npx", 
      "args": ["-y", "@bldbl/mcp"],
      "env": {
        "BUILDABLE_API_KEY": "bp_backend_key_here",
        "BUILDABLE_PROJECT_ID": "backend-project-id",
        "BUILDABLE_AI_ASSISTANT_ID": "claude-backend"
      }
    }
  }
}
```

## 🛠️ API Reference

### BuildPlannerMCPClient

The main client class for interacting with Buildable projects.

#### Constructor

```typescript
new BuildPlannerMCPClient(config: BuildPlannerConfig, options?: ClientOptions)
```

**Config Parameters:**
- `apiUrl`: Buildable API URL (defaults to 'https://bldbl.dev/api')
- `apiKey`: Your Buildable API key (starts with 'bp_')
- `projectId`: Target project ID
- `aiAssistantId`: Unique identifier for your AI assistant
- `timeout`: Request timeout in milliseconds (default: 30000)

**Options:**
- `retryAttempts`: Number of retry attempts (default: 3)
- `retryDelay`: Delay between retries in ms (default: 1000)

#### Methods

##### `getProjectContext(): Promise<ProjectContext>`
Get complete project context including plan, tasks, and recent activity.

##### `getNextTask(): Promise<NextTaskResponse>`
Get the next recommended task to work on based on dependencies and priority.

##### `startTask(taskId: string, options?: StartTaskOptions): Promise<StartTaskResponse>`
Start working on a specific task with optional approach and timing estimates.

##### `updateProgress(taskId: string, progress: ProgressUpdate): Promise<ProgressResponse>`
Update progress on the current task with detailed status information.

##### `completeTask(taskId: string, completion: CompleteTaskRequest): Promise<CompleteTaskResponse>`
Mark a task as completed with detailed completion information.

##### `createDiscussion(discussion: CreateDiscussionRequest): Promise<DiscussionResponse>`
Create a discussion/question for human input when you need guidance.

##### `healthCheck(): Promise<{status: string, timestamp: string}>`
Check connectivity and health of the Buildable API.

##### `disconnect(): Promise<void>`
Properly disconnect and cleanup the client connection.

## 🔐 Authentication

1. **Generate API Key**: Go to your Buildable project → AI Assistant tab → Generate API Key
2. **Secure Storage**: Store your API key securely (environment variables recommended)
3. **Key Format**: API keys start with `bp_` followed by project and random identifiers

## 🐛 Error Handling

The client includes comprehensive error handling:

```typescript
try {
  const context = await client.getProjectContext();
} catch (error) {
  if (error.code === 'UNAUTHORIZED') {
    console.error('Invalid or expired API key');
  } else if (error.code === 'PROJECT_NOT_FOUND') {
    console.error('Project not found or access denied');
  } else {
    console.error('API error:', error.message);
  }
}
```

## 🔄 Development Workflow

Typical AI assistant workflow with Buildable:

1. **Initialize** - Connect to Buildable with API key
2. **Get Context** - Understand the project structure and current state
3. **Find Work** - Get the next priority task
4. **Start Task** - Begin working with approach and estimates
5. **Progress Updates** - Regular progress reports with details
6. **Ask Questions** - Create discussions for blockers or decisions
7. **Complete Task** - Finish with comprehensive completion notes
8. **Repeat** - Continue with next tasks

## 📊 Usage Statistics

```typescript
// Get usage statistics for your AI assistant
const stats = await client.getUsageStats();
console.log(`Tasks completed: ${stats.tasksCompleted}`);
console.log(`Average completion time: ${stats.avgCompletionTime}min`);
console.log(`Success rate: ${stats.successRate}%`);
```

## ⚡ CLI Usage

Once installed, you can use the CLI in several ways:

```bash
# Run directly with npx (no installation needed)
npx @bldbl/mcp

# Or install globally and use the bldbl command
npm install -g @bldbl/mcp
bldbl

# For Claude Desktop, use the bldbl command in your config
```

**Environment Variables Required:**
- `BUILDABLE_API_URL` - Your Buildable API URL
- `BUILDABLE_API_KEY` - Your API key (starts with 'bp_')
- `BUILDABLE_PROJECT_ID` - Target project ID
- `BUILDABLE_AI_ASSISTANT_ID` - Unique assistant identifier

## 🧪 Testing

The package includes comprehensive test utilities:

```typescript
import { createTestClient } from '@bldbl/mcp/test';

// Create a test client with mock responses
const testClient = createTestClient({
  mockProject: {
    id: 'test-project',
    title: 'Test Project'
  }
});

// Use in your tests
await testClient.startTask('test-task-id');
```

## 🔗 Links

- **🌐 Homepage**: [bldbl.dev](https://bldbl.dev)
- **📚 Documentation**: [bldbl.dev/docs](https://bldbl.dev/docs)
- **💬 Community**: [Discord](https://discord.gg/buildable)
- **🐛 Support**: [support@bldbl.dev](mailto:support@bldbl.dev)
- **📦 NPM Package**: [npmjs.com/package/@bldbl/mcp](https://www.npmjs.com/package/@bldbl/mcp)

## 🏗️ Built With

- **TypeScript** - Type-safe development
- **Model Context Protocol (MCP)** - Standardized AI assistant communication
- **Node.js** - Runtime environment
- **REST API** - Simple and reliable communication

## 📄 License

Copyright © 2025 Buildable Team. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

**Made with ❤️ by the Buildable team**

*Buildable is a commercial AI-powered development platform. Visit [bldbl.dev](https://bldbl.dev) to get started.*

## 🆘 Support

- **Documentation**: [https://bldbl.dev/docs](https://bldbl.dev/docs)
- **Email**: [support@bldbl.dev](mailto:support@bldbl.dev)
- **Website**: [https://bldbl.dev](https://bldbl.dev)

---

**Built with ❤️ by the BuildPlanner team**