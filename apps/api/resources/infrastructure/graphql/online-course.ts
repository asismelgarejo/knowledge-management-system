import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const OnlineCourseType = new GraphQLObjectType({
  name: "OnlineCourseType",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
});
