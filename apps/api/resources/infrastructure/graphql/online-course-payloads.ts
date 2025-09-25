import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";

export const OnlineCourseRequestPayload = new GraphQLInputObjectType({
  name: "OnlineCourseRequestPayload",
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
