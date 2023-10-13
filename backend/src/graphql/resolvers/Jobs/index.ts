import { IResolvers } from '@graphql-tools/utils';
import { ObjectId } from 'mongodb';

import { Database, Jobs, pagiantedJob, pagiantedUser } from '../../../lib/types';
import { RedisClientType } from 'redis';

export const jobResolver: IResolvers = {
  Query: {
    jobs: async (
      _root: undefined,
      { jobId }: { jobId: string },
      { db }: { db: Database }
    ): Promise<Jobs|null> => {
      const jobResponse = await db.jobs.findOne({ _id: new ObjectId(jobId) });

 
      return jobResponse;
    },

  },
  Mutation: {

    createJob: async (
      _root: undefined,
      { input }: { input: any },
      { db, redisClient ,pubSub}: { db: Database, redisClient:RedisClientType,pubSub:RedisClientType }
    ): Promise<Jobs|null> => {
      const { name } = input;

      const createRes = await db.jobs.insertOne({
        _id: new ObjectId(),
        name: name,
        isCompleted: false,
        isPending: false,
        inProgress: false,
        createdBy: new ObjectId
      });

      if (createRes.insertedId) {
        const newJobFailedRedis = await db.jobs.findOne({ _id: createRes.insertedId });


        // const redisResponse = await redisClient.json.set(`jobs:${createRes.insertedId}`, '$', {
        //   name: name,
        //   isCompleted: false,
        //   isPending: false,
        //   inProgress: false,
        //   createdBy: new ObjectId
        // })
        const redisResponse=await redisClient.set(`jobs:${createRes.insertedId}`, JSON.stringify({id:createRes.insertedId,isPending:false}));

        if (redisResponse) {
          await redisClient.publish('jobs', `jobs:${createRes.insertedId}`);

          const newJob = await db.jobs.findOneAndUpdate({ _id: createRes.insertedId }, { $set: { inProgress: true } }, { returnDocument: 'after' });
          
          return newJob.value;

        } else {
          
          return newJobFailedRedis;

        }
      }
      else {
        throw new Error('failed to create User!!!');

      }
    },

  },


};
