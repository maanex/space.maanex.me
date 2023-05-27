FROM node:16-alpine AS builder
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo@1.4.3
COPY . .
RUN turbo prune --scope=@maanex/space-backend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:16-alpine AS installer
RUN apk update
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

FROM node:16-alpine AS sourcer
RUN apk update
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN yarn turbo run build --scope=@maanex/space-backend --include-dependencies --no-deps

EXPOSE 80
ENTRYPOINT [ "yarn", "run-backend" ]
