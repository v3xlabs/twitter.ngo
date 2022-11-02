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

const privateKey: BytesLike = process.env.PRIVATE_KEY;

const address = ethers.utils.computeAddress(privateKey);
const signer = new ethers.utils.SigningKey(privateKey);

const getENSSubdomain = async (input: string) => {
    if (!/^\S+\.twitter\.ngo$/.test(input)) throw new Error('Not twitter.ngo');

    const name = input.replace('.twitter.ngo', '');

    return await getTwitterUserByUsername(name);
};

const database: Database = {
    async addr(name, coinType) {
        try {
            if (coinType != 60) throw new Error('Not ETH');

            const twitter = await getENSSubdomain(name);

            const names = getENSName(twitter.name);

            const addr = await convertENStoAddress(names);

            return { addr, ttl: 0 };
        } catch (error) {
            logger.error(error);
        }

        return { addr: '', ttl: 0 };
    },
    contenthash(name) {
        return {
            contenthash: '',
            ttl: 0,
        };
    },
    async text(name, key) {
        logger.info('hiss', name, key);

        try {
            const twitter = await getENSSubdomain(name);

            if (key == 'avatar' && twitter.profile_image_url) {
                return {
                    value: new URL(twitter.profile_image_url).toString(),
                    ttl: 0,
                };
            }

            if (key == 'description') {
                return { value: twitter.description, ttl: 0 };
            }

            if (key == 'url') {
                return {
                    value: `https://twitter.com/${twitter.username}`,
                    ttl: 0,
                };
            }

            return { value: '', ttl: 0 };
        } catch (error) {
            logger.error(error);
        }

        return { value: '', ttl: 0 };
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
    await server.handleRequest(request, reply);
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
