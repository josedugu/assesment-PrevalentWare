import { Prisma } from "../db/dbconnection.js";
import { validateToken, findRole } from "../utils/tokenValidation.js";
import { GraphQLError } from 'graphql';
import { Pagination } from "../utils/interfaces.js";

export const CountriesResolver={
    Query:{
        countries:async (_:any, args:Pagination, contextValue: any) =>{
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
            const roleId= session.User.roleId;
            const role= await findRole(roleId ?? '');
            if (role && role.name==="Admin" ||role && role.name==="Manager") {
                try {
                    const countries= await Prisma.country.findMany({
                        skip: args.skip||0,
                        take: args.take||10
                    })
                    return {
                        success: true,
                        total: countries.length,
                        countries
                    };
                } catch (error) {
                    console.log(error);
                    throw new GraphQLError('INTERNAL SERVER ERROR', {
                        extensions: {
                            code: 'INTERNAL SERVER ERROR',
                            http: { status: 500 },
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
        }
    }
}