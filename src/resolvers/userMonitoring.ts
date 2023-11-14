import { Prisma } from "../db/dbconnection.js";
import { validateToken, findRole } from "../utils/tokenValidation.js";
import { GraphQLError } from 'graphql';
import { Pagination, Token, timeInterval } from "../utils/interfaces.js";

interface PaginationWithEmail extends Pagination {
    email: string,
    start: string,
    end: string
}

interface SpecificUseArgs extends timeInterval {
    country: string,
    usage: string,
}

export const UserMonitoringReslver = {
    Query: {
        userMonitoring: async (_: any, args: PaginationWithEmail, contextValue: Token) => {
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
                const data = await Prisma.userMonitoring.findMany({
                    where: {
                        User: {
                            email: args.email
                        },
                        AND: [
                            {
                                createdAt: {
                                    gte: new Date(args.start)
                                },
                            },
                            {
                                createdAt: {
                                    lte: new Date(args.end)
                                }
                            }
                        ]
                    },
                    skip: args.skip || 0,
                    take: args.take || 10
                })
                return {
                    success: true,
                    total: data.length,
                    data
                };
            } catch (error) {
                console.log(error);
                throw new GraphQLError('BAD REQUEST', {
                    extensions: {
                        code: 'BAD REQUEST',
                        http: { status: 400 },
                    },
                });
            }
        },
        firstThree: async (_: any, args: timeInterval, contextValue: Token) => {
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
            const roleId = session.User.roleId;
            const role = await findRole(roleId ?? '');
            if (role && role.name === "Admin") {
                try {

                    const result = await Prisma.user.findMany({
                        take: 3,
                        where: {
                            AND: [
                                {
                                    createdAt: {
                                        gte: new Date(args.start)
                                    },
                                },
                                {
                                    createdAt: {
                                        lte: new Date(args.end)
                                    }
                                }
                            ]
                        },
                        orderBy: {
                            UserMonitoring: {
                                _count: 'asc'
                            }
                        }
                    })
                    return {
                        success: true,
                        data: result
                    }
                } catch (error) {
                    console.log(error);
                    throw new GraphQLError('BAD REQUEST', {
                        extensions: {
                            code: 'BAD REQUEST',
                            http: { status: 400 },
                        },
                    });
                }
            } else {
                throw new GraphQLError('User is not authorized', {
                    extensions: {
                        code: 'UNAUTHORIZED',
                        http: { status: 401 },
                    },
                });
            }

        },
        specificUse: async (_: any, args: SpecificUseArgs, contextValue: Token) => {
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
            const roleId = session.User.roleId;
            const role = await findRole(roleId ?? '');
            if (role && role.name === "Admin") {
                try {
                    const result = await Prisma.user.findMany({
                        take: 3,
                        where: {
                            Country: {
                                some: {
                                    name: args.country
                                }
                            },
                            UserMonitoring: {
                                some: {
                                    description: args.usage
                                }
                            },
                            AND: [
                                {
                                    createdAt: {
                                        gte: new Date(args.start)
                                    },
                                },
                                {
                                    createdAt: {
                                        lte: new Date(args.end)
                                    }
                                }
                            ],
                        },
                        orderBy: {
                            UserMonitoring: {
                                _count: 'asc'
                            }
                        }
                    })
                    return {
                        success: true,
                        data: result
                    }
                } catch (error) {
                    console.log(error);
                    throw new GraphQLError('BAD REQUEST', {
                        extensions: {
                            code: 'BAD REQUEST',
                            http: { status: 400 },
                        },
                    });
                }
            } else {
                throw new GraphQLError('User is not authorized', {
                    extensions: {
                        code: 'UNAUTHORIZED',
                        http: { status: 401 },
                    },
                });
            }

        },
    }
}