import { createLogger } from '@lvksh/logger';
import cors from 'cors';
import { config } from 'dotenv';
import { BytesLike, providers } from 'ethers';
import { ethers } from 'ethers';
import express from 'express';
import { createClient } from 'redis';
import { TwitterApi } from 'twitter-api-v2';

import { convertENStoAddress } from './convertENStoAddress';
import { getENSName } from './getENSName';
import { getTwitterUserByUsername } from './getTwitterUser';
import { Database, makeApp } from './server';

const logger = createLogger({
    info: 'INFO',
    error: 'ERROR',
    warn: 'WARN',
});

config();

const app = express();
const port = 8080;

export const twitterClient = new TwitterApi(
    (process.env as unknown as { BEARER_TOKEN: string })['BEARER_TOKEN']
);

export const readOnlyClient = twitterClient.readOnly;

export const redis = createClient({ url: process.env.REDIS_URL });

export const ethProvider = new providers.CloudflareProvider();

redis.on('error', (error) => console.log('Redis Client Error', error));

const privateKey: BytesLike =
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const address = ethers.utils.computeAddress(privateKey);
const signer = new ethers.utils.SigningKey(privateKey);

const database: Database = {
    async addr(name, coinType) {
        logger.info('hi', name, coinType);

        if (/\S+\.twitter\.ngo/.test(name)) {
            try {
                const subname = name.replace('.twitter.ngo', '');

                const result = await getTwitterUserByUsername(subname);

                const names = getENSName(result.name);

                const addr = await convertENStoAddress(names);

                return { addr: addr, ttl: 0 };
            } catch (error) {
                logger.error(error);
            }
        }

        return { addr: '0x0000000000000000000000000000000000000000', ttl: 0 };
    },
    contenthash(name) {
        logger.info('his', name);

        return {
            contenthash:
                '0x0000000000000000000000000000000000000000000000000000000000000000000000000000',
            ttl: 0,
        };
    },
    text(name, key) {
        logger.info('hiss', name, key);

        return {
            value: 'hi',
            ttl: 0,
        };
    },
};

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Private-Network', 'true');
    console.log('hizzz');
    next();
});

const server = makeApp(signer, database);

app.get('/:sender/:callData.json', async (request, reply) => {
    const f = await server.handleRequest(request, reply);

    console.log(f);
});

// eslint-disable-next-line sonarjs/no-identical-functions
app.get('/', async (request, reply) => {
    const f = await server.handleRequest(request, reply);

    console.log(f);
});

(async () => {
    await redis.connect();

    app.listen(port);
    console.log(`Serving on port ${port} with signing address ${address}`);
})();

module.exports = app;
