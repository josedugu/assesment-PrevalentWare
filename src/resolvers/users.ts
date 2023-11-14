import { Prisma } from "../db/dbconnection.js";
import { validateToken } from "../utils/tokenValidation.js";
import { GraphQLError } from 'graphql';
import { Pagination, Token, Email } from "../utils/interfaces.js";

export const UsersResolver = {
    Query: {
        users: async (_: any, args: Pagination, contextValue: Token) => {
            const token = contextValue.token.replace("Bearer ", "");
            const session = await validateToken(token);
            if (!session) {
                throw new GraphQLError('User is not authenticated', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                        http: { status: 401 },
                    },
                });
            }
            try {
                const users = await Prisma.user.findMany({
                    skip: args.skip || 0,
                    take: args.take || 10
                })
                if (!users) throw new Error('No users found');
                return {
                    success: true,
                    total: users.length,
                    users
                };
            } catch (error) {

            }
        },
        userByEmail: async (_: any, args: Email, contextValue: any) => {
            const token = contextValue.token.replace("Bearer ", "");
            const session = await validateToken(token);
            if (!session) {
                throw new GraphQLError('User is not authenticated', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                        http: { status: 401 },
                    },
                });
            }
            const user = await Prisma.user.findUnique({
                where: {
                    email: args.email
                }
            })
            if (!user) {
                throw new GraphQLError('USER NOT FOUND', {
                    extensions: {
                        code: 'USER NOT FOUND',
                        http: { status: 404 },
                    },
                });
            }
            return user
        }
    }
}