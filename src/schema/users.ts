import { buildSchema } from "graphql"

export const usersGQLSchema = buildSchema(`
    enum Enum_RoleName {
        Admin
        Manager
        User
      }
    type Role {
        name: Enum_RoleName
    }
    type user {
        email: String
        name: String!
        image: String!
        position: String
        role: Role
    }
    type Query {
        users(skip: Int, take: Int): userResponse!
        userByEmail(email:String):user!
    }
    type userResponse {
        success: Boolean!
        total: Int!
        users:[user!]
    }
`)