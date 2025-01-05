# Step 1: Set up the frontend (no build)
FROM node:16 AS frontend

WORKDIR /app

# Copy frontend files
COPY ./FrontEnd/package.json ./FrontEnd/package-lock.json ./
RUN npm install

COPY ./FrontEnd ./

# Step 2: Set up the backend
FROM node:16

WORKDIR /app

# Copy backend files
COPY ./BackEnd/package.json ./BackEnd/package-lock.json ./
RUN npm install

COPY ./BackEnd ./

# Expose the backend port
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
