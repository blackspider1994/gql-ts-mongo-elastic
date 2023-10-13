import { RedisClientType } from "redis";
import { Database } from "../lib/types";
import { ObjectId } from 'mongodb';

export const redisListener = async (redisClient: RedisClientType, redisPubSubClient: RedisClientType, db: Database) => {

  const listener = (message: any, channel: any) => {
    console.log(channel, message);
    processJob(redisClient, message, db);

  }
  await redisPubSubClient.subscribe('jobs', listener);

  for await (const key of redisClient.scanIterator({
    TYPE: 'string', // `SCAN` only
    MATCH: 'jobs:*'
  })) {
    // use the key!
    processJob(redisClient, key, db);
  }
}


async function processJob(redisClient: RedisClientType, key: string, db: Database) {


  const jobData = await redisClient.get(key);
  const jobDataParsed = jobData ? JSON.parse(jobData) : "";
  if (jobDataParsed?.id) {
    console.log(jobDataParsed?.id, " updating to in progress")
    db.jobs.updateOne({ _id: new ObjectId(jobDataParsed?.id) }, { $set: { isPending: false, inProgress: true } }).then(data => {
      redisClient.del(key);

      completeJob(jobDataParsed?.id)
    })

  }
  const completeJob = (
    jobId: string
  ) => {
    console.log(jobId," updating to complete")

    setTimeout(async function () {
      db.jobs.updateOne({ _id: new ObjectId(jobId) }, { $set: { isPending: false, inProgress: false, isCompleted: true } }).then(data => {
        console.log(jobId, " completed")
      })


    }, 20000)
  }
}