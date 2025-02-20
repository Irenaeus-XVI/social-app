import { GraphQLBoolean, GraphQLEnumType, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { GENDER, PROVIDERS, ROLE } from "../../../common/constants/index.js";

export const userType = new GraphQLObjectType({
  name: 'userTypes',
  description: 'User Types',
  fields: {
    _id: { type: GraphQLID },
    userName: { type: GraphQLString },
    email: { type: GraphQLString },
    role: {
      type: new GraphQLEnumType({
        name: 'role',
        values: {
          ADMIN: { value: ROLE.ADMIN },
          USER: { value: ROLE.USER },
          SUPER_ADMIN: { value: ROLE.SUPER_ADMIN },
        }
      })
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    DOB: { type: GraphQLString },
    gender: {
      type: new GraphQLEnumType({
        name: 'gender',
        values: {
          MALE: { value: GENDER.MALE },
          FEMALE: { value: GENDER.FEMALE }
        }
      })
    },
    phone: { type: GraphQLString },
    provider: {
      type: new GraphQLEnumType({
        name: 'provider',
        values: {
          LOCAL: { value: PROVIDERS.LOCAL },
          GOOGLE: { value: PROVIDERS.GOOGLE },
          FACEBOOK: { value: PROVIDERS.FACEBOOK }
        }
      })
    },
    changeCredentialTime: { type: GraphQLString },
    confirmEmail: { type: GraphQLBoolean },
    twoStepVerification: { type: GraphQLBoolean },
    isDeleted: { type: GraphQLBoolean },
  }
})

export const userList = new GraphQLList(userType);