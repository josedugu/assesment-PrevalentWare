import { Prisma } from "../db/dbconnection.js";
import { validateToken } from "../utils/tokenValidation.js";
import { GraphQLError } from 'graphql';
import { Pagination, Token, Email } from "../utils/interfaces.js";

type UserType = [{
    id: string;
    email: string;
    emailVerified: string | null;
    termsAndConditionsAccepted: string | null;
    name: string;
    image: string;
    position: string | null;
    createdAt: Date;
    updatedAt: Date;
    roleId: string;
}]

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
                throw new GraphQLError('BAD REQUEST', {
                    extensions: {
                        code: 'BAD REQUEST',
                        http: { status: 400 },
                    },
                });
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
            try {
                const userEmailToFind = args.email
                const user: UserType = await Prisma.$queryRaw`SELECT * FROM "User" WHERE email = ${userEmailToFind};`;
                if (user.length > 0) {
                    return user[0]
                } else {
                    throw new GraphQLError('USER NOT FOUND', {
                        extensions: {
                            code: 'USER NOT FOUND',
                            http: { status: 404 },
                        },
                    });
                }

            } catch (error) {
                console.log(error);
                throw new GraphQLError('USER NOT FOUND', {
                    extensions: {
                        code: 'USER NOT FOUND',
                        http: { status: 404 },
                    },
                });
            }

        }
    }
}