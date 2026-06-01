# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Copy dependency files first (to cache npm/bun install step)
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Expose the port the app runs on (Backend uses 3001)
EXPOSE 3001

# Start the application
CMD ["bun", "run", "src/index.ts"]
