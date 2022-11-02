import { createLogger } from '@lvksh/logger';
import { config } from 'dotenv';
import express from 'express';
import { createClient } from 'redis';
import { TwitterApi } from 'twitter-api-v2';

import { getTwitterUserByUsername } from './getTwitterUser';
import { getENSName } from './getENSName';
import { convertENStoAddress } from './convertENStoAddress';
import { providers } from 'ethers';

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

export const redis = createClient();

export const ethProvider = new providers.CloudflareProvider();

redis.on('error', (error) => console.log('Redis Client Error', error));

app.get('/:username', async (request, reply) => {
    const { username } = request.params;

    try {
        const result = await getTwitterUserByUsername(username);

        const name = getENSName(result.name);

        const addr = await convertENStoAddress(name);

        reply.send(addr);
    } catch (e) {
        console.log(e);
        reply.status(404).send();
    }
});

(async () => {
    await redis.connect();

    app.listen(port, () => {
        logger.info(`Ready to go on port ${port}`);
    });
})();
