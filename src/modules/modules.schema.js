import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import * as postQueryResolver from "./post/resolver/query.resolver.js";
import * as postMutationResolver from "./post/resolver/mutation.resolver.js";
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "mainSchemaQuery",
    description: "Main Schema Query",
    fields: {
      ...postQueryResolver
    }
  }),
  mutation: new GraphQLObjectType({
    name: "mainSchemaMutation",
    description: "Main Schema Mutation",
    fields: {
      ...postMutationResolver
    }
  })
})