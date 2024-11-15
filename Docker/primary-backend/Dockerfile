FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the entire monorepo into the container
COPY ./apps/web /usr/src/app/apps/web
COPY ./apps/primary_backend /usr/src/app/apps/primary_backend
COPY ./apps/problems /usr/src/app/apps/problems
COPY ./packages /usr/src/app/packages
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
COPY turbo.json /usr/src/app/turbo.json

# Install dependencies
RUN npm install

# Expose ports for the application
EXPOSE 8000

WORKDIR /usr/src/app/apps/primary_backend

# Command to start both services
RUN npm run build 
CMD ["npm", "run", "start"]