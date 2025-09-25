import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLString,
  Kind,
} from "graphql";

export const DateType = new GraphQLScalarType({
  name: "Date",
  description: "Custom scalar type for Date",
  serialize(value: any) {
    return value.toISOString();
  },
  parseValue(value: any) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// LearningProve input type
export const LearningProveInputType = new GraphQLInputObjectType({
  name: "LearningProveInput",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    prove: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// LearningResource input type
export const LearningResourceInputType = new GraphQLInputObjectType({
  name: "LearningResourceInput",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    book: { type: new GraphQLNonNull(GraphQLString) },
    section: { type: new GraphQLNonNull(GraphQLString) },
    duration: { type: new GraphQLNonNull(GraphQLInt) },
    order: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const CreateLearningPathPayload = new GraphQLInputObjectType({
  name: "CreateLearningPathPayload",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    initial_date: { type: new GraphQLNonNull(DateType) },
    resources: { type: new GraphQLNonNull(new GraphQLList(LearningResourceInputType)) },
  }),
});
