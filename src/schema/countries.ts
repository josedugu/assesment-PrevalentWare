import {buildSchema} from "graphql"

export const countriesGQLSchema=buildSchema(`
    type Country {
        id: String
        name: String
    }
    type Query {
        countries(skip: Int, take: Int): countriesResponse!
    }
    type countriesResponse {
        success: Boolean!
        total: Int!
        countries:[Country!]
    }
`)