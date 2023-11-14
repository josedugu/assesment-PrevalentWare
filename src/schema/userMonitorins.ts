import { buildSchema } from "graphql"

export const userMonitoringGQLSchema = buildSchema(`
    scalar DateTime
    type UserMonitoring {
        id: String
        usage: Int
        description: String
        createdAt: DateTime
    }
    type user {
        email: String!
        name: String!
        image: String!
    }
    type Query {
        userMonitoring(skip: Int, take: Int, email:String, start:String, end:String): UserMonitoringResponse!
        firstThree(start:String, end:String):firstThree!
        specificUse(start:String, end:String, usage:String, country:String):firstThree!
    }
    type UserMonitoringResponse {
        success: Boolean!
        data:[UserMonitoring!]
    }
    type firstThree {
        success: Boolean!
        data:[user!]
    }
`)