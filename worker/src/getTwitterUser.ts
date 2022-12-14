import { redis, twitterClient } from '.';

type TwitterUser = {
    id: string; // '964183418899779584'
    name: string; // 'luc.computer 🇵🇹 ETHLisbon'
    username: string; // 'LucemansNL'
    description: string; // ''
    profile_image_url: string; // ''
};

// Gets the user data by username from the cache or from Twitter
export const getTwitterUserByUsername = async (username: string) => {
    const cachedUserData = await redis.get('twitter-user-' + username);

    if (cachedUserData) {
        return JSON.parse(cachedUserData) as TwitterUser;
    }

    const userData = await twitterClient.v2.userByUsername(username, {
        'user.fields': ['profile_image_url', 'description'],
    });

    if (!userData.data || userData.errors) {
        throw new Error(
            'Could not get user data' + JSON.stringify(userData.errors)
        );
    }

    console.log(userData.data);

    await redis.set('twitter-user-' + username, JSON.stringify(userData.data), {
        EX: 60 * 60 * 24, // Cache for 24 hours
    });

    return userData.data;
};
