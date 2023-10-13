import merge from "lodash.merge";
import { userResolver } from "./User";
import { jobResolver } from "./Jobs";

export const resolvers = merge(userResolver, jobResolver)