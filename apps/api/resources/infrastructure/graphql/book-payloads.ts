import { GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";

const ChapterType = GraphQLString;

const SectionInputType = new GraphQLInputObjectType({
  name: "SectionInput",
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    chapters: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ChapterType))) },
  },
});
// Definición de la unión Content (puede ser un Section o un Chapter)
const ContentInputType = new GraphQLInputObjectType({
  name: "ContentInput",
  fields: {
    section: { type: SectionInputType },
    chapter: { type: ChapterType },
  },
});

export const CreateBookRequestPayload = new GraphQLInputObjectType({
  name: "CreateBookRequestPayload",
  fields: () => ({
    isbn: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    edition: { type: new GraphQLNonNull(GraphQLInt) },
    cover: { type: new GraphQLNonNull(GraphQLString) },
    year: { type: new GraphQLNonNull(GraphQLInt) },
    authors: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) },
    description: { type: GraphQLString },
    categories: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) },
    tags: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) },
    contents: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ContentInputType))) },
    sources: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) },
  }),
});
