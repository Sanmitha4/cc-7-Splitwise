# --- STAGE 1: Build Stage ---
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx tsc

# --- STAGE 2: Production Stage ---
FROM node:20-slim AS runner
WORKDIR /app

# Copy ONLY the compiled JavaScript from the builder stage
COPY --from=builder /app/dist ./dist

# Start the application
CMD ["node", "dist/index.js"]