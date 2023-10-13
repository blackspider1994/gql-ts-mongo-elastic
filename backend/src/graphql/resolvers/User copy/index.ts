import { IResolvers } from '@graphql-tools/utils';
import { ObjectId } from 'mongodb';

import { Database, Users, pagiantedUser } from '../../../lib/types';
import { generatePaginationQuery } from '../../../util/redisListener';

export const userResolver: IResolvers = {
  Query: {
    users: async (
      _root: undefined,
      { pageNo, pageSize, sortBy, sortOrder }: { pageNo: number, pageSize: number, sortBy: string, sortOrder: string },
      { db }: { db: Database }
    ): Promise<pagiantedUser> => {
      let limit = 10;
      let page = 0;
      let sort = {};
      let order = 1;
      if (sortOrder) {
        switch (sortOrder) {
          case "ASC":
            order = 1
            break;
          case "DESC":
            order = -1

            break;
          default:
            order = 1

        }
      }
      if (pageNo < 1) {
        throw new Error("Page number should be greater than 0")
      }
      if (pageNo) {
        page = pageNo - 1
      }
      if (sortBy) {
        // @ts-ignore
        sort[sortBy] = order;
      }
      if (pageSize) {
        limit = pageSize
      }

      const users = await db.users.find({}).skip(page * limit).limit(limit).sort(sort).toArray();
      const totalCount = await db.users.count({});
      const totalPage = Math.round(totalCount / pageSize);
      const nextPage = pageNo + 1;
      return {
        users: users,
        pageInfo: {
          totalCount: totalCount,
          lastPage: totalCount > 0 && page > 0 ? page : null,
          nextPage: totalCount > 0 && nextPage <= totalPage ? nextPage : null,
          totalPage: totalPage
        }
      };
    },
    user: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Users[]> => {
      const userFound = await db.users.find({ _id: new ObjectId(id) }).toArray();
      return userFound;
    }
  },
  Mutation: {
    updateUser: async (
      _root: undefined,
      { input, id }: { input: any, id: string },
      { db }: { db: Database }
    ): Promise<Users> => {

      const { name } = input;

      const updateUser = await db.users.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { name: name } }, { returnDocument: 'after' });
      if (!updateUser.value) {
        throw new Error('failed to update user');

      }

      return updateUser.value

    },
    createUser: async (
      _root: undefined,
      { input }: { input: any },
      { db }: { db: Database }
    ): Promise<Users> => {

      const { name } = input;
      const createRes = await db.users.insertOne({
        _id: new ObjectId(),
        name: name,
      });
      if (createRes.insertedId) {
        let newUser = await db.users.findOne({ _id: createRes.insertedId });

        // @ts-ignore
        return newUser;
      }
      else {
        throw new Error('failed to create User!!!');

      }
    },
    deleteUser: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Users> => {
      const deleteRes = await db.users.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!deleteRes.value) {
        throw new Error('failed to delete User!!!');
      }


      return deleteRes.value;
    },
  },


};
