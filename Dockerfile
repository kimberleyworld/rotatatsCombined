# Step 1: Set up the backend
FROM node:16

WORKDIR /app

# Copy backend files
COPY ./BackEnd/package.json ./BackEnd/package-lock.json ./
RUN npm install

COPY ./BackEnd ./

# Step 2: Copy the frontend files directly to the backend
COPY ./FrontEnd /app/frontend

# Expose the backend port
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
