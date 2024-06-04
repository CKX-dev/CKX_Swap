# Use an official Node.js runtime as the base image
FROM node:18.17.1

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY fo2ugv95qwx1rwo
ENV PM2_SECRET_KEY ms6odlnafl9fye3

# Command to run the app
CMD ["pm2-runtime", "start", "./src/node/index.js"]
