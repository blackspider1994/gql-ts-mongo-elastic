import { MongoClient } from 'mongodb';
import { Database } from '../lib/types';

const url = `${process.env.MONGO_DB_URL}`

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url);

  const db = client.db('main');

  return {
    users: db.collection('users'),
    jobs:db.collection('job')
  };
};
