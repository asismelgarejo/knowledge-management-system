import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const DocumentationType = new GraphQLObjectType({
  name: "DocumentationType",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
  },
});
