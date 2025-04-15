FROM node:18-alpine AS build
WORKDIR /app

# Install build tools needed for native modules on Alpine
RUN apk add --no-cache --virtual .build-deps build-base python3 make g++

COPY package.json yarn.lock ./
# Add --verbose for more detailed output if it still fails
RUN yarn install --verbose 
COPY . .
RUN yarn build

# Optional: Remove build dependencies after install to keep image smaller
# RUN apk del .build-deps

FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
# Ensure python3 is available for runtime dependencies if needed
RUN apk add --no-cache python3 
RUN yarn install --production
COPY --from=build /app/dist ./dist
# We don't copy node_modules from build as they might contain devDeps/build artifacts
# Rely on 'yarn install --production' in this stage
EXPOSE 5123
CMD ["node", "dist/main"] # More common CMD for running the compiled JS