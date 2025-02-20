import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import * as postResolver from "./post/service/post.resolver.js";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "mainSchemaQuery",
    description: "Main Schema Query",
    fields: {
      ...postResolver
    }
  })
})