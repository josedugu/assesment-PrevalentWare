import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone'
import { mergedGQLSchema } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";


const PORT1 = process.env.PORT || 4000
export const server = new ApolloServer({
    typeDefs: mergedGQLSchema,
    resolvers: resolvers,
    introspection: true
});

const start = async () => {
    try {
        await startStandaloneServer(server, {
            listen: { port: Number(PORT1) },
            context: async ({ req }) => {
                const token = req.headers.authorization || '';
                return { token }
            }
        });
        console.log("SERVIDOR CORRIENDO 🚀");

    } catch (error) {
        console.error(error);
    }
}

start()