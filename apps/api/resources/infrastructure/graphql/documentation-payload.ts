import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";

export const DocumentationRequestPayload = new GraphQLInputObjectType({
  name: "DocumentationRequestPayload",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
