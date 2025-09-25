import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

// Enum for LearningPathResourceStates
export const LearningPathResourceStatesEnum = new GraphQLEnumType({
  name: "LearningPathResourceStates",
  values: {
    PENDING: { value: "PENDING" },
    STUDYING: { value: "STUDYING" },
    FINISHED: { value: "FINISHED" },
  },
});

// Type for LearningPathGoal
export const LearningProveType = new GraphQLObjectType({
  name: "LearningPathGoal",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    prove: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Type for LearningResource
export const LearningResourceType = new GraphQLObjectType({
  name: "LearningResource",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    duration: { type: new GraphQLNonNull(GraphQLInt) },
    goals: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(LearningProveType))) },
    notes: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) },
  },
});

// LearningPath type
export const LearningPathType = new GraphQLObjectType({
  name: "LearningPath",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    initial_date: { type: new GraphQLNonNull(GraphQLString) },
    resources: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(LearningResourceType))) },
  },
});
