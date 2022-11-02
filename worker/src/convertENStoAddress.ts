import { ethProvider, redis } from '.';

// Function that given an ENS name resolves it to the address
export const convertENStoAddress = async (name: string) => {
    const cachedAddress = await redis.get('ens-' + name);

    if (cachedAddress) {
        return cachedAddress;
    }

    let ename = name;

    // Resolve lens names
    if (name.endsWith('.lens')) {
        ename = name + '.xyz';
    }

    // Get the address from the ENS name
    const address = await ethProvider.resolveName(ename);

    if (!address) {
        throw new Error('Could not resolve Address from ENS Name ' + name);
    }

    // Cache the address for 1 day
    await redis.set('ens-' + name, address, { EX: 60 * 60 * 24 });

    // Return the address
    return address;
};
