FROM node:20-alpine AS build
WORKDIR /app

# Install build tools needed for native modules on Alpine
RUN apk add --no-cache --virtual .build-deps build-base python3 make g++

COPY package.json yarn.lock ./
RUN yarn install --verbose 
COPY . .
RUN yarn build

# Optional: Remove build dependencies after install to keep image smaller
# RUN apk del .build-deps

FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock ./
# Ensure python3 is available for runtime dependencies if needed (less likely now but safe)
RUN apk add --no-cache python3 
RUN yarn install --production
COPY --from=build /app/dist ./dist
# No need to copy node_modules from build stage

EXPOSE 5123
CMD ["node", "dist/main"] # Adjust if your entry point is different