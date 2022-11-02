FROM node

WORKDIR /app

RUN yarn global add pnpm

COPY package.json package.json
COPY tsconfig.json tsconfig.json

RUN pnpm install

COPY src src

CMD pnpm start