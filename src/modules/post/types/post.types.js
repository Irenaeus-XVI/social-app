import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { userType } from '../../user/types/user.types.js';

export const attachmentType = new GraphQLObjectType({
  name: 'attachmentType',
  fields: {
    secure_url: { type: GraphQLString },
    public_id: { type: GraphQLString }
  }
});

export const postType = new GraphQLObjectType({
  name: 'postType',
  fields: {
    _id: { type: GraphQLID },
    content: { type: GraphQLString },
    attachments: { type: new GraphQLList(attachmentType) },
    likes: { type: new GraphQLList(GraphQLID) },
    tags: { type: new GraphQLList(GraphQLID) },
    deletedBy: { type: GraphQLID },
    isDeleted: { type: GraphQLBoolean },
    createdBy: { type: userType },
    updatedBy: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  }
});


export const postList =new GraphQLList(postType);

export const postListResponse = new GraphQLObjectType({
  name: 'postListResponse',
  fields: {
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
    data: { type: postList }
  }
})