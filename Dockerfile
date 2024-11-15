# Start with the official Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy the package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all application files to the container
COPY . .

# Generate prisma
RUN cd packages/db && npx prisma generate

# Expose ports for the application
EXPOSE 8000

WORKDIR /usr/src/app/apps/primary_backend

# Start the backend
CMD ["npm", "run", "dev"]
