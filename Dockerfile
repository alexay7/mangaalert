# Use the official Node.js image alpine version 23
FROM node:23-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Start the application
CMD ["yarn", "start"]