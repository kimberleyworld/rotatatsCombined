# Step 1: Set up the backend
FROM node:16

WORKDIR /app

# Copy the backend package files
COPY ./BackEnd/package.json ./BackEnd/package-lock.json ./
RUN npm install

# Copy the backend files into the container
COPY ./BackEnd ./BackEnd

# Copy the frontend files into the container
COPY ./FrontEnd ./FrontEnd

# Expose the backend port (usually 3000 for Node.js apps)
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
