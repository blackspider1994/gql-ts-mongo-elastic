
import { createClient } from 'redis';

const url = `${process.env.REDIS_URL}`
export const connectRedis = async (): Promise<any> => {

    const client =await createClient({
        password: "9PtytN82bMNQscczEvRJb3vwi6R57IJb",
        socket: {
            host:url,
            port: 13166
        }
    }).on('error', err => console.log('Redis Client Error', err))
    .connect();
    return client;
};


export const pubsubRedis = async (): Promise<any> => {

    const client =await createClient({
        password: "9PtytN82bMNQscczEvRJb3vwi6R57IJb",
        socket: {
            host:url,
            port: 13166
        }
    }).on('error', err => console.log('Redis Client Error', err))
    .connect();
    return client;
};
