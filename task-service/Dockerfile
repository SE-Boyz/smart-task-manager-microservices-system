FROM node:20-alpine
WORKDIR /app

COPY package*.json ./

# Set timeout and install ONLY production dependencies
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm install --omit=dev && \
    npm cache clean --force

COPY . .

EXPOSE 5002
CMD ["npm", "start"]
