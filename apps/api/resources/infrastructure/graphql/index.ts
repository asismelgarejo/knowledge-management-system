import { GraphQLSchema } from "graphql";
import { MutationType } from "./mutations";
import { QueryType } from "./queries";
export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
