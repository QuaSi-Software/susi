# Multi-stage build for production deployment

# Stage 1: Build the React app
FROM node:24-alpine AS build

WORKDIR /tmp/build

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . /tmp/build

# Build the app
RUN npm run build

# Stage 2: Serve static files
FROM node:24-alpine AS prod

ENV NODE_ENV=production
ENV BASE_DIR="/opt/susi"
USER root
RUN mkdir -p $BASE_DIR && chown -R 1000:1000 $BASE_DIR
RUN npm install serve -g
USER 1000:1000

WORKDIR $BASE_DIR

COPY --from=build --chown=1000:1000 /tmp/build/dist $BASE_DIR
COPY --chown=1000:1000 ./docker-entrypoint.sh /opt/custom-docker-entrypoint.sh
RUN chmod +x /opt/custom-docker-entrypoint.sh


ENTRYPOINT ["/opt/custom-docker-entrypoint.sh"]
CMD ["serve", "-S", "-s", "-p", "5002", "."]

EXPOSE 5002

FROM build AS dev

ENV BASE_DIR="/opt/susi"
USER root
RUN mv /tmp/build $BASE_DIR && chown -R 1000:1000 $BASE_DIR
USER 1000:1000

WORKDIR $BASE_DIR

CMD ["npm", "run", "dev"]
