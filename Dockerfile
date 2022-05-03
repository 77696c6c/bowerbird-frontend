FROM node:lts as dependencies
WORKDIR /bowerbird_frontend
COPY package.json package-lock.json ./
RUN npm install

FROM node:lts as builder
WORKDIR /bowerbird_frontend
COPY . .
COPY --from=dependencies /bowerbird_frontend/node_modules ./node_modules
RUN npm run build

FROM node:lts as runner
WORKDIR /bowerbird_frontend
ENV NODE_ENV production
COPY --from=builder /bowerbird_frontend/next.config.js ./
COPY --from=builder /bowerbird_frontend/public ./public
COPY --from=builder /bowerbird_frontend/.next ./.next
COPY --from=builder /bowerbird_frontend/node_modules ./node_modules
COPY --from=builder /bowerbird_frontend/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
