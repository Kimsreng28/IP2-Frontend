# ===========================
# Build Stage
# ===========================
FROM node:20 AS builder

WORKDIR /app

# Copy only package files first (better cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build

# ===========================
# Production Stage
# ===========================
FROM node:20 AS production

WORKDIR /app

# Copy only what is needed for production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the port
EXPOSE 80

# Start the app
CMD ["npm", "start", "--", "-p", "80"]
