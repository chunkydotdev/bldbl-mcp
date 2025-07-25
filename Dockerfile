# Generated by https://smithery.ai. See: https://smithery.ai/docs/build/project-config
### Stage 1: Install dependencies and build TypeScript
FROM node:18-alpine AS build
WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src
RUN npm install --ignore-scripts && npm run build

# Stage 2: Production image
FROM node:18-alpine
WORKDIR /app

# Copy only built artifacts and package metadata for production
COPY --from=build /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm install --omit=dev --ignore-scripts

# Entrypoint for stdio MCP server
ENTRYPOINT ["node","dist/cli.js"]
