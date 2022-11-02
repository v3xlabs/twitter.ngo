// Function that checks if a name is an ENS name
export const getENSName = (name: string) => {
    // Regex that checks if 'name' is a valid domain name

    const response = /(\S)+\.[a-z]+/.exec(name);

    if (!response || response.length === 0)
        throw new Error('Could not get ENS name from ' + name);

    return response.at(0);
};
