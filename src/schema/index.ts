import {mergeTypeDefs} from "@graphql-tools/merge"
import { usersGQLSchema } from "./users.js"
import { countriesGQLSchema } from "./countries.js"


export const mergedGQLSchema = mergeTypeDefs([usersGQLSchema,countriesGQLSchema])