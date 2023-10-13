import 'dotenv/config'

import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import { connectDatabase } from './database';
import { connectRedis ,pubsubRedis } from "./redis";
import { resolvers, typeDefs } from './graphql';
import {redisListener} from "./util/redisListener";

const PORT = process.env.PORT || 5000;

const mount = async (app: Application) => {
  try {
    const db = await connectDatabase();
    const redisClient = await connectRedis();
    const pubSub=await pubsubRedis();
    const server = new ApolloServer({ typeDefs, resolvers, context: () => ({ db, redisClient: redisClient ,pubSub}) });
    await server.start();
    server.applyMiddleware({ app, path: "/api" })
    redisListener(redisClient,pubSub,db);

    app.listen(PORT, () => console.log(`[app]: http://localhost:${PORT}`));

  } catch (error) {
    console.warn("central logs")
    console.error(error);

  }
}

mount(express())