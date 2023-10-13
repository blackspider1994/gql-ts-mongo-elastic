import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
  }

  type usersResponse {
    users: [User!]!
    pageInfo: pageInfo
  }
  type pageInfo {
    totalCount: Int
    lastPage: Int
    nextPage: Int
    totalPage: Int
  }

  input userInput {
    name: String
  }

  type Jobs {
    _id:ID!
    name:String
    isCompleted:Boolean
    isPending:Boolean
    inProgress:Boolean
    createdBy:User    
  }
  input jobInput  {
    name:String
  }
  type Mutation {
    createUser(input: userInput!): User
    updateUser(input: userInput!, id: ID!): User
    deleteUser(id: ID!): User!
    createJob(input:jobInput):Jobs
  }
  type Query {
    jobs(jobId:ID):Jobs
    users(
      pageSize: Int = 10
      pageNo: Int = 1
      sortBy: String = "_id"
      sortOrder: String ="DESC"
    ): usersResponse!
    user(id: ID): [User]
  }
`;
