# 1. Use Node.js base image
FROM node:20-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files first (to leverage Docker cache)
COPY package*.json ./

# 4. Install ALL dependencies
RUN npm install

# 5. Copy the rest of the source code
COPY . .

# 6. Build the TypeScript code
RUN npx tsc

# 7. Start the application
CMD ["node", "dist/index.js"]