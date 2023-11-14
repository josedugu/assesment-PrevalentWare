import { mergeTypeDefs } from "@graphql-tools/merge"
import { usersGQLSchema } from "./users.js"
import { countriesGQLSchema } from "./countries.js"
import { userMonitoringGQLSchema } from "./userMonitorins.js"

export const mergedGQLSchema = mergeTypeDefs([usersGQLSchema, countriesGQLSchema, userMonitoringGQLSchema])